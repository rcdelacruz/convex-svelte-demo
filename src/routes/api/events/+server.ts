import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  // Get the last event timestamp from query params
  const since = parseInt(url.searchParams.get('since') || '0');

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      let intervalId: NodeJS.Timeout | null = null;
      let isActive = true;
      let isClosed = false;

      const safeEnqueue = (data: string) => {
        if (!isClosed && isActive) {
          try {
            controller.enqueue(data);
          } catch (error) {
            console.log('Controller closed, stopping SSE');
            isClosed = true;
            isActive = false;
          }
        }
      };

      // Send initial connection message
      safeEnqueue(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

      // Poll for new events every 3 seconds
      intervalId = setInterval(async () => {
        if (!isActive || isClosed) {
          if (intervalId) {
            clearInterval(intervalId);
          }
          return;
        }

        try {
          // For now, just send heartbeat and demo events
          // In a real implementation, you would query your Convex backend here
          const demoEvents = [
            {
              _id: `demo-${Date.now()}`,
              type: 'heartbeat',
              timestamp: Date.now(),
              data: { message: 'System heartbeat' }
            }
          ];

          // Send demo events
          for (const event of demoEvents) {
            safeEnqueue(`data: ${JSON.stringify(event)}\n\n`);
          }
        } catch (error) {
          console.error('SSE Error:', error);
          safeEnqueue(`data: ${JSON.stringify({
            type: 'error',
            message: 'Failed to fetch events',
            timestamp: Date.now()
          })}\n\n`);
        }
      }, 3000);

      // Cleanup on close
      return () => {
        isActive = false;
        isClosed = true;
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    },

    cancel() {
      // Stream was cancelled
      console.log('SSE stream cancelled');
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
