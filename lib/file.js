var Relative = function (root, file) {
    "use strict";

    if (file.substr(0, root.length) !== root) throw new Error('invalid relative file specification');
    if (file.length <= root.length) throw new Error('invalid relative file specification');

    file = file.substr(root.length + 1);

    Object.defineProperty(this, 'file', {
        'get': function () {
            return file;
        }
    });

    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return require('path').dirname(file);
        }
    });

};

module.exports = function (root, file) {
    "use strict";

    if (!root || !file) throw new Error('root and file parameters are both required');

    // Remove the last directory separator if exists
    if (root.substr(root.length - 1) === '/') {
        root = root.substr(0, root.length - 1);
    }

    this.relative = new Relative(root, file);

    Object.defineProperty(this, 'root', {
        'get': function () {
            return root;
        }
    });

    Object.defineProperty(this, 'file', {
        'get': function () {
            return file;
        }
    });

    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return require('path').dirname(file);
        }
    });

    Object.defineProperty(this, 'basename', {
        'get': function () {
            return require('path').basename(file, this.extname);
        }
    });

    Object.defineProperty(this, 'extname', {
        'get': function () {
            return require('path').extname(file);
        }
    });

    Object.defineProperty(this, 'filename', {
        'get': function () {
            return require('path').basename(file);
        }
    });

};
