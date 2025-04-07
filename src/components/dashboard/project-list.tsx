"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign the company website with modern design principles.",
    progress: 65,
    tasks: { total: 24, completed: 16 },
    members: 4,
    dueDate: "2023-12-15",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Build a native mobile app for Android and iOS platforms.",
    progress: 40,
    tasks: { total: 32, completed: 12 },
    members: 6,
    dueDate: "2024-02-28",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Plan and execute Q4 marketing campaign for new product line.",
    progress: 80,
    tasks: { total: 18, completed: 14 },
    members: 3,
    dueDate: "2023-11-30",
  },
];

export function ProjectList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    progress: number;
    tasks: { total: number; completed: number };
    members: number;
    dueDate: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${project.progress}%` }}
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
            <p className="text-muted-foreground">Team Members</p>
            <p>{project.members}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Due Date</p>
            <p>{formattedDate}</p>
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