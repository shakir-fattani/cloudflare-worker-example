import wrapper from './wrapper.js'

export default class Router {
	routes = [];

  handle(request, env, ctx) {
		for (const route of this.routes) {
			const match = route[0](request);
			if (match) return route[1]({ ...match, request, env, ctx });
		}

    const match = this.routes.find(([matcher]) => matcher(request));
		if (match) return match[1](request, env, ctx);
	}

  register(handler, path, method) {
		const urlPattern = new URLPattern({ pathname: path });
		this.routes.push([
			(request) => {
				if (method === undefined || request.method.toLowerCase() === method) {
					const match = urlPattern.exec({ pathname: new URL(request.url).pathname });
					if (match) return { params: match.pathname.groups };
				}
			},
			(args) => handler(args),
		]);
	}

  options(path, handler) {
		this.register(wrapper(handler), path, "options");
	}
	head(path, handler) {
		this.register(wrapper(handler), path, "head");
	}
	get(path, handler) {
		this.register(wrapper(handler), path, "get");
	}
	post(path, handler) {
		this.register(wrapper(handler), path, "post");
	}
	put(path, handler) {
		this.register(wrapper(handler), path, "put");
	}
	patch(path, handler) {
		this.register(wrapper(handler), path, "patch");
	}
	delete(path, handler) {
		this.register(wrapper(handler), path, "delete");
	}
	all(path, handler) {
		this.register(wrapper(handler), path);
	}
}
