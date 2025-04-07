"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/projects/task-card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Task {
  id: string;
  title: string;
  description: string;
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
}

export function BoardColumn({ column, columns, setColumns }: BoardColumnProps) {
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
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add task
              </Button>
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