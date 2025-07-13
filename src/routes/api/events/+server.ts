import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  // Get the last event timestamp from query params
  const since = parseInt(url.searchParams.get('since') || '0');

  // Cloudflare Workers-compatible SSE with proper streaming
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let eventCount = 0;

      const send = (data: any) => {
        if (closed) return;
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
          eventCount++;
        } catch (error) {
          console.error('SSE send error:', error);
          closed = true;
          try {
            controller.close();
          } catch (e) {
            // Controller already closed
          }
        }
      };

      // Send initial connection event
      send({
        type: 'connected',
        timestamp: Date.now(),
        data: { message: 'Connected to SSE endpoint' }
      });

      // Send periodic heartbeats
      const sendHeartbeat = () => {
        if (!closed && eventCount < 10) { // Limit events to prevent infinite loops
          send({
            type: 'heartbeat',
            timestamp: Date.now(),
            data: { message: `Heartbeat #${eventCount}` }
          });

          // Schedule next heartbeat
          setTimeout(sendHeartbeat, 3000);
        } else if (!closed) {
          // Close after 10 events or 30 seconds
          closed = true;
          try {
            controller.close();
          } catch (e) {
            // Controller already closed
          }
        }
      };

      // Start heartbeat after 1 second
      setTimeout(sendHeartbeat, 1000);
    },

    cancel() {
      console.log('SSE stream cancelled by client');
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
};
