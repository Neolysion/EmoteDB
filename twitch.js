const fs = require('fs');
const request = require('request');
const JSONStream = require('JSONStream');

const emoteUrl = 'https://api.twitch.tv/kraken/chat/emoticon_images';

let jsw = JSONStream.stringify('[', ',', ']');
let file = fs.createWriteStream('twitch_emotes.json');
jsw.pipe(file);


exports.downloadAll = function () {
    console.log('Twitch emotes downloading...');
    fetch(emoteUrl, data => {
        appendEmotesToFile(data.emoticons, () => {
            jsw.end(() => console.log('Twitch emotes processed, twitch_emotes.json is ready.'));
        });
    });
};

appendEmotesToFile = function (emotes, cb) {
    for (let i = 0; i < emotes.length; i++) {
        console.log('Processing twitch emotes (' + i + 1 + '/' + emotes.length + ')');
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

fetch = function (url, cb) {
    let options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 's1f6h2yhe2bspki9s9ija7eg7xllc6'
        },
        json: true,
        timeout: 60000
    };

    request(options, (error, response, body) => {
        if (error) console.log(error);
        else cb(body);
    });
};