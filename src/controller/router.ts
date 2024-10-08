import { ExecutionContext, URLPattern } from '@cloudflare/workers-types/experimental/index.js';
import wrapper from './wrapper.js'
import { Env, RequestObject } from '../types.js';

export default class Router {
	routes: any[][] = [];

  handle(request: Request, env: Env, ctx: ExecutionContext) {
		for (const route of this.routes) {
			const match = route[0](request);
			if (match) return route[1]({ ...match, request, env, ctx });
		}

    const match = this.routes.find(([matcher]) => matcher(request));
		if (match) return match[1](request, env, ctx);
	}

  register(handler: (requestObject: RequestObject) => Promise<Response | any>, path: string, method: string|undefined) {
		const urlPattern = new URLPattern({ pathname: path });
		this.routes.push([
			(request: Request) => {
				if (method === undefined || request.method.toLowerCase() === method) {
					const match = urlPattern.exec({ pathname: new URL(request.url).pathname });
					
					if (match) return { params: match.pathname.groups };
				}
			},
			(args) => handler(args),
		]);
	}

  options(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "options");
	}
	head(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "head");
	}
	get(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "get");
	}
	post(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "post");
	}
	put(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "put");
	}
	patch(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "patch");
	}
	delete(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, "delete");
	}
	all(path: string, handler: (requestObject: RequestObject) => Promise<Response | any>) {
		this.register(wrapper(handler), path, undefined);
	}
}
