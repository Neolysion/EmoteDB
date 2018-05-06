const fs = require('fs');
const log = require('./logger');
const request = require('request');
const JSONStream = require('JSONStream');

const emoteUrl = 'https://api.betterttv.net/2/emotes'; // TODO these don't seem to be all that exist???
let finalCb;

let jsw = JSONStream.stringify('[', ',', ']');
let fileStream = fs.createWriteStream('bttv_emotes.json');
fileStream.on('finish', () => {
    log.info('BTTV', 'bttv_emotes.json is ready.');
    finalCb();
});
jsw.pipe(fileStream);


exports.downloadAll = function (cb) {
    finalCb = cb;
    log.info('BTTV', 'Emotes downloading...');
    fetchBTTV(emoteUrl, data => {
        appendBTTVEmotesToFile(data.emotes, () => {
            log.info('BTTV', 'Writing emotes to file...');
            jsw.end();
        });
    });
};

appendBTTVEmotesToFile = function (emotes, cb) {
    log.info('BTTV', 'Processing emotes...');
    emotes.forEach(emote => {
        let normalizedEmote =
            {
                'id': emote.id,
                'code': emote.code,
                'height': null,
                'type': 2
            };
        jsw.write(normalizedEmote);
    });
    cb();
};

fetchBTTV = function (url, cb) {
    let options = {
        url: url,
        method: 'GET',
        json: true
    };

    request(options, function (error, response, body) {
        if (error) console.log(error);
        else {
            log.info('BTTV', 'Emotes downloaded.');
            cb(body);
        }
    });
};