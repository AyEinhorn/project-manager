"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { BoardColumn } from "@/components/projects/board-column";
import { ProjectHeader } from "@/components/projects/project-header";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

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
  priority?: "low" | "medium" | "high";
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProject = async () => {
    if (status !== "authenticated" || !projectId) return;
    
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      
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
      console.error("Error refreshing project data:", err);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (status !== "authenticated" || !projectId) return;
      
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        
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

    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      refreshProject();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [projectId, status]);

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
    
    // Check if this is a move to/from the "done" column to update completion status
    const isNowCompleted = destination.droppableId === 'done';
    const wasCompleted = source.droppableId === 'done';
    
    // Only update if completion status changed
    if (isNowCompleted !== wasCompleted) {
      // Update task completion status on the server
      updateTaskCompletion(task.id, isNowCompleted);
      
      // Update project stats for the progress bar
      if (project) {
        setProject({
          ...project,
          tasks: {
            ...project.tasks,
            completed: isNowCompleted 
              ? project.tasks.completed + 1 
              : project.tasks.completed - 1
          }
        });
      }
      
      // Refresh project data after a short delay
      setTimeout(() => refreshProject(), 1000);
    }
  };

  // Function to update task completion status
  const updateTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task completion status');
      }
    } catch (error) {
      console.error('Error updating task completion status:', error);
    }
  };

  const addTaskToColumn = async (columnId: string, taskData: { title: string; description: string; priority: string }) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          columnId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const data = await response.json();
      
      // Update the columns state with the new task
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: [...column.tasks, data.task]
            };
          }
          return column;
        });
      });
      
      // Check if task was added to "done" column
      const isCompleted = columnId === 'done';
      
      // Update project task count and completion status
      if (project) {
        setProject({
          ...project,
          tasks: {
            total: project.tasks.total + 1,
            completed: isCompleted ? project.tasks.completed + 1 : project.tasks.completed
          }
        });
      }
      
      // Refresh project data after a short delay
      setTimeout(() => refreshProject(), 1000);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId: string, columnId: string) => {
    try {
      // First, find the task to determine if it's completed
      const column = columns.find(col => col.id === columnId);
      const task = column?.tasks.find(t => t.id === taskId);
      const isCompleted = columnId === 'done';
      
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Update the columns state by removing the deleted task
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId)
            };
          }
          return column;
        });
      });
      
      // Update project task count and completion status
      if (project) {
        setProject({
          ...project,
          tasks: {
            total: project.tasks.total - 1,
            completed: isCompleted ? project.tasks.completed - 1 : project.tasks.completed
          }
        });
      }
      
      // Refresh project data after a short delay
      setTimeout(() => refreshProject(), 1000);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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
                  onAddTask={(taskData) => addTaskToColumn(column.id, taskData)}
                  onDeleteTask={deleteTask}
                  onUpdateTask={(taskId, columnId, data) => {
                    // Handle task updates
                    const isCompletedColumn = columnId === 'done';
                    const taskInColumn = columns.find(c => c.id === columnId)?.tasks.find(t => t.id === taskId);
                    
                    // Only update project stats if we have a valid task
                    if (taskInColumn && project) {
                      setProject({
                        ...project,
                        tasks: {
                          total: project.tasks.total,
                          completed: project.tasks.completed
                        }
                      });
                    }
                  }}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
} 