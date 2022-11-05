const { readdir, readFile } = require("fs/promises");

const path = __dirname + "/../summary/sessions";

async function getAllCatchUpNumbers() {
	// Returns array in descending order of CatchUp session numbers
	const dirArray = await getDirectoryNames(path);
	for (let i = 0; i < dirArray.length; i++)
		dirArray[i] = parseInt(dirArray[i]);
	return dirArray.reverse();
}

async function getDirectoryNames(path) {
	return (await readdir(path, { withFileTypes: true }))
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
}

function getSuffix(catchUpNumber) {
	const lastChar = catchUpNumber.slice(-1);

	if (lastChar === "1") return "st";
	else if (lastChar === "2") return "nd";
	else if (lastChar === "3") return "rd";
	else return "th";
}

async function getCatchupNumber(getNextCatchupNumber, addSuffix) {
	allCatchUpNumbers = await getAllCatchUpNumbers();
	let catchUpNumber = allCatchUpNumbers[0];

	// Add one if need next catchup number
	if (getNextCatchupNumber) {
		let lastCatchupPath =
			path +
			"/" +
			catchUpNumber.toString().padStart(3, "0") +
			"/content.adoc";
		// Get number of weeks since last CatchUp
		let lastCatchupContent = await readFile(lastCatchupPath);

		let weeksElapsed = 1;
		let dateMatch = lastCatchupContent
			.toString()
			.match(/^Date:\s*(\d{2}-\d{2}-\d{4})/i);
		if (dateMatch) {
			let [dd, mm, yyyy] = dateMatch[1].split("-");
			// get time elapsed from last catchup date, 10:45pm IST
			let lastCatchupDate = new Date(`${yyyy}-${mm}-${dd}T22:45+0530`);
			let now = new Date();

			let difference = now.getTime() - lastCatchupDate.getTime();
			const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
			if (difference > 0) weeksElapsed = Math.ceil(difference / ONE_WEEK);
			else
				console.warn(
					`warning: now < last catchup date: ${now} < ${lastCatchupDate}`
				);
		} else
			console.warn(
				`warning: could not parse date for catchup: ${lastCatchupPath}`
			);

		catchUpNumber += weeksElapsed;
	}

	catchUpNumber = catchUpNumber.toString();

	if (addSuffix) {
		const suffix = getSuffix(catchUpNumber);
		catchUpNumber = catchUpNumber + suffix;
	}

	return catchUpNumber;
}

module.exports = {
	getCatchupNumber
};
