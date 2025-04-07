"use client";

import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
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

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const formattedDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add Task</DropdownMenuItem>
              <DropdownMenuItem>Add Team Member</DropdownMenuItem>
              <DropdownMenuItem>Add Column</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-muted/50 p-4 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium">Progress</p>
          <div className="flex items-center mt-1">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium">{project.progress}%</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm font-medium">Tasks</p>
            <p className="mt-1">
              {project.tasks.completed}/{project.tasks.total} Completed
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Due Date</p>
            <p className="mt-1">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Team</p>
            <div className="mt-1">
              <AvatarGroup maxCount={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
} 