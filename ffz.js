const fs = require('fs');
const request = require('request');
const buildUrl = require('build-url');
const JSONStream = require('JSONStream');

let jsw = JSONStream.stringify('[', ',', ']');
let file = fs.createWriteStream('ffz_emotes.json');
jsw.pipe(file);

const baseUrl = 'https://api.frankerfacez.com/v1';

exports.downloadAll = function () {
    let pages = 1;
    let page = 1;
    console.log('FFZ emotes downloading...');
    contin(page, pages, () => {
        jsw.end();
        console.log('FFZ emotes downloaded ffz_emotes.json ready.');
    });
};

contin = function (page, pages, cb) {
    let emoteUrlParams = {
        high_dpi: 'off',
        page: page,
        per_page: 200,
        private: 'off'
    };

    let pageUrl = buildUrl(baseUrl, {
        path: '/emoticons',
        queryParams: emoteUrlParams
    });

    fetch(pageUrl, data => {
        pages = data._pages;
        appendEmotesToJSON(data.emoticons);
        console.log("Downloaded page " + page + "/" + pages);
        setTimeout(function () {
            if (page <= pages) contin(page + 1, pages, cb);
            else cb();
        }, 5000)
    });
};

appendEmotesToJSON = function (emotes) {
    emotes.forEach(emote => {
        let normalizedEmote =
            {
                'id': emote.id,
                'code': emote.name,
                'height': emote.height,
                'type': 3,
            };
        jsw.write(normalizedEmote);
    });
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