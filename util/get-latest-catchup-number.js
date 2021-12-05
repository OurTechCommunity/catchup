const { readdir } = require("fs/promises");

const path = __dirname + "/../summary/sessions";

printLatestCatchUpNumber();

// Utility Functions
async function printLatestCatchUpNumber() {
	const catchUpNumbers = await getCatchUpNumbers();
	const latestCatchUpNumber = catchUpNumbers[0];
	console.log(latestCatchUpNumber);
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
