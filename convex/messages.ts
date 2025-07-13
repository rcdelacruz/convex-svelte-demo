import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all messages
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("messages")
      .order("desc")
      .take(limit);
  },
});

// Query to get messages with real-time updates
export const listRealtime = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20);
  },
});

// Mutation to send a new message
export const send = mutation({
  args: {
    author: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      author: args.author,
      body: args.body,
      timestamp: Date.now(),
    });
    
    // Also create an event for SSE
    await ctx.db.insert("events", {
      type: "message_sent",
      data: {
        messageId,
        author: args.author,
        body: args.body,
      },
      timestamp: Date.now(),
    });
    
    return messageId;
  },
});

// Mutation to delete a message
export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    
    // Create an event for SSE
    await ctx.db.insert("events", {
      type: "message_deleted",
      data: { messageId: args.id },
      timestamp: Date.now(),
    });
  },
});
