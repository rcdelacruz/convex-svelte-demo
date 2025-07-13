import { query } from "./_generated/server";
import { v } from "convex/values";

// Query to get recent events for SSE
export const getRecent = query({
  args: {
    since: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const since = args.since ?? 0;
    const limit = args.limit ?? 10;

    let query = ctx.db.query("events");

    if (since > 0) {
      query = query.filter((q) => q.gt(q.field("timestamp"), since));
    }

    return await query
      .order("desc")
      .take(limit);
  },
});

// Query to get events by type
export const getByType = query({
  args: {
    type: v.string(),
    since: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const since = args.since ?? 0;
    const limit = args.limit ?? 10;

    let query = ctx.db
      .query("events")
      .withIndex("by_type", (q) => q.eq("type", args.type));

    if (since > 0) {
      query = query.filter((q) => q.gt(q.field("timestamp"), since));
    }

    return await query
      .order("desc")
      .take(limit);
  },
});
