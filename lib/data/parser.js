module.exports = function (stream) {
    'use strict';

    var fs     = require('fs'),
        obj    = {},
        config = null,
        mime   = null;

    stream
        .split('\n')
        .filter(function (line) {
            return (!line.match(/^#/));
        }).forEach(function (line) {
            config = line.replace(/\t+|\t+$/g, ' ').split(' ');
            mime = config.shift();

            config.forEach(function (extension) {
                obj[extension] = mime;
            });
        });

    return obj;
};
