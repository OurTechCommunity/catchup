import * as fs from "fs";
import type { Config, Context } from "@netlify/functions";

export default async function (
	req: Request,
	context: Context
): Promise<Response> {
	let catchupNumber = context.params.catchupNumber?.toLowerCase();
	if (catchupNumber === "latest" || catchupNumber === "random") {
		// get summary numbers in descending order
		let sortedCatchupNumbers = fs
			.readdirSync(`${__dirname}/public/html/summary`)
			.map((file) => parseInt(file.replace(/\.html/, "")))
			.filter((number) => !Number.isNaN(number))
			.sort((a, b) => b - a);

		let index = -1;
		if (catchupNumber === "latest") index = 0;
		else if (catchupNumber === "random")
			index = Math.floor(Math.random() * sortedCatchupNumbers.length);
		return Response.redirect(`/summary/${sortedCatchupNumbers[index]}`);
	}

	let parsedCatchupNumber = parseInt(catchupNumber).toString();
	let normalizedCatchupNumber = parsedCatchupNumber.padStart(3, "0");

	const path = `${__dirname}/public/html/summary/${normalizedCatchupNumber}.html`;
	if (fs.existsSync(path)) {
		// if entered path is not canonical, redirect to the canonical path
		if (catchupNumber !== parsedCatchupNumber)
			return Response.redirect(`/summary/${parsedCatchupNumber}`);
		else return new Response(fs.readFileSync(path));
	} else
		return new Response(
			fs.readFileSync(`${__dirname}/public/html/404.html`),
			{ status: 404 }
		);
}

export const config: Config = {
	path: "/summary/:catchupNumber"
};
