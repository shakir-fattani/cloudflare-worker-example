import Router from './router.js'
import CustomerService from '../service/customer.service'

const customerRouter = new Router();
customerRouter.post("/api/customer/create", async ({ request, env }) => {
	const content = await request.json();

	const customer  = await CustomerService.createCustomer(env, content)

	return {
		status: 'success',
		message: `customer created #: ${customer.id}`,
		customer
	}
});

customerRouter.get("/api/customer/getAll", async ({ env }) => {
	const customers = await CustomerService.getCustomers(env)
	return {
		status: 'success',
		customers
	};
});

customerRouter.get("/api/customer/:id/get", async ({ env, params }) => {
	const customer = await CustomerService.getCustomerById(env, params.id);
	if (!customer)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${customer.id} found`,
		customer,
	}
});

customerRouter.put("/api/customer/:id/update", async ({ params, request, env }) => {
	const customer = await CustomerService.updateCustomerById(env, params.id, await request.json());
	if (!customer)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${customer.id} found`,
		customer
	}
});

customerRouter.post("/api/customer/:id/apply-subscription-plan", async ({ params, request, env }) => {
	const { subscription_plan_id } = request.json() as unknown as { subscription_plan_id: string }
	const customer = await CustomerService.updateSubscriptionById(env, params.id, subscription_plan_id);
	if (!customer)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${customer.id} found`,
		customer
	}
});

customerRouter.delete("/api/customer/:id/delete", async ({ params, env }) => {
	const isDeleted = await CustomerService.deleteCustomerById(env, params.id);
	if (!isDeleted)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${params.id} deleted`
	}
});

// 404 for everything else
customerRouter.all("*", ({ request }) =>  {
	throw {
		error: "customer path Not Found.",
		status: 404,
		url: request.url
	}
});

export default customerRouter;
