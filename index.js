const os = require("os");
const fs = require("fs");
const express = require("express");
const { Deta } = require("deta");

require("dotenv").config();

const app = express();

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base(process.env.DATABASE_NAME);

// Static files
app.use("/public", express.static(__dirname + "/public"));

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/og-large", (req, res) => {
	res.sendFile(__dirname + "/public/html/admin.html");
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
	let catchupNumber = req.params.catchupNumber;
	const originalCatchUpNumber = catchupNumber;

	if (isNaN(parseInt(catchupNumber))) {
		res.end("Invalid CatchUp Number");
		return;
	}

	if (catchupNumber.length === 1) catchupNumber = "00" + catchupNumber;
	if (catchupNumber.length === 2) catchupNumber = "0" + catchupNumber;

	const path = __dirname + `/public/html/summary/${catchupNumber}.html`;

	if (fs.existsSync(path)) {
		if (
			originalCatchUpNumber.length === 1 ||
			originalCatchUpNumber.length === 2
		)
			res.redirect(`/summary/${catchupNumber}`);
		else res.sendFile(path);
	} else res.end("Invalid CatchUp Number");
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
