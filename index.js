const os = require("os");
const fs = require("fs");
const express = require("express");
const { Deta } = require("deta");

require("dotenv").config();

const app = express();

let db = null;
if (process.env.DETA_PROJECT_KEY) {
	const deta = Deta(process.env.DETA_PROJECT_KEY);
	db = deta.Base(process.env.DATABASE_NAME);
} else {
	db = {
		async put(value, key) {
			this[key] = value;
		},
		async get(key) {
			return {
				value: this[key]
			};
		}
	};
}

// Static files
app.use("/public", express.static(__dirname + "/public"));

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/admin", (req, res) => {
	res.sendFile(__dirname + "/public/html/admin.html");
});

app.get("/robots.txt", (req, res) => {
	res.sendFile(__dirname + "/public/robots.txt");
});

app.get("/api/catchUpLink", async (req, res) => {
	const config = await db.get(process.env.DATABASE_OBJ_KEY);
	res.send(config.value);
});

app.get("/summary", (req, res) => {
	res.sendFile(__dirname + "/public/html/summary/combined-summary.html");
});

app.get("/summaries", (req, res) => {
	res.redirect("/summary");
});

app.get("/summary/:catchupNumber", (req, res) => {
	let catchupNumber = req.params.catchupNumber.toLowerCase();
	if (catchupNumber === "latest" || catchupNumber === "random") {
		// get summary numbers in descending order
		let sortedCatchupNumbers = fs
			.readdirSync(__dirname + `/public/html/summary`)
			.map((file) => parseInt(file.replace(/\.html/, "")))
			.filter((number) => !Number.isNaN(number))
			.sort((a, b) => b - a);

		let index = -1;
		if (catchupNumber === "latest") index = 0;
		else if (catchupNumber === "random")
			index = Math.floor(Math.random() * sortedCatchupNumbers.length);
		res.redirect(`/summary/${sortedCatchupNumbers[index]}`);
		return;
	}

	let parsedCatchupNumber = parseInt(catchupNumber).toString();
	let normalizedCatchupNumber = parsedCatchupNumber.padStart(3, "0");

	const path =
		__dirname + `/public/html/summary/${normalizedCatchupNumber}.html`;
	if (fs.existsSync(path)) {
		// if entered path is not canonical, redirect to the canonical path
		if (catchupNumber !== parsedCatchupNumber)
			res.redirect(`/summary/${parsedCatchupNumber}`);
		else res.sendFile(path);
	} else res.status(404).sendFile(__dirname + "/public/html/404.html");
});

app.get("/showcase", (req, res) => {
	res.sendFile(__dirname + "/public/html/project-showcase-form.html");
});

app.get("/cfp", (req, res) => {
	res.redirect(
		"https://talks.ourtech.community/cfp"
	);
});

app.get("/ideas", (req, res) => {
	res.redirect(
		"https://docs.google.com/document/d/1K67G2_0w3-MEOcrakJrvStwHDz4zhlSliycHDa5oTGk/edit?usp=sharing"
	);
});

function auth(req, res) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401);
		res.setHeader("WWW-Authenticate", "Basic");
		res.end();
		return false;
	}

	let [username, password] = new Buffer.from(
		authHeader.split(" ")[1],
		"base64"
	)
		.toString()
		.split(":");

	if (
		username === process.env.ADMIN_USERNAME &&
		password === process.env.ADMIN_PASSWORD
	)
		return true;
	else {
		res.status(401);
		res.setHeader("WWW-Authenticate", "Basic");
		res.end();
		return false;
	}
}

app.post("/api/catchUpLink", async (req, res) => {
	if (!auth(req, res)) return;

	const link = req.body.catchUpLink;

	try {
		const url = new URL(link);
	} catch (e) {
		res.status(400).send({
			error: `Error: Could not set CatchUp link ${link}: ${e.message}`
		});
		return;
	}
	let config = {};
	config.catchUpLink = link;
	config.lastUpdated = new Date().toISOString();
	config = JSON.stringify(config);

	await db.put(config, process.env.DATABASE_OBJ_KEY);

	res.send(`Meet link changed to ${link}.`);
});

app.get("/attend", async (req, res) => {
	let date = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
	);

	let day = date.getDay(); // 6 is Saturday, 0 is Sunday
	let redirectUrl = "/?isCatchUpOn=false";

	if (day === 6 || day === 0) {
		// 6 is Saturday, 0 is Sunday
		let config = await db.get(process.env.DATABASE_OBJ_KEY);
		config = JSON.parse(config.value);
		redirectUrl = config.catchUpLink;
	}

	res.redirect(redirectUrl);
});

app.get("*", (req, res) => {
	res.status(404).sendFile(__dirname + "/public/html/404.html");
});

module.exports = app;

// Listening port
if (!process.env.DETA_RUNTIME) {
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, (err) => {
		if (err) console.log(err);
		else
			console.log(
				`Server started on port ${PORT}...\nAccess the web app at http://localhost:${PORT}`
			);
	});
}
