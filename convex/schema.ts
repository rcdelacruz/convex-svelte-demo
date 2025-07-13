import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    body: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
  
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_created", ["createdAt"])
    .index("by_completed", ["completed"]),
    
  events: defineTable({
    type: v.string(),
    data: v.any(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"])
    .index("by_type", ["type"]),
});
