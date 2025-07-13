import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all tasks
export const list = query({
  args: {
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("tasks");
    
    if (args.completed !== undefined) {
      query = query.withIndex("by_completed", (q) => q.eq("completed", args.completed));
    }
    
    return await query.order("desc").collect();
  },
});

// Mutation to create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    
    // Create an event for SSE
    await ctx.db.insert("events", {
      type: "task_created",
      data: {
        taskId,
        title: args.title,
        description: args.description,
      },
      timestamp: now,
    });
    
    return taskId;
  },
});

// Mutation to toggle task completion
export const toggle = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: Date.now(),
    };
    
    await ctx.db.replace(args.id, updatedTask);
    
    // Create an event for SSE
    await ctx.db.insert("events", {
      type: "task_updated",
      data: {
        taskId: args.id,
        completed: updatedTask.completed,
      },
      timestamp: Date.now(),
    });
    
    return updatedTask;
  },
});

// Mutation to delete a task
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    
    // Create an event for SSE
    await ctx.db.insert("events", {
      type: "task_deleted",
      data: { taskId: args.id },
      timestamp: Date.now(),
    });
  },
});
