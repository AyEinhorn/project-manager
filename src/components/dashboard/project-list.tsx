"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Define the project type
interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: {
    total: number;
    completed: number;
  };
}

export function ProjectList() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [session]);

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You don't have any projects yet.</p>
        <Button asChild>
          <Link href="/projects/new">Create Your First Project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <Card className="flex items-center justify-center bg-muted/40 border-dashed hover:bg-muted/60 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Button asChild variant="outline" className="w-full">
            <Link href="/projects/new">
              <span className="mr-2">+</span> New Project
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  // Calculate progress percentage
  const progress = project.tasks.total > 0 
    ? Math.round((project.tasks.completed / project.tasks.total) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description || "No description"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Tasks</p>
            <p>
              {project.tasks.completed}/{project.tasks.total}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/projects/${project.id}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 