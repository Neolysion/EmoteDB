const ffz = require('./ffz');
const bttv = require('./bttv');
const twitch = require('./twitch');

function init() {
    //ffz.downloadAll();
    //bttv.downloadAll();
    twitch.downloadAll();
}

init();