import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

// Task creation schema
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  columnId: z.string(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params to access its properties
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
        ownerId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = taskSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid task data", errors: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { title, description, columnId, priority } = validationResult.data;

    // Create the task
    const completed = columnId === "done"; // Mark as completed if in "done" column
    
    const task = await db.task.create({
      data: {
        title,
        description,
        completed,
        priority,
        projectId,
      },
    });

    return NextResponse.json(
      { 
        message: "Task created successfully", 
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 