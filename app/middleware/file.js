const fs = require('fs'),
    path = require('path')

function File() {
    this.uploadTo = function(dir, filename, cb) {

    }

    this.downloadFrom = function(path, cb) {

    }

    function getFileProperties(filename) {
        const stats = fs.statSync("myfile.txt")

    }

    function convertFileSizeReadable(filesize, options) {
        if (0 == a) return "0 Bytes"
        var c = 1e3,
            d = options || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }
}

module.exports = new File()