import Router from './router.js'

const apiRouter = new Router();
apiRouter.get("/health", ({ request, env, ctx }) => new Response("200 success", { status: 200 }));
apiRouter.get("/api/todos", ({ request, env, ctx }) => new Response("Todos Index!"));
apiRouter.get("/api/todos/:id", ({ params, request, env, ctx }) => new Response(`Todo #${params.id}`));

// POST to the collection (we'll use async here)
apiRouter.post("/api/todos", async ({ request, env, ctx }) => {
	const content = await request.json();

	return new Response("Creating Todo: " + JSON.stringify(content));
});

// 404 for everything else
apiRouter.all("*", () => new Response("Not Found.", { status: 404 }));

export default apiRouter;
