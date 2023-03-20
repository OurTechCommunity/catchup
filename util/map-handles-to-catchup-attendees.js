/**
 * > node map-handles-to-catchup-attendees.js <catchup-number>
 *
 * This maps a list of names to the required format of the attendees file.
 */

const fs = require("fs/promises");
const path = require("path");

const {
	getAllCatchUpNumbers,
	normalizeCatchupNumber
} = require("./catchup-number");

const ATTENDEES_HEADER = "==== Attendees";
const SESSIONS_FOLDER = path.join(__dirname, "../summary/sessions");
const mapFile = path.join(__dirname, "../summary/map.json");

async function mapHandles(filePath) {
	const socialLinkJSON = JSON.parse((await fs.readFile(mapFile)).toString());

	let csvData = (await fs.readFile(filePath, "utf8")).toString().split("\n");
	let linkedHandles = [];
	let unLinkedHandles = [];
	for (let i = 0; i < csvData.length; ++i) {
		let attendeeName = csvData[i].trim();
		let nameHandleObject = socialLinkJSON.find(
			({ name, handle }) => name === attendeeName && handle !== null
		);

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
		} else if (attendeeName) {
			unLinkedHandles.push(`. ${attendeeName}`);
		}
	}

	/**
	 * fileData
	 * 
	==== Attendees

	. link:https://twitter.com/ayushb_tweets[Ayush Bhosle^]
	. link:https://twitter.com/annshagrawaal[Annsh Agrawaal^]
	. link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
    
	 *
	 */

	await fs.writeFile(
		filePath,
		["==== Attendees", "", ...linkedHandles, ...unLinkedHandles, ""].join(
			"\n"
		)
	);
}

async function main() {
	let SESSION_NUMBER = process.argv[2];

	if (SESSION_NUMBER == undefined) {
		console.warn(`no catchup number specified`);
		let catchupNumbers = await getAllCatchUpNumbers();
		SESSION_NUMBER = catchupNumbers.sort().at(-1).toString();
	}
	if (SESSION_NUMBER == undefined) {
		console.warn(
			`could not autodetect summary folder, please specify as first argument`
		);
		process.exit(1);
	}

	const SESSION_ATTENDEES_PATH = path.join(
		SESSIONS_FOLDER,
		normalizeCatchupNumber(SESSION_NUMBER),
		"attendees.adoc"
	);
	let attendeesData = await fs
		.readFile(SESSION_ATTENDEES_PATH)
		.then((buffer) => buffer.toString())
		.catch(() => null);
	if (!attendeesData) {
		console.warn(`could not open ${SESSION_ATTENDEES_PATH}`);
		process.exit(1);
	} else if (attendeesData.includes(ATTENDEES_HEADER)) {
		console.warn(
			`looks like ${SESSION_ATTENDEES_PATH} is alreadly\n` +
				`processed since it contains "${ATTENDEES_HEADER}",\n` +
				"please remove if incorrect"
		);
		process.exit(1);
	}

	await mapHandles(SESSION_ATTENDEES_PATH);
}

if (require.main) main();
