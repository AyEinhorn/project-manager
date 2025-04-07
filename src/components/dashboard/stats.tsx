"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Projects" 
        value="12" 
        description="Active projects" 
        trend="+2 from last month" 
        trendUp 
      />
      <StatCard 
        title="Completed Tasks" 
        value="128" 
        description="Across all projects" 
        trend="+14 from last week" 
        trendUp 
      />
      <StatCard 
        title="Team Members" 
        value="8" 
        description="In your projects" 
      />
      <StatCard 
        title="Pending Tasks" 
        value="24" 
        description="Requiring attention" 
        trend="-3 from last week" 
        trendUp 
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