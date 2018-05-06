const async = require('async');
const ffz = require('./ffz');
const bttv = require('./bttv');
const twitch = require('./twitch');

function init() {

    async.waterfall([
        twitch.downloadAll,
        bttv.downloadAll,
        ffz.downloadAll
    ], onFinish);
}

let onFinish = function () {
    console.log('All downloads finished.')
};

init();