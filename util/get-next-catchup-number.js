const catchupNumber = require('./catchup-number');

catchupNumber.getCatchupNumber(true, true).then(catchUpNumber => {
    console.log(catchUpNumber);
});