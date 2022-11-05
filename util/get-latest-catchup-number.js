const catchupNumber = require("./catchup-number");

catchupNumber
	.getCatchupNumber(false, false)
	.then(console.log)
	.catch(console.error);
