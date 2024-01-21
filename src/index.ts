/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// vue_example_store: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response | void> {
		if (request.method === 'OPTIONS') {
			// Handle OPTIONS request
			return handleOptions(request);
		} else {
			// Handle other requests
			return await handleRequest(request, env, ctx).catch((err) => {
				console.error(err);
				return new Response(err.stack || err, { status: 500 });
			});
		}
	},
};


async function handleRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);
	const path = url.pathname;

	if (path === "/addGray" && request.method === "POST") {
		const value = await request.json() as { source: string };
		let newSource = value.source.replace("fastly.", "").substring(0, value.source.indexOf("?") - 6)
		if (value.source.indexOf("blur") > -1) {
			newSource = newSource + "&blur"
		}
		newSource = newSource + "&grayscale"
		// return a JSON response
		return new Response(JSON.stringify({source: newSource}), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*',
			}
		});
		
	} else if (path === "/removeGray" && request.method === "POST") {
		const value = await request.json() as { source: string };
		let newSource = value.source.replace("fastly.", "").substring(0, value.source.indexOf("?") - 6)
		if (value.source.indexOf("blur") > -1) {
			newSource = newSource + "&blur"
		}
		// return a JSON response
		return new Response(JSON.stringify({source: newSource}), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*',
			}
		});

	} else if (path === "/addBlur" && request.method === "POST") {
		const value = await request.json() as { source: string };
		let newSource = value.source.replace("fastly.", "").substring(0, value.source.indexOf("?") - 6)
		if (value.source.indexOf("grayscale") > -1) {
			newSource = newSource + "&grayscale"
		}
		newSource = newSource + "&blur"
		return new Response(JSON.stringify({source: newSource}), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*',
			}
		});

	} else if (path === "/removeBlur" && request.method === "POST") {
		const value = await request.json() as { source: string };
		let newSource = value.source.replace("fastly.", "").substring(0, value.source.indexOf("?") - 6)
		if (value.source.indexOf("grayscale") > -1) {
			newSource = newSource + "&grayscale"
		}
		return new Response(JSON.stringify({source: newSource}), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*',
			}
		});
		
	} else {
		return new Response("Not found", { status: 404 });
	}
}



  async function handleOptions(request: Request) {
	if (
		request.headers.get('Origin') !== null &&
		request.headers.get('Access-Control-Request-Method') !== null &&
		request.headers.get('Access-Control-Request-Headers') !== null
	) {
		// Handle CORS preflight requests.
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*',
			},
		});
	} else {
		// Handle standard OPTIONS request.
		return new Response(null, {
			headers: {
				Allow: 'GET, HEAD, POST, OPTIONS, PUT, DELETE',
			},
		});
	}
}
