import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/edge-functions";
import { STORE_NAME, CONFIG_KEY } from "./common/config.ts";

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
		let config = await getStore(STORE_NAME).get(CONFIG_KEY, {
			type: "json"
		});
		if (!config?.catchUpLink)
			return new Response(
				"internal server error: could not fetch redirect config",
				{ status: 500 }
			);
		redirectUrl = config.catchUpLink;
	}

	return Response.redirect(redirectUrl);
}

export const config: Config = {
	path: "/attend"
};
