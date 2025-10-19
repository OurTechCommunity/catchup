const { execFileSync } = require("child_process");

const CO_AUTHOR_PREFIX = "Co-authored-by:";
const SKIP_EMAIL = "skip";

// bypass git ownership checks
// https://stackoverflow.com/a/73488472
const GIT_BYPASS_OWNERSHIP_CHECK_ARGS = ["-c", "safe.directory=*"];

function main() {
	const args = process.argv.slice(2);

	const path = args[0];
	if (!path) {
		console.warn(`invalid value for path received: ${path}`);
		console.warn(
			`usage: "${process.argv[0]}" "${process.argv[1]}" <folder path>`
		);
		process.exit(1);
	}

	const output = execFileSync(
		"git",
		[
			...GIT_BYPASS_OWNERSHIP_CHECK_ARGS,
			"log",
			"-z", // separate entries with null instead of newline
			// author name, author email, commit message
			"--format=%an%x00%ae%x00%B%x00",
			path
		],
		{
			encoding: "utf8"
		}
	);
	// remove trailing \0\0
	const logs = output.substring(0, output.length - 2).split("\0\0");

	const authorSet = new Set();
	for (let log of logs) {
		const [authorName, authorEmail, commitMessage] = log.split("\0");
		if (authorEmail == SKIP_EMAIL) continue;

		// add commit author
		authorSet.add(`${authorName} <${authorEmail}>`);

		// add co-authors
		for (let line of commitMessage.split(/\r?\n/))
			if (line.startsWith(CO_AUTHOR_PREFIX))
				authorSet.add(line.substring(CO_AUTHOR_PREFIX.length).trim());
	}

	// remap entries with git mailmap
	const remappedAuthors = execFileSync(
		"git",
		[...GIT_BYPASS_OWNERSHIP_CHECK_ARGS, "check-mailmap", "--stdin"],
		{
			input: Array.from(authorSet).join("\n"),
			encoding: "utf8"
		}
	);

	const authorEntrySet = new Set();
	for (let authorLine of remappedAuthors.split("\n")) {
		if (!authorLine) continue;
		const [, authorName, authorEmail] = authorLine.match(/(.*) <(.*)>/);
		authorEntrySet.add(`mailto:${authorEmail}[${authorName}]`);
	}

	const authors = Array.from(authorEntrySet).join(" &#xB7; ");
	const prefix = authorEntrySet.size == 1 ? "Author" : "Authors";
	console.log(`${prefix}: ${authors}`);
}

main();
