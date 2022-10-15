const catchupNumber = require("./catchup-number");

catchupNumber
	.getCatchupNumber(true, true)
	.then(console.log)
	.catch(console.error);
