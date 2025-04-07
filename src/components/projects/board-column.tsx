"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskCard } from "@/components/projects/task-card";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority?: "low" | "medium" | "high";
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

interface BoardColumnProps {
  column: Column;
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  onAddTask: (taskData: { title: string; description: string; priority: string }) => void;
  onDeleteTask?: (taskId: string, columnId: string) => void;
  onUpdateTask?: (taskId: string, columnId: string, data: { title: string; description: string; priority: string }) => void;
}

export function BoardColumn({ 
  column, 
  columns, 
  setColumns, 
  onAddTask,
  onDeleteTask,
  onUpdateTask 
}: BoardColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<string>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    setIsSubmitting(true);
    
    onAddTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      priority: newTaskPriority
    });
    
    // Reset form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setIsAddingTask(false);
    setIsSubmitting(false);
  };

  const handleDeleteTask = (taskId: string) => {
    // Update columns state by removing the deleted task
    setColumns(prevColumns => {
      return prevColumns.map(col => {
        if (col.id === column.id) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId)
          };
        }
        return col;
      });
    });

    // Propagate deletion to parent component
    if (onDeleteTask) {
      onDeleteTask(taskId, column.id);
    }
  };

  const handleUpdateTask = (taskId: string, data: { title: string; description: string; priority: string }) => {
    // Update columns state with the updated task
    setColumns(prevColumns => {
      return prevColumns.map(col => {
        if (col.id === column.id) {
          return {
            ...col,
            tasks: col.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  title: data.title,
                  description: data.description,
                  priority: data.priority as "low" | "medium" | "high",
                };
              }
              return task;
            })
          };
        }
        return col;
      });
    });

    // Propagate update to parent component
    if (onUpdateTask) {
      onUpdateTask(taskId, column.id, data);
    }
  };

  return (
    <Card className="min-w-[300px] max-w-[300px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">
            {column.name}
            <span className="ml-2 text-muted-foreground text-sm font-normal">
              {column.tasks.length}
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <EllipsisIcon className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {column.tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard 
                        task={task} 
                        onDelete={handleDeleteTask}
                        onUpdate={handleUpdateTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {isAddingTask ? (
                <div className="space-y-3 mt-3">
                  <Input
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full"
                  />
                  <Textarea
                    placeholder="Task description (optional)"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="w-full"
                    rows={2}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newTaskPriority} 
                      onValueChange={setNewTaskPriority}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      onClick={handleAddTask}
                      disabled={!newTaskTitle.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskTitle("");
                        setNewTaskDescription("");
                        setNewTaskPriority("medium");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setIsAddingTask(true)}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add task
                </Button>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}

function EllipsisIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
} 