import apiRouter from './controller.js';

export default {
  async fetch(request, env, ctx) {

    if (url.pathname === '/health' || url.pathname.startsWith('/api/')) {
      // You can also use more robust routing
      return apiRouter.handle(request, env, ctx);
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
