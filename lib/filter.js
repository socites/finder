var async = require('async');

/**
 * list all files, except those that are specified in the filter
 */
module.exports = async(function *(resolve, reject, root, specs) {
    "use strict";

    // Remove the last directory separator if exists
    let sep = require('path').sep;
    if (root.substr(root.length - 1) === sep) {
        root = root.substr(0, root.length - 1);
    }

    let list = specs.list;

    // check if root directory exists
    let fs = require('co-fs');
    let exists = yield fs.exists(root);
    if (!exists) {
        reject(new Error('directory "' + root + '" does not exist'));
        return;
    }

    let files = yield require('./list.js')(root, root, specs);

    // remove the files in the list
    for (let i in list) {

        if (list[i] === '*') continue;
        for (let j in files) {

            let file = files[j].relative.dirname;
            let extract = list[i];

            let relative = require('path').relative(extract, file);
            if (relative.substr(0, 2) !== '..') delete files[j];

        }

    }

    // remove filtered files
    for (let i = files.length - 1; i >= 0; i--) if (!files[i]) files.splice(i, 1);

    resolve(files);

});
