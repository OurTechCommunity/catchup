import type { Config, Context } from "@netlify/edge-functions";

import { Deta } from "deta";
const deta = Deta();
const db = deta.Base(process.env.DATABASE_NAME!);

export default async function (
	req: Request,
	context: Context
): Promise<Response> {
	let date = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
	);

	let day = date.getDay(); // 6 is Saturday, 0 is Sunday
	let redirectUrl = "/?isCatchUpOn=false";

	if (day === 6 || day === 0) {
		// 6 is Saturday, 0 is Sunday
		let config = await db.get(process.env.DATABASE_OBJ_KEY!);
		if (!config?.value)
			return new Response(
				"internal server error: could not fetch redirect config",
				{ status: 500 }
			);
		redirectUrl = JSON.parse(config.value as string).catchUpLink;
	}

	return Response.redirect(redirectUrl);
}

export const config: Config = {
	path: "/attend"
};
