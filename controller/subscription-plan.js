import Router from './router.js'
import SubscriptionPlanService from './../service/subscription-plan.service.js'

const apiRouter = new Router();
apiRouter.post("/api/subscription-plan", async ({ request, env, ctx }) => {
	const content = await request.json();
	const plan = await SubscriptionPlanService.createPlan(env, content)
	return {
		status: 'success',
		message: `plan created #: ${plan.id}`,
		plan,
	}
});

apiRouter.get("/api/subscription-plan", ({ env }) => {
	const list = SubscriptionPlanService.getPlans(env)
	return list
});

apiRouter.get("/api/subscription-plan/:id", ({ env, params }) => {
	const plan = SubscriptionPlanService.getPlanById(params.id);
	if (!plan)
		throw new Error('plan not found');

	return {
		status: 'success',
		message: `plan #: ${plan.id} found`,
		plan,
	}
});

apiRouter.put("/api/subscription-plan", ({ request, env, ctx }) => "plan Index!");

apiRouter.delete("/api/subscription-plan", ({ request, env, ctx }) => "plan Index!");

// 404 for everything else
apiRouter.all("*", () => new Response("subscription-plan path Not Found.", { status: 404 }));

export default apiRouter;
