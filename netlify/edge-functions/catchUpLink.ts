import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/edge-functions";
import { STORE_NAME, CONFIG_KEY } from "./common/config.ts";

export default async function (
	req: Request,
	context: Context
): Promise<Response> {
	if (req.method == "GET") {
		const config = await getStore(STORE_NAME).get(CONFIG_KEY, {
			type: "json"
		});
		return new Response(JSON.stringify(config, null, 4), {
			headers: {
				"content-type": "application/json"
			}
		});
	}

	let authResponse = auth(req);
	if (authResponse) authResponse;

	let link;
	const contentType = req.headers.get("content-type");
	if (!contentType || contentType.includes("application/json")) {
		const body = await req.json();
		link = body.catchUpLink;
	} else if (contentType.includes("application/x-www-form-urlencoded")) {
		const body = await req.formData();
		link = body.get("catchUpLink");
	} else
		return new Response(
			`Error: Unsupported content-type ${contentType}\n` +
				`Expected one of: "application/json" or "application/x-www-form-urlencoded"`,
			{
				status: 415
			}
		);

	try {
		new URL(link);
	} catch (e: any) {
		return new Response(
			`Error: Could not set CatchUp link ${link}: ${e?.message}`,
			{
				status: 400
			}
		);
	}
	await getStore(STORE_NAME).setJSON(CONFIG_KEY, {
		catchUpLink: link,
		lastUpdated: new Date().toISOString()
	});

	return new Response(`Meet link changed to ${link}.`);
}

function auth(req: Request): Response | null {
	const authHeader = req.headers.get("authorization");
	if (authHeader) {
		let [username, password] = Buffer.from(
			authHeader.split(" ")[1],
			"base64"
		)
			.toString()
			.split(":");

		if (
			username === process.env.ADMIN_USERNAME &&
			password === process.env.ADMIN_PASSWORD
		)
			return null;
	}

	return new Response(null, {
		status: 401,
		headers: {
			"WWW-Authenticate": "Basic"
		}
	});
}

export const config: Config = {
	path: "/api/catchUpLink"
};
