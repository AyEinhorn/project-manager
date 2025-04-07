import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

// Use a singleton pattern for Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch the project
    const project = await prisma.project.findUnique({
      where: { 
        id: projectId,
        ownerId: user.id, // Ensure the project belongs to the current user
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
          })),
        },
        {
          id: "in-progress",
          name: "In Progress",
          tasks: tasksByStatus["in-progress"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
          })),
        },
        {
          id: "review",
          name: "In Review",
          tasks: tasksByStatus["review"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
          })),
        },
        {
          id: "done",
          name: "Done",
          tasks: tasksByStatus["done"].map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
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