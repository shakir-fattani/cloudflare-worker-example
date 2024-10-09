import Router from './router'

const healthRouter = new Router();
healthRouter.get("/health", () => new Response("200 success", { status: 200 }));

// 404 for everything else inside this router
healthRouter.all("*", () => new Response("Not Found.", { status: 404 }));

export default healthRouter
