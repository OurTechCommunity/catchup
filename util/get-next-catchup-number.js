const { readdir } = require("fs/promises");

const path = __dirname + "/../summary/sessions";

printNextCatchUpNumber();

// Utility functions
async function printNextCatchUpNumber() {
	catchUpNumbers = await getCatchUpNumbers();
	let nextCatchUpNumber = catchUpNumbers[0] + 1;
	nextCatchUpNumber = nextCatchUpNumber.toString();
	const suffix = getSuffix(nextCatchUpNumber);
	nextCatchUpNumber = nextCatchUpNumber + suffix;
	console.log(nextCatchUpNumber);
}

async function getCatchUpNumbers() {
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
