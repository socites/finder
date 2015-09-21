var assert = require('assert');

describe('Files utility', function () {
    "use strict";

    let files;
    before(function (done) {

        let co = require('co');
        co(function *() {

            try {

                let path = require('path').join(__dirname, 'sources');
                files = new (require('..'))(path, {'filename': 'brick.json'});

                yield files.process();
                done();

            }
            catch (exc) {
                console.error(exc.stack);
            }

        });

    });

    it('must return two files', function () {

        assert.equal(files.length, 2);

    });

    it('must have its relative path', function () {

        for (let i in files.keys) {

            let key = files.keys[i];
            let file = files.items[key];

            if (i === '0') assert.equal(file.relative.dirname, '.');
            else if (i === '1') assert.equal(file.relative.dirname, 'dir');

        }

    });

});
