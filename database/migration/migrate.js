const connector = require('../query/queryBuilder')

class Migrate {

    static register(username, password, email, fullname, phone, hometown, wherenow, bio) {
        return new Promise(function(resolve, reject) {

        })
    }

    static getOneUser(usernameOrEmail) {
        return new Promise(function(resolve, reject) {

        })
    }

    static getAllUser() {
        return new Promise(function(resolve, reject) {

        })
    }

    static deleteUser(username) {
        return new Promise(function(resolve, reject) {

        })
    }

    static updateUser(username, fullname, email, phone, hometown, wherenow, bio) {
        return new Promise(function(resolve, reject) {

        })
    }

    static updatePassword(username, newpassword) {
        return new Promise((resolve, reject) => {

        })
    }

    static saveSession(name, key, token, datetime, client, mac, path) {
        return new Promise(function(resolve, reject) {

        })
    }

}

module.exports = Migrate