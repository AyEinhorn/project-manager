"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { BoardColumn } from "@/components/projects/board-column";
import { ProjectHeader } from "@/components/projects/project-header";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  tasks: {
    total: number;
    completed: number;
  };
  columns: Column[];
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string | null;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (status !== "authenticated") return;
      
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Project not found");
          } else {
            setError("Failed to load project");
          }
          return;
        }
        
        const data = await response.json();
        setProject(data.project);
        setColumns(data.project.columns);
      } catch (err) {
        setError("An error occurred while loading the project");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id, status]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item is dropped in its original position
    if (!destination || 
      (destination.droppableId === source.droppableId && 
       destination.index === source.index)) {
      return;
    }
    
    // Create a copy of columns state
    const newColumns = [...columns];
    
    // Find source and destination columns
    const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = columns.findIndex(col => col.id === destination.droppableId);
    
    // Find the task being moved
    const task = columns[sourceColIndex].tasks[source.index];
    
    // Remove task from source column
    newColumns[sourceColIndex].tasks.splice(source.index, 1);
    
    // Add task to destination column
    newColumns[destColIndex].tasks.splice(destination.index, 0, task);
    
    // Update state
    setColumns(newColumns);
    
    // TODO: Update the task status on the server
    // This would be implemented in a real application
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">{error || "Project not found"}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <ProjectHeader project={project} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Project Board</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((column) => (
                <BoardColumn 
                  key={column.id} 
                  column={column} 
                  columns={columns}
                  setColumns={setColumns}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
} 