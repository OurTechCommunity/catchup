/**
 * > node create-attendee-handle-map.js
 *
 * This command could be run once on:
 * attendees.adoc files from `./../summary/sessions` directory
 *
 * Creates a `map.json` which can be used to link handles by running:
 * > node map-handles-to-catchup-attendees.js <catchup-number>
 */

const fs = require("fs");
const path = require("path");

let socialLinkJSON = [];
let globalMap = new Map();

const DIRECTORY_PATH = "../summary/sessions";
const MAP_PATH = "../summary/map.json";

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
	fileContents = fileContents.split("\n").slice(2); // Remove first 2 lines of attendees.adoc: ['==== Attendees', ''];
	for (let line of fileContents) {
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

function writeToMap(mapPath = "./map.json") {
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
