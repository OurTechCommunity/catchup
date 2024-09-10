import type { Config, Context } from "@netlify/edge-functions";
import allCatchupNumbers from "./common/built-catchup-numbers.ts";

export default async function (
	req: Request,
	context: Context
): Promise<Response> {
	let catchupNumber = context.params.catchupNumber?.toLowerCase();

	if (catchupNumber === "latest" || catchupNumber === "random") {
		let index = -1;
		if (catchupNumber === "latest") index = 0;
		else if (catchupNumber === "random")
			index = Math.floor(Math.random() * allCatchupNumbers.length);
		return Response.redirect(
			new URL(`/summary/${allCatchupNumbers[index]}`, req.url)
		);
	}

	let parsedCatchupNumber = parseInt(catchupNumber);
	// if entered path is not canonical but exists, redirect to the canonical path
	if (
		allCatchupNumbers.includes(parsedCatchupNumber) &&
		catchupNumber !== parsedCatchupNumber.toString()
	)
		return Response.redirect(
			new URL(`/summary/${parsedCatchupNumber}`, req.url)
		);
	// else, let netlify handle the response (success or 404)
	else return context.next();
}

export const config: Config = {
	path: "/summary/:catchupNumber"
};
