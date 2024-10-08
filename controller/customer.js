import Router from './router.js'
import CustomerService from '../service/customer.service.js'

const apiRouter = new Router();
apiRouter.post("/api/customer/create", async ({ request, env }) => {
	const content = await request.json();

	const customer  = await CustomerService.createCustomer(env, content)

	return {
		status: 'success',
		message: `customer created #: ${customer.id}`,
		customer
	}
});

apiRouter.get("/api/customer/getAll", async ({ env }) => {
	const customers = await CustomerService.getCustomers(env)
	return {
		status: 'success',
		customers
	};
});

apiRouter.get("/api/customer/:id/get", async ({ env, params }) => {
	const customer = await CustomerService.getCustomerById(env, params.id);
	if (!customer)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${customer.id} found`,
		customer,
	}
});

apiRouter.put("/api/customer/:id/update", async ({ params, request, env }) => {
	const customer = await CustomerService.updateCustomerById(env, params.id, request.json());
	if (!customer)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${customer.id} found`,
		customer
	}
});

apiRouter.delete("/api/customer/:id/delete", async ({ params, env }) => {
	const isDeleted = await CustomerService.deleteCustomerById(env, params.id);
	if (!isDeleted)
		throw new Error('customer not found');

	return {
		status: 'success',
		message: `customer #: ${params.id} deleted`
	}
});

// 404 for everything else
apiRouter.all("*", ({ request }) =>  {
	throw {
		error: "customer path Not Found.",
		status: 404,
		url: request.url
	}
});

export default apiRouter;
