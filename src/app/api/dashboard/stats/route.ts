import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Count total projects for the user
    const totalProjects = await db.project.count({
      where: { userId: session.user.id },
    });

    // Get all tasks across all user projects
    const projects = await db.project.findMany({
      where: { userId: session.user.id },
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