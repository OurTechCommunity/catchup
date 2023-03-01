const fs = require("fs");

const socialLinkJSON = JSON.parse(fs.readFileSync("./map.json"));

const SESSION_ATTENDEES_PATH = "./sessions/000/attendees.adoc";

function mapHandles(filePath = SESSION_ATTENDEES_PATH) {
	const fileContents = fs.readFileSync(filePath, "utf8");

	/**
     * fileContents
     * 
    ==== Attendees

    . Ayush Bhosle
    . Annsh Agrawaal
    . Dheeraj Lalwani

     *
     */

	const FIRST_TWO_LINES = 2;
	const LAST_LINE_EMPTY = 1;

	let fileData = fileContents.toString().replaceAll(". ", "").split("\n");

	/**
     * fileData - [array of strings]
     * 
    [
        '==== Attendees',
        '',
        'Ayush Bhosle',
        'Annsh Agrawaal',
        'Dheeraj Lalwani',
        ''
    ]
     *
     */

	let linkedHandles = [],
		unLinkedHandles = [];

	for (let i = FIRST_TWO_LINES; i < fileData.length - LAST_LINE_EMPTY; ++i) {
		let name = fileData[i].trim();
		let nameHandleObject = socialLinkJSON.filter(
			(item) => item.name === name
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
		} else {
			unLinkedHandles.push(`. ${name}`);
		}
	}

	fileData = fileData.slice(0, FIRST_TWO_LINES);
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

mapHandles();
