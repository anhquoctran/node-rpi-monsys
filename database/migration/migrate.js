const mysql = require('../../config/connector')

class Migrate {

    static register(username, password, email, fullname, phone, hometown, wherenow, bio, description) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("SELECT COUNT(U.username) FROM rpi_user U WHERE U.username = ?", [username], function(error, result) {
                if (error) reject(error);
                else {
                    if (result["COUNT(U.username)"] == 0) {
                        mysql.connector.query("INSERT INTO rpi_user(username, password, email, fullname, phone, hometown, wherenow, bio, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [username, password, email, fullname, phone, hometown, wherenow, bio], function(error, result) {
                            if (error) reject(error);
                            else {
                                if (result.affectedRows >= 0) {
                                    resolve(true)
                                } else {
                                    reject(false)
                                }
                            }
                        })
                    } else {
                        resolve(false)
                    }
                }
            })
        })
    }

    static getOneUser(usernameOrEmail, password) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetUsernameOrEmail(?, ?)", [usernameOrEmail, password], function(error, user) {
                if (error) reject(error)
                else {
                    if (!user) {
                        resolve(null)
                    } else {
                        resolve(user)
                    }
                }
            })
        })
    }

    static getAdmin() {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call getUserIfAdmin()", function(error, users) {
                if (error) reject(error)
                else {
                    if (!users) {
                        resolve(null)
                    } else {
                        resolve(users)
                    }
                }
            })
        })
    }

    static getAllUser() {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetAllUsers()", function(error, users) {
                if (error) reject(error)
                else {
                    if (!users) {
                        resolve(null)
                    } else {
                        if (users.length > 0) {
                            resolve(users)
                        }
                    }
                }
            })
        })
    }

    static deleteUser(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update from rpi_user set isdeleted = 1 where username = ?", userame, function(error, result) {
                if (error) reject(error)
                else {
                    if (result.affectedRows >= 0) {
                        resolve(true)
                    } else resolve(false)
                }
            })
        })
    }

    static updateUser(fullname, email, phone, birthdate, hometown, wherenow, bio, description) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update rpi_user set fullname = ?, email = ?, phone = ?, birthdate = ?, hometown = ?, wherenow = ?, bio = ?, description = ?", [fullname, email, phone, birthdate, hometown, wherenow, bio, description], function(error, result) {

            })
        })
    }

    static uploadAvatar(filename, filesize, dateupload, path, userId) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("insert rpi_avatar(filename, filesize, dateupload, path, userId) values(?, ?, ?, ?, ?)", [filename, filesize, dateupload, path, userId], function(er, result) {
                if (error) reject(error)
                else {
                    if (result.affectedRows >= 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            })
        })
    }

    static updatePassword(username, newpassword) {
        return new Promise((resolve, reject) => {
            mysql.connector.query("update rpi_user set password = ? where username like ?", [password, username], function(error, result) {
                if (error) reject(error)
                else {
                    if (result.affectedRows >= 0) {
                        resolve(true)
                    } else resolve(false)
                }
            })
        })
    }

    static saveSession(name, key, token, datetime, client, mac, path) {
        return new Promise(function(resolve, reject) {

        })
    }

    static listSession() {
        return new Promise(function(resolve, reject) {

        })
    }

}

module.exports = Migrate