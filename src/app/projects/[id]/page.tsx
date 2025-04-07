"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { BoardColumn } from "@/components/projects/board-column";
import { ProjectHeader } from "@/components/projects/project-header";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

const mockProject = {
  id: "1",
  name: "Website Redesign",
  description: "Redesign the company website with modern design principles.",
  progress: 65,
  tasks: { total: 24, completed: 16 },
  members: 4,
  dueDate: "2023-12-15",
};

const mockColumns = [
  {
    id: "todo",
    name: "To Do",
    tasks: [
      { id: "1", title: "Research competitors", description: "Analyze top 5 competitor websites" },
      { id: "2", title: "Create wireframes", description: "Low-fidelity wireframes for homepage" },
      { id: "3", title: "Content audit", description: "Review and organize existing content" },
    ],
  },
  {
    id: "in-progress",
    name: "In Progress",
    tasks: [
      { id: "4", title: "Design system", description: "Create reusable components and style guide" },
      { id: "5", title: "User interviews", description: "Conduct 5 user interviews for feedback" },
    ],
  },
  {
    id: "review",
    name: "In Review",
    tasks: [
      { id: "6", title: "Homepage prototype", description: "Interactive prototype for homepage" },
      { id: "7", title: "SEO strategy", description: "Develop SEO improvement plan" },
    ],
  },
  {
    id: "done",
    name: "Done",
    tasks: [
      { id: "8", title: "Project kickoff", description: "Initial team meeting and scope definition" },
      { id: "9", title: "Site architecture", description: "Define site structure and navigation" },
      { id: "10", title: "Technology stack", description: "Select frontend and backend technologies" },
    ],
  },
];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [columns, setColumns] = useState(mockColumns);
  const project = mockProject;

  if (!project) {
    return <div>Project not found</div>;
  }
  
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
  };

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