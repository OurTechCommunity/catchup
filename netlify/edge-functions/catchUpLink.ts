import type { Config, Context } from "@netlify/edge-functions";

import { Deta } from "deta";
const deta = Deta();
const db = deta.Base(process.env.DATABASE_NAME!);

export default async function (
	req: Request,
	context: Context
): Promise<Response> {
	if (req.method == "GET") {
		const config = await db.get(process.env.DATABASE_OBJ_KEY!);
		return new Response(config?.value as string, {
			headers: {
				"content-type": "application/json"
			}
		});
	}

	let authResponse = auth(req);
	if (authResponse) authResponse;

	const link = (await req.json()).catchUpLink;
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
	let config = {
		catchUpLink: link,
		lastUpdated: new Date().toISOString()
	};
	await db.put(JSON.stringify(config), process.env.DATABASE_OBJ_KEY);

	return new Response("Meet link changed to ${link}.");
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
