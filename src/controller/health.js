import Router from './router.js'

const apiRouter = new Router();
apiRouter.get("/health", () => new Response("200 success", { status: 200 }));

// 404 for everything else
apiRouter.all("*", () => new Response("Not Found.", { status: 404 }));

export default apiRouter;
