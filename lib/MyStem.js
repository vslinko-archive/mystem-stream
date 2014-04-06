/**
 * Node.js wrapper for `MyStem` morphology text analyzer.
 * Copyright Vyacheslav Slinko <vyacheslav.slinko@gmail.com>
 */

var parseResponse = require('./parseResponse');
var childProcess = require('child_process');
var path = require('path');


function MyStem(bin) {
    this.bin = bin || path.join(__dirname, '..', 'vendor', process.platform, 'mystem');
    this.queue = [];
}


MyStem.prototype.run = function run() {
    this.process = childProcess.spawn(this.bin, ['-nigeutf8']);

    this.process.on('error', function mystemErrorHandler(err) {
        this.queue.forEach(function (callback) {
            callback(err);
        });
        this.queue = [];
        this.run();
    }.bind(this));


    var buffer = '';

    this.process.stdout.on('data', function mystemDataHandler(data) {
        buffer += data.toString();
        var responses = buffer.split(/\n/g);
        buffer = responses.pop();

        responses.forEach(function (response) {
            var callback = this.queue.shift();

            if (callback) {
                var result = parseResponse(response);
                callback(null, result);
            }
        }, this);
    }.bind(this));
};


MyStem.prototype.stem = function stem(word, callback) {
    if (!this.process) {
        return callback(new Error('You should run MyStem before use it.'));
    }

    this.queue.push(callback);
    this.process.stdin.write(word + '\n');
};


MyStem.prototype.close = function close() {
    if (this.process) {
        this.process.kill();
    }
};


module.exports = MyStem;
