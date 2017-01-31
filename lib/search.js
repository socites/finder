var async = require('async');

/**
 * Search a list of files and directories
 * @param {string} root - The root where to extract the files on the list
 * @param {string} list - The list of directories and files to be extracted from the root
 * @param {string || function} search
 * @returns {object}
 */
module.exports = async(function *(resolve, reject, root, specs) {
    "use strict";

    // Remove the last directory separator if exists
    let sep = require('path').sep;
    if (root.substr(root.length - 1) === sep) {
        root = root.substr(0, root.length - 1);
    }

    let list = specs.list;
    let search = specs.search;
    let filename = specs.filename;

    if (!list) list = ['*'];

    if (!root) {
        reject(new Error('root must be specified'));
        return;
    }

    let File = require('./file.js');

    let files = [];
    var fs = require('co-fs');

    for (let i in list) {

        if (list[i] === '*') {
            files = files.concat(yield require('./filter.js')(root, specs));
            continue;
        }

        let path = require('path').join(root, list[i]);
        let exists = yield fs.exists(path);
        if (!exists) {
            reject(new Error('file or directory does not exist: ' + path));
            return;
        }

        // check if the element in the list is a file or a directory
        let stats = yield fs.stat(path);
        if (stats.isDirectory()) {

            files = files.concat(yield require('./list.js')(root, path, specs));

        }
        else if (stats.isFile()) {

            let file = new File(root, path);
            if (file.filename.substr(0, 1) === '.') continue;

            if (search && search(file)) continue;
            if (filename && filename !== file.filename) continue;

            files.push(file);

        }
        else reject(new Error('invalid file or directory: ' + path));

    }

    resolve(files);

});
