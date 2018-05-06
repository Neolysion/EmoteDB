const fs = require('fs');
const request = require('request');
const JSONStream = require('JSONStream');

const emoteUrl = 'https://api.betterttv.net/2/emotes'; // TODO these don't seem to be all that exist???

let jsw = JSONStream.stringify('[', ',', ']');
let file = fs.createWriteStream('bttv_emotes.json');
jsw.pipe(file);


exports.downloadAll = function () {
    console.log('BTTV emotes downloading...');
    fetch(emoteUrl, data => {
        appendEmotesToFile(data.emotes, () => {
            jsw.end();
            console.log('BTTV emotes downloaded, bttv_emotes.json is ready.');
        });
    });
};

appendEmotesToFile = function (emotes, cb) {
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

fetch = function (url, cb) {
    let options = {
        url: url,
        method: 'GET',
        json: true
    };

    request(options, function (error, response, body) {
        if (error) console.log(error);
        else cb(body);
    });
};