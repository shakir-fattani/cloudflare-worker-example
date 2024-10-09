import Router from './router.js'
import SubscriptionPlanService from '../service/subscription-plan.service.js'

const subscriptionPlanRouter = new Router();
subscriptionPlanRouter.post("/api/subscription-plan/create", async ({ request, env }) => {
	const content = await request.json();

	const plan = await SubscriptionPlanService.createPlan(env, content)

	return {
		status: 'success',
		message: `plan created #: ${plan.id}`,
		plan	
	}
});

subscriptionPlanRouter.get("/api/subscription-plan/getAll", async ({ env }) => {
	const plans = await SubscriptionPlanService.getPlans(env)
	return {
		status: 'success',
		plans,
	}
});

subscriptionPlanRouter.get("/api/subscription-plan/:id/get", async ({ env, params }) => {
	const plan = await SubscriptionPlanService.getPlanById(env, params.id);
	if (!plan)
		throw new Error('plan not found');

	return {
		status: 'success',
		message: `plan #: ${plan.id} found`,
		plan,
	}
});

subscriptionPlanRouter.put("/api/subscription-plan/:id/update", async ({ params, request, env }) => {
	const plan = await SubscriptionPlanService.updatePlanById(env, params.id, await request.json());
	if (!plan)
		throw new Error('plan not found');

	return {
		status: 'success',
		message: `plan #: ${plan.id} found`,
		plan
	}
});

subscriptionPlanRouter.delete("/api/subscription-plan/:id/delete", async ({ params, env }) => {
	
	const isDeleted = await SubscriptionPlanService.deletePlanById(env, params.id);
	if (!isDeleted)
		throw new Error('plan not found');

	return {
		status: 'success',
		message: `plan #: ${params.id} deleted`
	}
});

// 404 for everything else
subscriptionPlanRouter.all("*", ({ request }) =>  {
	throw {
		error: "subscription-plan path Not Found.",
		status: 404,
		url: request.url
	}
});

export default subscriptionPlanRouter;
