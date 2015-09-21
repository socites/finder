var async = require('async');

require('colors');
/**
 * Collection of files
 * @param root
 * @param {object} specs -
 *      .list [optional] - The list of directories and files to be extracted from the root
 *      .search [optional] - The function to filter files
 *      .filename [optional] - The filename to filter
 *      .usekey
 */
module.exports = function (root, specs) {
    "use strict";

    if (!root) throw new Error('invalid arguments on files collection constructor');

    if (!specs) specs = {};

    if (!specs.list) specs.list = ['*'];
    let search = specs.search;
    let filename = specs.filename;
    let usekey = specs.usekey;

    let items, keys;
    Object.defineProperty(this, 'items', {
        'get': function () {
            if (!keys) throw new Error('collection must be processed before accesing this property');
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            if (!keys) throw new Error('collection must be processed before accesing this property');
            return keys;
        }
    });

    Object.defineProperty(this, 'length', {
        'get': function () {
            if (!keys) throw new Error('collection must be processed before accesing this property');
            return keys.length;
        }
    });

    /**
     * Check if file exists
     *
     * @param {string} {object} key - string is the key, and object is the file
     */
    this.exists = async(function *(resolve, reject, key) {

        if (!key) {
            reject(new Error('key not set'.yellow));
            resolve();
            return;
        }

        let file;
        if (typeof key === 'string') {

            file = require('path').join(root, key);
            if (filename && file.substr(file.length - filename.length) !== filename) {
                file = require('path').join(file, filename);
            }

        } else {

            file = key;
            switch (usekey) {

                case 'file':
                    key = file.file;
                    break;

                case 'dirname':
                    key = file.dirname;
                    if (!key) key = './';
                    break;

                case 'relative.file':
                    key = file.relative.file;
                    break;

                case 'relative.dirname':
                default:
                    "use strict";
                    key = file.relative.dirname;
                    if (!key) key = './';
                    break;

            }
            file = file.file;

        }

        if (items) {
            // if processed
            resolve(!!items[key]);
        }
        else {

            // if not processed, check if the file is in the list of files
            let relative = true;
            if (specs.list.indexOf('*') === -1) {

                relative = false;
                for (let i in specs.list) {

                    relative = require('path').relative(specs.list[i], key);
                    if (!relative || relative.substr(0, 2) !== '..') {
                        relative = true;
                        break;
                    }

                    relative = false;

                }

            }

            if (!relative) {
                resolve(false);
                return;
            }

            // finally check if file exists
            let fs = require('co-fs');
            resolve((yield fs.exists(file)) && (yield fs.stat(file)).isFile());

            return;

        }

    });

    this.process = async(function *(resolve, reject) {

        let files = yield require('./search.js')(root, specs);

        items = {};
        keys = [];
        for (let i in files) {

            let key;
            switch (usekey) {

                case 'file':
                    key = files[i].file;
                    break;

                case 'dirname':
                    key = files[i].dirname;
                    if (!key) key = './';
                    break;

                case 'relative.file':
                    key = files[i].relative.file;
                    break;

                case 'relative.dirname':
                default:
                    "use strict";
                    key = files[i].relative.dirname;
                    if (!key) key = './';
                    break;

            }

            keys.push(key);
            items[key] = files[i];

        }

        resolve();

    });

    Object.defineProperty(this, 'processed', {
        'get': function () {
            return !!items;
        }
    });

};
