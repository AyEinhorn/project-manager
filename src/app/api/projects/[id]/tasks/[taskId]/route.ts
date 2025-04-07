import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

// Task update schema
const taskUpdateSchema = z.object({
  title: z.string().min(1, "Task title is required").optional(),
  description: z.string().optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const { id: projectId, taskId } = params;
    
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
        ownerId: session.user.id,
      },
      include: {
        tasks: {
          where: {
            id: taskId,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.tasks.length === 0) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Delete the task
    await db.task.delete({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const { id: projectId, taskId } = params;
    
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
        ownerId: session.user.id,
      },
      include: {
        tasks: {
          where: {
            id: taskId,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.tasks.length === 0) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = taskUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid task data", errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Update the task
    const task = await db.task.update({
      where: {
        id: taskId,
        projectId: projectId,
      },
      data: validationResult.data,
    });

    return NextResponse.json(
      { 
        message: "Task updated successfully",
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          priority: task.priority
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 