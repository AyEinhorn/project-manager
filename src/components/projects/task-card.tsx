"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    assignee?: {
      name: string;
      image?: string;
      initials: string;
    };
    dueDate?: string;
    priority?: "low" | "medium" | "high";
    labels?: string[];
  };
}

export function TaskCard({ task }: TaskCardProps) {
  // Default values for the task
  const taskWithDefaults = {
    ...task,
    labels: task.labels || [],
    priority: task.priority || "medium",
    assignee: task.assignee || {
      name: "Unassigned",
      initials: "UN",
    },
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">{taskWithDefaults.title}</div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {taskWithDefaults.description}
          </p>
          {taskWithDefaults.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {taskWithDefaults.labels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs px-1">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex items-center gap-2">
          {taskWithDefaults.priority && (
            <Badge
              variant={
                taskWithDefaults.priority === "high"
                  ? "destructive"
                  : taskWithDefaults.priority === "medium"
                  ? "default"
                  : "secondary"
              }
              className="text-xs"
            >
              {taskWithDefaults.priority}
            </Badge>
          )}
        </div>
        {taskWithDefaults.assignee && (
          <Avatar className="h-6 w-6">
            {taskWithDefaults.assignee.image && (
              <AvatarImage
                src={taskWithDefaults.assignee.image}
                alt={taskWithDefaults.assignee.name}
              />
            )}
            <AvatarFallback className="text-xs">
              {taskWithDefaults.assignee.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </CardFooter>
    </Card>
  );
} 