const fs = require("fs");
const path = require("path");

let socialLinkJSON = [];
let globalMap = new Map();

const DIRECTORY_PATH = "./sessions";
const MAP_PATH = "./map.json";

function parseFilesRecursively(directoryPath = "./") {
	const files = fs.readdirSync(directoryPath);

	files.forEach((file) => {
		const filePath = path.join(directoryPath, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			// Recursively parse files in subdirectory
			parseFilesRecursively(filePath);
		} else {
			// Parse contents of file -> attendees.adoc
			if (filePath.endsWith("attendees.adoc")) {
				const fileContents = fs.readFileSync(filePath, "utf8");
				console.log(`Parsing file ${filePath}`);
				collectUsernames(fileContents, filePath);
			}
		}
	});
}

function collectUsernames(fileContents, filePath) {
	const attendeePattern = /\. link:(.*)\[(.*?)\^?\]|\. (.+)/;

	for (let line of fileData) {
		if (!line) continue; // skip empty lines
		let [, link, name, onlyName] = line.match(attendeePattern) ?? [];

		if (link && name) {
			globalMap.set(name, link);
		} else if (onlyName) {
			globalMap.set(onlyName, null);
		} else {
			console.warn(`Error parsing line: ${line}, filePath: ${filePath}`);
		}
	}
}

function writeToMap(mapPath = "map.json") {
	/**
	 * NOTE: the forEach syntax
	 * forEach((value, key) => {  } )
	 *
	 * (not key, value; a little unintutive)
	 */

	globalMap.forEach((socialLink, fullName) => {
		socialLinkJSON.push({
			"name": fullName,
			"handle": socialLink
		});
	});

	fs.writeFileSync(mapPath, JSON.stringify(socialLinkJSON, null, 4));
}

parseFilesRecursively(DIRECTORY_PATH);
writeToMap(MAP_PATH);
