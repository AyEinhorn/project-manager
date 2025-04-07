import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Make sure to await params before accessing id
    const { id } = params;
    const projectId = id;
    
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the project
    const project = await db.project.findUnique({
      where: { 
        id: projectId,
        userId: session.user.id, // Ensure the project belongs to the current user
      },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Group tasks by their completion status for board view
    const tasksByStatus = {
      "todo": project.tasks.filter(task => !task.completed && task.description?.includes("todo")),
      "in-progress": project.tasks.filter(task => !task.completed && task.description?.includes("in-progress")),
      "review": project.tasks.filter(task => !task.completed && task.description?.includes("review")),
      "done": project.tasks.filter(task => task.completed),
    };

    // Format project data for frontend
    const formattedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      tasks: {
        total: project.tasks.length,
        completed: project.tasks.filter(task => task.completed).length,
      },
      columns: [
        {
          id: "todo",
          name: "To Do",
          tasks: tasksByStatus["todo"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
          })),
        },
        {
          id: "in-progress",
          name: "In Progress",
          tasks: tasksByStatus["in-progress"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
          })),
        },
        {
          id: "review",
          name: "In Review",
          tasks: tasksByStatus["review"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
          })),
        },
        {
          id: "done",
          name: "Done",
          tasks: tasksByStatus["done"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
          })),
        },
      ],
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Make sure to await params before accessing id
    const { id } = params;
    const projectId = id;
    
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify project exists and belongs to the user
    const project = await db.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Delete the project (cascade deletion will handle tasks)
    await db.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 