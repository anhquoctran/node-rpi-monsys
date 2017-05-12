var crypto = require('crypto')

function Security() {
    this.encryptPassword = function(password) {
        return crypto.createHash("sha512").update(password.toString()).digest('hex').toUpperCase()
    }

    this.createHash = function() {

    }

    this.createRSA = function() {

    }

}

module.exports = new Security();