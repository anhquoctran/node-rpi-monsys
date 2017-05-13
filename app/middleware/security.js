var crypto = require('crypto')

function Security() {
    this.encryptPassword = function(password) {
        return crypto.createHash("sha512").update(password.toString()).digest('hex').toUpperCase()
    }

    this.hash = function(string) {
        return crypto.createHash("sha512").update(string.toString()).digest("hex").toLowerCase()
    }

}

module.exports = new Security();