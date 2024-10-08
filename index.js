import healthRouter from './controller/health.js';
import subscriptionPlanRouter from './controller/subscription-plan.js';

export default {
  async fetch(request, env, ctx) {

    const url = new URL(request.url);

    if (url.pathname === '/health') {
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
  }
};
