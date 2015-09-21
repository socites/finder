var async = require('async');

/**
 * Recursively returns the list
 * of the files that are inside a directory
 *
 * @param {string} root - The root of the list
 * @param {string} path - The path to look inside
 * @param {string} {function} search - The file name or the function to check if the file matchs the search
 */
var list = async(function *(resolve, reject, root, path, specs) {
    "use strict";

    let search = specs.search;
    let filename = specs.filename;

    let fs = require('co-fs');
    let File = require('./file.js');
    let output = [];

    let files = yield fs.readdir(path);

    for (let i in files) {

        let file = require('path').join(path, files[i]);
        let stats = yield fs.stat(file);

        if (stats.isDirectory()) {

            output = output.concat(yield list(root, file, specs));

        }
        else {

            file = new File(root, file);
            if (file.filename.substr(0, 1) === '.') continue;

            if (search && search(file)) continue;
            if (filename && filename !== file.filename) continue;

            output.push(file);

        }

    }

    resolve(output);

});

module.exports = list;
