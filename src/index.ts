import { ExecutionContext, ScheduledEvent } from '@cloudflare/workers-types';
import healthRouter from './controller/health';
import subscriptionPlanRouter from './controller/subscription-plan';
import customerRouter from './controller/customer';
import invoiceRouter from './controller/invoice';
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
    if (url.pathname.startsWith('/api/customer')) {
      // You can also use more robust routing
      return customerRouter.handle(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/invoice')) {
      // You can also use more robust routing
      return invoiceRouter.handle(request, env, ctx);
    }

    return new Response(
			`<h1>Try making requests to respective controllers:</h1>
      <ul>
        <li><code><a href="/health">/health</a></code>,</li>
        <li><code><a href="/api/subscription-plan">/api/subscription-plan</a></code>.</li>
        <li><code><a href="/api/customer">/api/customer</a></code>.</li>
        <li><code><a href="/api/invoice">/api/invoice</a></code>.</li>
      </ul>`,
			{ headers: { "Content-Type": "text/html" } }
		);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`Scheduled event triggered at: ${new Date(event.scheduledTime).toISOString()}`);
    // ctx.waitUntil(retryFailedPayments(env));
  },
};
