"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export function DashboardStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/dashboard/stats', {
        // Add cache busting parameter to ensure fresh data
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      setStats({
        totalProjects: data.totalProjects || 0,
        completedTasks: data.completedTasks || 0,
        pendingTasks: data.pendingTasks || 0
      });
    } catch (error) {
      console.error('Error refreshing dashboard stats:', error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        setStats({
          totalProjects: data.totalProjects || 0,
          completedTasks: data.completedTasks || 0,
          pendingTasks: data.pendingTasks || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      refreshStats();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(refreshInterval);
  }, [session]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Projects" value="—" description="Loading..." />
        <StatCard title="Completed Tasks" value="—" description="Loading..." />
        <StatCard title="Pending Tasks" value="—" description="Loading..." />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard 
        title="Total Projects" 
        value={stats.totalProjects.toString()} 
        description="Active projects" 
      />
      <StatCard 
        title="Completed Tasks" 
        value={stats.completedTasks.toString()} 
        description="Across all projects" 
      />
      <StatCard 
        title="Pending Tasks" 
        value={stats.pendingTasks.toString()} 
        description="Requiring attention" 
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, description, trend, trendUp }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M2 12h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? "text-green-500" : "text-red-500"}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 