const os = require("os");
const express = require("express");

require("dotenv").config();
const catchup = require("./catchup");

const app = express();

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

app.get("/api/catchUpLink", (req, res) => {
	let config = catchup.loadConfig();
	res.send({
		catchUpLink: config.catchUpLink,
		lastUpdated: config.lastUpdated
	});
});

function auth(req, res) {
	let authHeader = req.headers.authorization;

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

app.post("/api/catchUpLink", (req, res) => {
	if (!auth(req, res)) return;

	let config = catchup.loadConfig();
	let link = req.body.catchUpLink;

	try {
		let url = new URL(link);
	} catch (e) {
		res.status(400).send({
			error: `Error: Could not set CatchUp link ${link}: ${e.message}`
		});
		return;
	}

	config.catchUpLink = link;
	config.lastUpdated = new Date().toISOString();

	catchup.saveConfig(config);

	res.send(`Meet link changed to ${link}.`);
});

app.get("/attend", (req, res) => {
	let config = catchup.loadConfig();
	res.redirect(config.catchUpLink);
});

module.exports = app;

// Listening port
if (!process.env.DETA_RUNTIME) {
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, (err) => {
		if (err) console.log(err);
		else console.log(`Server started on port ${PORT}...`);
	});
}
