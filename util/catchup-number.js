const { readdir } = require("fs/promises");

const path = __dirname + "/../summary/sessions";


async function getCatchUpNumber() {
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
    catchUpNumbers = await getCatchUpNumber();
    let catchUpNumber = catchUpNumbers[0];

    // Add one if need next catchup number
    if (getNextCatchupNumber) catchUpNumber = catchUpNumber + 1;

    catchUpNumber = catchUpNumber.toString();

    if (addSuffix) {
        const suffix = getSuffix(catchUpNumber);
        catchUpNumber = catchUpNumber + suffix;
    }

    return catchUpNumber;
}

module.exports = {
    getCatchupNumber,
};