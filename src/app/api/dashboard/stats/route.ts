import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

// Use a singleton pattern for Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  try {
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

    // Count total projects for the user
    const totalProjects = await prisma.project.count({
      where: { ownerId: user.id },
    });

    // Get all tasks across all user projects
    const projects = await prisma.project.findMany({
      where: { ownerId: user.id },
      include: {
        tasks: {
          select: {
            id: true,
            completed: true,
          },
        },
      },
    });

    // Calculate task statistics
    let completedTasks = 0;
    let pendingTasks = 0;

    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.completed) {
          completedTasks++;
        } else {
          pendingTasks++;
        }
      });
    });

    return NextResponse.json({
      totalProjects,
      completedTasks,
      pendingTasks
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 