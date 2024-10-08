import Router from './router.js'
import SubscriptionPlanService from './../service/subscription-plan.service.js'

const apiRouter = new Router();
apiRouter.post("/api/subscription-plan", async ({ request, env, ctx }) => {
	const content = await request.json();
	const plan = await SubscriptionPlanService.createPlan(env, content)
	return new Response({
		status: 'success',
		message: `plan created #: ${plan.id}`,
		plan,
	})
});

apiRouter.get("/api/subscription-plan", ({ env }) => {
	const list = SubscriptionPlanService.getPlans(env)
	return new Response(list)
});

apiRouter.get("/api/subscription-plan/:id", ({ env, params }) => {
	const plan = SubscriptionPlanService.getPlanById(params.id);
	if (plan)
		return new Response({
			status: 'success',
			message: `plan #: ${plan.id} found`,
			plan,
		})
	
	return new Response({
		status: 'fail',
		message: 'plan not found'
	}, { status: 404 })
});

apiRouter.put("/api/subscription-plan", ({ request, env, ctx }) => new Response("plan Index!"));

apiRouter.delete("/api/subscription-plan", ({ request, env, ctx }) => new Response("plan Index!"));

// 404 for everything else
apiRouter.all("*", () => new Response("subscription-plan path Not Found.", { status: 404 }));

export default apiRouter;
