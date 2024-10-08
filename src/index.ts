import { ExecutionContext, ScheduledEvent } from '@cloudflare/workers-types/experimental/index.js';
import healthRouter from './controller/health.js';
import subscriptionPlanRouter from './controller/subscription-plan.js';
import { Env } from './types.js';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {

    const url = new URL(request.url);

    if (url.pathname.startsWith('/health')) {
      return healthRouter.handle(request, env, ctx);
    }

    if (url.pathname.startsWith('/api/subscription-plan')) {
      // You can also use more robust routing
      return subscriptionPlanRouter.handle(request, env, ctx);
    }

    return new Response(
			`<h1>Try making requests to:</h1>
      <ul>
      <li><code><a href="/api">/api</a></code>,</li>
      </ul>`,
			{ headers: { "Content-Type": "text/html" } }
		);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`Scheduled event triggered at: ${new Date(event.scheduledTime).toISOString()}`);
    // ctx.waitUntil(retryFailedPayments(env));
  },
};
