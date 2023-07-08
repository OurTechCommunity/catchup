const https = require("https");

async function fetch(url, options = {}) {
	return new Promise((resolve, reject) => {
		let req = https.request(url, options, (res) => {
			let data = [];
			res.on("data", (d) => data.push(d));
			res.on("end", (e) => {
				let rawData = Buffer.concat(data).toString();
				resolve({
					headers: res.headers,
					status: res.statusCode,
					text: async () => rawData,
					json: async () => JSON.parse(rawData)
				});
			});
		});

		req.on("error", reject);

		if (options.body && options.method != "GET" && options.method != "HEAD")
			req.write(options.body);

		req.end();
	});
}

let BOT_TOKEN;

const BASE_URL = "https://api.telegram.org";
async function sendApiRequestRaw(method, body = {}) {
	let url = `${BASE_URL}/bot${BOT_TOKEN}/${method}`;
	return fetch(url, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(body)
	});
}

async function sendApiRequest(method, body) {
	return sendApiRequestRaw(method, body).then((e) => e.json());
}

async function sendMessageToChat(chat_id, text) {
	return sendApiRequest("sendMessage", {
		chat_id,
		text,
		parse_mode: "html",
		disable_web_page_preview: true
	});
}

async function sendAndPinMessageToChat(chat_id, text) {
	let { message_id } = await sendMessageToChat(text);
	return sendApiRequest("pinChatMessage", {
		chat_id,
		message_id
	});
}

async function main() {
	BOT_TOKEN = process.env.BOT_TOKEN;
	if (typeof BOT_TOKEN !== "string") {
		console.error("missing value for env variable: BOT_TOKEN");
		return 1;
	}

	let chat_id = process.env.TELEGRAM_CHAT_ID;
	if (typeof chat_id !== "string") {
		console.error("missing value for env variable: TELEGRAM_CHAT_ID");
		return 1;
	}

	let message = process.env.TELEGRAM_MESSAGE;
	if (typeof message !== "string") {
		console.error("missing value for env variable: TELEGRAM_MESSAGE");
		return 1;
	}

	await sendAndPinMessageToChat(chat_id, message);
}

if (require.main)
	main()
		.then((exitCode) => {
			if (typeof exitCode == "number") process.exit(exitCode);
		})
		.catch((e) => {
			console.error(e);
			process.exit(2);
		});
