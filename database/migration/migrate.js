const mysql = require('../../config/connector')
var security = require('../../app/middleware/security')

function Migrate() {

    function getDateTimeLocal() {
        return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    }

    this.register = function(username, password, email, fullname) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("SELECT COUNT(U.username) FROM rpi_user U WHERE U.username = ?", [username], function(error, result) {
                if (error) reject(error);
                else {
                    if (result["COUNT(U.username)"] == 0) {
                        password = security.encryptPassword(password)
                        mysql.connector.query("INSERT INTO rpi_user(username, password, email, fullname) VALUES(?, ?, ?, ?)", [username, password, email, fullname], function(error, result) {
                            if (error) reject(error);
                            else {
                                if (result.affectedRows >= 0) {
                                    mysql.connector.query("INSERT INTO rpi_verification(idUser, isverified, createdAt) VALUES(?, ?, ?)", [result.insertId, 0, getDateTimeLocal()], function(error, response) {
                                        (error) ? reject(error): resolve((response.affectedRows >= 0) ? result.insertId : null)
                                    })
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

    this.getUserById = function(id) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select * from rpi_user where id = ?", id, function(error, result) {
                (error) ? reject(error): resolve((result.length > 0) ? result[0] : null)
            })
        })
    }

    this.getUserByEmail = function(usernameOrEmail) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select * from rpi_user where email like ? or username like ?", [usernameOrEmail, usernameOrEmail], function(error, result) {
                (error) ? reject(error): resolve((result.length > 0) ? result[0] : null)
            })
        })
    }

    this.checkUsername = function(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select username from rpi_user where username like ?", username, function(err, result) {
                (err) ? reject(err): resolve((result.length < 0) ? true : false)
            })
        })
    }
    this.verify = function(userid) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update rpi_verification set isverified = ?, verifiedAt = ?", [userid, datetime.getDateTimeNow()], function(error, result) {
                (error) ? reject(error): resolve((result.length >= 0) ? true : false)
            })
        })
    }

    this.login = function(usernameOrEmail, password) {
        return new Promise(function(resolve, reject) {
            password = security.encryptPassword(password)
            mysql.connector.query("call procGetUsernameOrEmail(?, ?)", [usernameOrEmail, password], function(error, user) {
                (error) ? reject(error): resolve((!user) ? null : user[0])
            })
        })
    }

    this.getOneUser = function(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetOneUsers(?)", username, function(error, result) {
                (error) ? reject(error): resolve((result.length > 0) ? result[0] : null)
            })
        })
    }

    this.getAdmin = function() {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetUserIfAdmin()", function(error, users) {
                (error) ? reject(error): resolve((!users || users.length < 0) ? null : users[0])
            })
        })
    }

    this.getFirstActivities = function(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetActivities(?)", username, function(error, activities) {
                (error) ? reject(error): resolve((!activities || activities.length < 0) ? null : activities[0][0])
            })
        })
    }

    this.getNotification = function(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetNotificationOfUser(?)", username, function(error, result) {
                (error) ? reject(error): resolve((result.length > 0) ? result[0] : null)
            })
        })
    }

    this.getNotificationById = function(id) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select * from rpi_notifications where id = ?", id, function(err, res) {
                (error) ? reject(error): resolve((res.length > 0) ? res[0] : null)
            })
        })
    }

    this.countUnreadNotification = function(iduser) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("select count(id) from rpi_notification where idUser = ?", id, function(error, result) {
                (error) ? reject(error): resolve((result["COUNT(id)"] > 0) ? result["COUNT(id)"] : 0)
            })
        })
    }

    this.markAsRead = function(...ids) {
        return new Promise(function(resolve, reject) {
            ids.forEach(function(val, index) {
                mysql.connector.query("call procMarkAsRead(?)", val, function(err, res) {
                    (err) ? reject(err): resolve((res.affectedRows >= 0) ? true : false)
                })
            })
        })
    }

    this.getAllUser = function() {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetAllUsers()", function(error, users) {
                (error) ? reject(error): resolve((users.length > 0) ? users[0] : null)
            })
        })
    }

    this.updateFirstLogin = function(username, datetimeLogin) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update from rpi_verification set firstLoginAt = ? where username = ?", [datetimeLogin, username], function(error, result) {
                (error) ? reject(error): resolve((result.affectedRows >= 0) ? true : false)
            })
        })
    }

    this.deleteUser = function(username) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update from rpi_user set isdeleted = 1 where username = ?", userame, function(error, result) {
                (error) ? reject(error): resolve((result.affectedRows >= 0) ? true : false)
            })
        })
    }

    this.updateUser = function(fullname, email, phone, birthdate, hometown, wherenow, bio, description) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("update rpi_user set fullname = ?, email = ?, phone = ?, birthdate = ?, hometown = ?, wherenow = ?, bio = ?, description = ?", [fullname, email, phone, birthdate, hometown, wherenow, bio, description], function(error, result) {
                (error) ? reject(error): resolve((result.affectedRows >= 0) ? true : false)
            })
        })
    }

    this.uploadAvatar = function(filename, filesize, dateupload, path, userId) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("insert rpi_avatar(filename, filesize, dateupload, path, userId, inused) values(?, ?, ?, ?, ?, ?)", [filename, filesize, dateupload, path, userId, 1], function(er, result) {
                (er) ? reject(er): resolve((result.affectedRows >= 0) ? true : false)
            })
        })
    }

    this.updatePassword = function(username, newpassword) {
        return new Promise((resolve, reject) => {
            newpassword = security.encryptPassword(newpassword)
            mysql.connector.query("update rpi_user set password = ? where username like ?", [newpassword, username], function(error, result) {
                (error) ? reject(error): resolve((result.affectedRows >= 0) ? true : false)
            })
        })
    }

    this.saveSession = function(name, key, token, datetime, client, mac, path) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("insert into rpi_session(name, key, token, datetime, client, mac, path) values(?, ?, ?, ?, ?, ?, ?)", [name, key, token, datetime, client, mac, path], function(error, result) {
                (error) ? reject(error): resolve((result.affectedRows >= 0) ? true : false)
            });
        })
    }

    this.listSessionFromDate = function(datefrom) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetSessionFromDateToDate(?, ?)", [datefrom, getDateTimeLocal()], function(error, result) {
                (error) ? reject(error): resolve((result.length > 0) ? result[0] : null)
            })
        })
    }

    this.listSessionFromDateToDate = function(from, to) {
        return new Promise(function(resolve, reject) {
            mysql.connector.query("call procGetSessionFromDateToDate(?, ?)", [from, to], function(error, result) {
                (error) ? reject(error): resolve((result.length > 0) ? result[0] : null)
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