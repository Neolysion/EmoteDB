const fs = require('fs');
const log = require('./logger');
const request = require('request');
const JSONStream = require('JSONStream');

const emoteUrl = 'https://api.twitch.tv/kraken/chat/emoticon_images';
let finalCb;

let jsw = JSONStream.stringify('[', ',', ']');
let fileStream = fs.createWriteStream('twitch_emotes.json');
fileStream.on('finish', () => {
    log.info('Twitch', 'twitch_emotes.json is ready.');
    finalCb();
});
jsw.pipe(fileStream);


exports.downloadAll = function (cb) {
    finalCb = cb;
    log.info('Twitch', 'Emotes downloading...');
    fetchTwitch(emoteUrl, data => {
        appendTwitchEmotesToFile(data.emoticons, () => {
            log.info('Twitch', 'Writing emotes to file...');
            jsw.end();
        });
    });
};

appendTwitchEmotesToFile = function (emotes, cb) {
    log.info('Twitch', 'Processing emotes...');
    for (let i = 0; i < emotes.length; i++) {
        let emote = emotes[i];
        let normalizedEmote =
            {
                'id': emote.id,
                'code': emote.code,
                'height': undefined,
                'type': 1
            };

        jsw.write(normalizedEmote);
    }
    cb();
};

fetchTwitch = function (url, cb) {
    let options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'setyourid'
        },
        json: true,
        timeout: 60000
    };

    request(options, (error, response, body) => {
        if (error) console.log(error);
        else {
            log.info('Twitch', 'Emotes downloaded.');
            cb(body);
        }
    });
};