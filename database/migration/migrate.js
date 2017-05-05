const mysql = require('../../config/connector')

function Migrate() {

    this.register = function(username, password, email, fullname, phone, hometown, wherenow, bio, description) {
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

    this.login = function(usernameOrEmail, password) {
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

    this.getOneUser = function(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetOneUserByUsername(?)", username, function(error, result) {
                if (error) reject(error)
                else {
                    if (result.length > 0) {
                        resolve(result)
                    } else {
                        resolve(null)
                    }
                }
            })
        })
    }

    this.getAdmin = function() {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call getUserIfAdmin()", function(error, users) {
                if (error) reject(error)
                else {
                    if (!users || users.length < 0) {
                        resolve(null)
                    } else {
                        resolve(users)
                    }
                }
            })
        })
    }

    this.getAllUser = function() {
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

    this.deleteUser = function(username) {
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

    this.updateUser = function(fullname, email, phone, birthdate, hometown, wherenow, bio, description) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update rpi_user set fullname = ?, email = ?, phone = ?, birthdate = ?, hometown = ?, wherenow = ?, bio = ?, description = ?", [fullname, email, phone, birthdate, hometown, wherenow, bio, description], function(error, result) {
                if (error) resolve(error)
                else {
                    if (result.affectedRows >= 0)
                        resolve(true)
                    else
                        resolve(false)
                }
            })
        })
    }

    this.uploadAvatar = function(filename, filesize, dateupload, path, userId) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("insert rpi_avatar(filename, filesize, dateupload, path, userId, inused) values(?, ?, ?, ?, ?, ?)", [filename, filesize, dateupload, path, userId, 1], function(er, result) {
                if (er) reject(er)
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

    this.updatePassword = function(username, newpassword) {
        return new Promise((resolve, reject) => {
            mysql.connector.query("update rpi_user set password = ? where username like ?", [newpassword, username], function(error, result) {
                if (error) reject(error)
                else {
                    if (result.affectedRows >= 0) {
                        resolve(true)
                    } else resolve(false)
                }
            })
        })
    }

    this.saveSession = function(name, key, token, datetime, client, mac, path) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("insert into rpi_session(name, key, token, datetime, client, mac, path) values(?, ?, ?, ?, ?, ?, ?)", [name, key, token, datetime, client, mac, path], function(error, result) {
                if (error) reject(error)
                else {
                    if (result.affectedRows >= 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            });
        })
    }

    this.listSessionFromDate = function(datefrom) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select S.id, S.name, S.token, S.datetime, S.client, S.mac, S.path from rpi_sessions S where datetime between ? and now()", datefrom, function(error, result) {
                if (error) reject(error)
                else {
                    if (result.length > 0) {
                        resolve(result)
                    } else resolve(null)
                }
            })
        })
    }

    this.listSessionFromDateToDate = function(from, to) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select S.id, S.name, S.token, S.datetime, S.Client, S.mac, S.path from rpi_sessions S where datetime between ? and ?", [from, to], function(error, result) {
                if (error) reject(error)
                else {
                    if (result.length > 0) {
                        resolve(result)
                    } else resolve(null)
                }
            })
        })
    }

    this.countSession = function() {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select COUNT(*) from rpi_sessions", function(error, result) {
                if (error) reject(error)
                else {
                    if (result["COUNT(*)"]) {
                        var data = result["COUNT(*)"]
                        resolve(data)
                    }
                }
            })
        })
    }

}

module.exports = new Migrate()