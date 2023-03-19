/**
 * > node map-handles-to-catchup-attendees.js <catchup-number>
 *
 * This maps a list of names to the required format of the attendees file.
 */

const fs = require("fs");

const mapFile = __dirname + "/../summary/map.json";

const socialLinkJSON = JSON.parse(fs.readFileSync(mapFile));

/**
 * The `process.argv` contains an array where:
 * 0th index contains the node executable path
 * 1st index contains the path to your current file and then the rest index contains the passed arguments.
 */
const ARGS = process.argv;

const SESSION_NUMBER = ARGS[2];
if (SESSION_NUMBER !== undefined) {
	const SESSION_ATTENDEES_PATH = `${__dirname}/../summary/sessions/${SESSION_NUMBER}/attendees.adoc`;
	if (fs.existsSync(SESSION_ATTENDEES_PATH)) {
		console.log(
			`Mapping handles at Path: ${SESSION_ATTENDEES_PATH}For CatchUp Session Number: ${SESSION_NUMBER}`
		);
		mapHandles(SESSION_ATTENDEES_PATH);
	} else {
		console.warn(`File Path Not Found: ${SESSION_ATTENDEES_PATH}`);
	}
} else {
	console.warn(
		`Enter CatchUp Session Number.\n> node map-handles-to-catchup-attendees.js <catchup-number>`
	);
}

function mapHandles(filePath) {
	const fileContents = fs.readFileSync(filePath, "utf8");

	/**
     * fileContents - initally, a list of names pasted from CSV
     * 
     Ayush Bhosle
     Annsh Agrawaal
     Dheeraj Lalwani
     */

	let fileData = fileContents.toString().split("\n");

	/**
     * fileData - [array of strings]
     * 
    [
        'Ayush Bhosle',
        'Annsh Agrawaal',
        'Dheeraj Lalwani',
        ...
    ]
     *
     */

	let linkedHandles = [],
		unLinkedHandles = [];

	for (let i = 0; i < fileData.length; ++i) {
		let name = fileData[i].trim();
		let nameHandleObject = socialLinkJSON.filter(
			(item) => item.name === name && item.handle !== null
		)[0];

		/**
         * nameHandleObject = {json object}
         * 
          {
               "name": "Ayush Bhosle",
               "handle": "https://twitter.com/ayushb_tweets"
          }
         */

		if (nameHandleObject !== undefined) {
			linkedHandles.push(
				`. link:${nameHandleObject.handle}[${nameHandleObject.name}^]`
			);
		} else if (name !== "") {
			unLinkedHandles.push(`. ${name}`);
		}
	}

	fileData = ["==== Attendees", ""];
	fileData.push(...linkedHandles);
	fileData.push(...unLinkedHandles);
	fileData.push("");
	fileData = fileData.join("\n");

	/**
     * fileData
     * 
    ==== Attendees

    . link:https://twitter.com/ayushb_tweets[Ayush Bhosle^]
    . link:https://twitter.com/annshagrawaal[Annsh Agrawaal^]
    . link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
    
     *
     */

	fs.writeFileSync(filePath, fileData);
}
