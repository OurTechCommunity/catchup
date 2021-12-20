const catchupNumber = require('./catchup-number');

catchupNumber.getCatchupNumber(false, false).then(catchUpNumber => {
    console.log(catchUpNumber);
});