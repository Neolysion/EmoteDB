const fs = require('fs');
const log = require('./logger');
const request = require('request');
const buildUrl = require('build-url');
const JSONStream = require('JSONStream');

let finalCb;

let jsw = JSONStream.stringify('[', ',', ']');
let fileStream = fs.createWriteStream('ffz_emotes.json');
fileStream.on('finish', () => {
    log.info('FFZ', 'ffz_emotes.json is ready.');
    finalCb();
});
jsw.pipe(fileStream);

const baseUrl = 'https://api.frankerfacez.com/v1';

exports.downloadAll = function (cb) {
    finalCb = cb;
    let pages = 1;
    let page = 1;
    log.info('FFZ', 'Emotes downloading...');
    contin(page, pages, () => {
        jsw.end();
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

    fetchFFZ(pageUrl, data => {
        pages = data._pages;
        appendFFZEmotesToJSON(data.emoticons);
        log.info('FFZ', "Downloaded page " + page + "/" + pages);
        setTimeout(function () {
            if (page <= pages) contin(page + 1, pages, cb);
            else cb();
        }, 5000)
    });
};

appendFFZEmotesToJSON = function (emotes) {
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

fetchFFZ = function (url, cb) {
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