import Router from './router.js'
import InvoiceService from '../service/invoice.service'

const apiRouter = new Router();
apiRouter.post("/api/invoice/create", async ({ request, env }) => {
	const invoice  = await InvoiceService.createInvoice(env, await request.json())

	return {
		status: 'success',
		message: `invoice created #: ${invoice.id}`,
		invoice
	}
});

apiRouter.get("/api/invoice/getAll", async ({ env }) => {
	const invoice = await InvoiceService.getInvoices(env)
	return {
		status: 'success',
		invoice
	};
});

apiRouter.get("/api/invoice/get/:customerId", async ({ env, params }) => {
	const invoices = await InvoiceService.getInvoicesByCustomerId(env, params.customerId)
	return {
		status: 'success',
		invoices
	};
});

apiRouter.get("/api/invoice/:id/get", async ({ env, params }) => {
	const invoice = await InvoiceService.getInvoiceById(env, params.id);
	if (!invoice)
		throw new Error('invoice not found');

	return {
		status: 'success',
		message: `invoice #: ${invoice.id} found`,
		invoice,
	}
});

apiRouter.put("/api/invoice/:id/update", async ({ params, request, env }) => {
	const invoice = await InvoiceService.updateInvoiceById(env, params.id, await request.json());
	if (!invoice)
		throw new Error('invoice not found');

	return {
		status: 'success',
		message: `invoice #: ${invoice.id} found`,
		invoice
	}
});

// 404 for everything else
apiRouter.all("*", ({ request }) =>  {
	throw {
		error: "invoice path Not Found.",
		status: 404,
		url: request.url
	}
});

export default apiRouter;
