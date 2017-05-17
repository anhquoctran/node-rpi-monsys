var express = require('express')
var sysinfo = require('../app/models/sysinfo')
var migrator = require('../database/migration/migrate')
var file = require('../app/middleware/file')
var datetime = require("../app/middleware/datetime")
var mail = require("../app/middleware/mail")
var multer = require("multer")
var pagination = require("express-paginate")

module.exports = function Route(app, passport) {

    app.get('/', function(req, res) {
        if (req.session.user) {
            res.redirect("/admin")
        } else res.redirect("/login")
    })

    app.get('/login', function(req, res) {
        if (req.session.user) {
            res.redirect("/admin")
        } else {
            if (req.query.login && req.query.login == "error") {
                res.render('login', {
                    title: "Login to your system - RPiMonSys",
                    error: "Sorry! Your credential didn't existing in our system"
                })
            } else {
                res.render('login', {
                    title: "Login to your system - RPiMonSys"
                })
            }

        }
    })

    app.post('/login', function(req, res) {
        var usernameOrEmail = req.body.usernameOrEmail;
        var password = req.body.password;
        if (!usernameOrEmail || !password) {
            res.redirect("/login")
        } else {
            migrator.getUserByEmail(usernameOrEmail)
                .then(data => {
                    if (data) {
                        req.session.user = data
                        res.redirect("/admin?login=success&token=" + require("../app/middleware/security").hash(datetime.getDateTimeNow()))
                    } else {
                        res.redirect("/login?login=error")
                    }
                })
                .catch(error => console.error(error))
        }
    })

    var storage = multer.diskStorage({
        filename: function(req, file, cb) {
            cb(null, "img_" + require("../app/middleware/security").generateFilename())
        }
    })

    var upload = multer({ storage: storage })

    app.post('/register', function(req, res) {
        var username = req.body.username,
            email = req.body.email,
            fullname = req.body.fullname,
            password = req.body.password
        if (!username || !password || !email || !fullname) {

        } else {
            migrator.register(username, password, email, fullname)
                .then(data => {
                    if (data) {
                        var id = parseInt(data)
                        migrator.getUserById(id)
                            .then(data => {
                                if (data) {
                                    migrator.getUserByEmail(data.email)
                                        .then(r => {
                                            if (r) {
                                                req.session.user = r
                                                res.redirect("/admin")
                                            }
                                        }).catch(error => console.error(error))
                                } else {
                                    res.redirect('/login')
                                }
                            }).console.error(error => console.error(error))
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }

    })

    app.get('/forgot', function(req, res) {
        if (req.session.user) {
            res.redirect("/admin")
        } else {
            res.render('forgot', {
                title: "Forgot your password - RPiMonSys"
            })
        }
    })

    app.get('/register', function(req, res) {
        if (req.session.user) {
            res.redirect("/admin")
        } else {
            res.render('register', {
                title: "Create an account to access our system"
            });
        }

    })

    app.get('/account/:username', function(req, res) {
        if (req.session.user) {
            var username = req.params.username
            if (!username) {
                res.redirect("/admin")
            } else {
                if (username === req.session.user.username) {
                    Promise.all([
                            migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username), migrator.getFirstActivities(req.session.user.username)
                        ])
                        .then(data => {
                            console.log(data[2])
                            res.render("layouts/profile/profile", {
                                title: "Profile - RPiMonSys",
                                user: data[0][0],
                                notification: data[1],
                                first_activities: data[2]
                            })
                        })
                        .catch(error => {
                            console.error(error)
                        })
                } else {
                    res.redirect("/admin?error=permission_denied")
                }
            }
        } else res.redirect("/login")
    })

    app.get('/profile/edit', function(req, res) {
        res.render("layouts/profile/edit", {
            title: "Edit Profile - RPiMonSys",
        })
    })

    app.get('/account/preferences', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(result => {
                    res.render('layouts/profile/setting', {
                        title: "Setting",
                        user: result[0][0],
                        notification: result[1]
                    });
                })
        } else {
            res.redirect("/login")
        }

    })

    app.post('/upload', function(req, res) {
        var photo = req.files;
        var size = photo.size,
            name = photo.originalname,
            path = photo.path,
            date = datetime.getDateTimeNow()
        migrator.uploadAvatar(name, size, date, path, 1)
            .then(result => {
                if (result == true) {
                    res.render("", {
                        title: "Profile",
                        message: "Your avatar has been changed successfully!"
                    })
                } else {
                    res.render("", {
                        title: "Profile",
                        message: "Error when changing avatar! Please try again"
                    })
                }
            })

    })

    app.get('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/login')
    })

    app.get('/admin/admin_cp', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(data => {
                    res.render("admin_cp", {
                        title: "Administrator Control Panel",
                        user: data[0][0],
                        notification: data[1]
                    })
                })

        } else res.redirect("/login")
    })

    app.post("/account/edit/credential", function(req, res) {
        var password = req.body.password
        var username = req.session.user.username
        if (password || username) {
            migrator.updatePassword(username, password)
                .then(data => {
                    if (data == true) {
                        res.json({
                            message: true
                        })
                    } else {
                        res.json({
                            message: false
                        })
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        } else res.json({
            message: false
        })
    })

    app.post("/account/edit/info", function(req, res) {
        var fullname
        var email
        var birthdate
        var hometown
        var currentcity
        var phone
        if (fullname || email || birthdate || hometown || currentcity || phone) {
            migrator.updateUser(fullname, email, phone, birthdate, hometown, currentcity, phone)
                .then(data => {

                })
        } else {

        }
    })

    app.get("/account/info", function(req, res) {
        if (req.session.user) {
            migrator.getOneUser(req.sesion.user.username)
                .then(data => {
                    if (data) {
                        res.json(data)
                    } else {
                        res.json({
                            message: "Unable to find user"
                        })
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }
    })

    app.get("/account/notification/:id", function(req, res) {
        if (req.session.user) {
            var id = req.params.id
            if (!id) {
                res.redirect("/admin")
            } else {
                var currentUserId = req.session.user.id
                migrator.getNotificationById(id)
                    .then(data => {
                        if (data.idUser == currentUserId) {
                            //res.redirect("/")
                        } else {
                            res.redirect("/admin?error=permission_denied")
                        }
                    })
            }
        } else {
            res.redirect("/login")
        }
    })

    app.get("/secret/notifications", function(req, res) {
        if (req.sesion.user) {
            var userid = req.query.userid
            migrator.countUnreadNotification(userid)
                .then(data => {
                    if (data == 0) {
                        res.json({
                            count: 0,
                            message: "There are nothing to count"
                        })
                    } else
                        res.json({
                            count: data,
                            message: null
                        })
                })
                .catch(error => {
                    console.error(error)
                })
        } else {
            res.redirect("/login")
        }
    })

    app.use(pagination.middleware(20, 50))

    app.get("/test", function(req, res) {
        Promise.all([
                sysinfo.fsSize(), sysinfo.fsStats(), sysinfo.blockDevices(), sysinfo.disksIO()
            ])
            .then(data => {
                res.json({
                    Filesystem_size: data[0],
                    filesystem_stat: data[1],
                    BlockDevices: data[2],
                    DiskIO: data[3]
                })
            }).catch(error => console.error(error))
    })

    app.get('/admin', function(req, res) {
        if (req.session.user) {

            Promise.all([
                    sysinfo.mem(), sysinfo.disksIO(), sysinfo.networkConnections(), sysinfo.processes(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username), sysinfo.cpu()
                ])
                .then(result => {
                    var speed = convertSpeedToReadableFormat(result[6].speed.avg)
                    res.render("layouts/sysinfo/general", {
                        title: "Dashboard",
                        mem: result[0],
                        disk: result[1],
                        network: result[2],
                        processes: result[3].list.slice(0, 5),
                        user: result[4][0],
                        notification: result[5],
                        cores: result[6].cores,
                        speed: speed
                    })
                })
                .catch(error => {
                    console.error(error)
                })
        } else res.redirect("/login")
    })

    function convertSpeedToReadableFormat(speed) {
        var result = parseFloat(speed)
        if (result < 1) {
            return (result * 1000) + " MHz"
        } else if (result >= 100.0 || result <= 900.0) {
            return (Math.round(result) + " MHz")
        } else if (result >= 1000.0) {
            return ((result / 1000) + " GHz")
        } else
            return result + " GHz"
    }

    app.get('/sysinfo/terminal/ssh', function(req, res) {
        res.json({ message: "Coming soon", your_ip: req.host })
    })

    app.get("/admin/overview", function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.osInfo(), sysinfo.cpu(), sysinfo.cpuCache(), sysinfo.cpuCurrentspeed(),
                    sysinfo.mem(), sysinfo.disksIO(), sysinfo.networkConnections(), sysinfo.networkInterfaces(), sysinfo.networkInterfaceDefault(), sysinfo.fsSize(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username), sysinfo.cpuTemperature()
                ])
                .then(result => {
                    res.render("layouts/sysinfo/overview", {
                        title: "Overview System Information",
                        osInfo: result[0],
                        cpuinfo: result[1],
                        cpuCache: result[2],
                        min: convertSpeedToReadableFormat(result[3].min),
                        max: convertSpeedToReadableFormat(result[3].max),
                        avg: convertSpeedToReadableFormat(result[3].avg),
                        mem: result[4],
                        disksIO: result[5],
                        networkConnections: result[6],
                        networkInterfaces: result[7],
                        networkInterfaceDefault: result[8],
                        filesystem: result[9],
                        user: result[10][0],
                        notification: result[11],
                        cpuTemp: parseFloat(result[12].main).toFixed(1)
                    })
                }).catch(error => {
                    console.error(error)
                })
        } else {
            res.redirect("/login")
        }

    })

    app.get('/admin/cpu', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.cpu(), sysinfo.cpuCache(), sysinfo.cpuCurrentspeed(), sysinfo.cpuFlags(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username), sysinfo.cpuTemperature()
                ])
                .then(result => {
                    res.render("layouts/sysinfo/cpu", {
                        title: 'CPU Usage Statistic',
                        cpu: result[0],
                        cpuCache: result[1],
                        cpuCurrentspeed: convertSpeedToReadableFormat(result[2].avg),
                        cpuFlags: result[3],
                        user: result[4][0],
                        notification: result[5],
                        temp: parseFloat(result[6].main).toFixed(1)
                    })
                })
        } else {
            res.redirect("/login")
        }
    })

    app.get('/admin/memory', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.mem(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(data => {
                    res.render("layouts/sysinfo/memory", {
                        title: "Memory Usage Statistic",
                        total: data[0].total,
                        free: data[0].free,
                        inused: data[0].used,
                        active: data[0].active,
                        available: data[0].available,
                        buffer_cache: data[0].buffcache,
                        swap_total: data[0].swaptotal,
                        swap_used: data[0].swapused,
                        swap_free: data[0].swapfree,
                        user: data[1][0],
                        notification: data[2]
                    })
                })
                .catch(error => console.error(error))
        } else res.redirect("/login")
    })

    app.get('/admin/network', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.networkInterfaces(), sysinfo.networkInterfaceDefault(), sysinfo.networkConnections(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(result => {
                    res.render("layout/sysinfo/network", {
                        title: "Network Statistic",
                        networkInterfaces: result[0],
                        networkInterfaceDefault: result[1],
                        networkConnections: result[2],
                        user: result[3][0],
                        notification: result[4]
                    })
                })
                .catch(error => console.error(error))
        } else {
            res.redirect("/login")
        }
    })

    app.get('/admin/disk', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.disksIO(), sysinfo.blockDevices(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(result => {
                    res.render("layouts/sysinfo/disk", {
                        title: "Disk I/O and Block Device Statistic",
                        io: result[0],
                        device: result[1],
                        user: result[2][0],
                        notification: result[3]
                    })
                })
        } else {
            res.redirect("/login")
        }
    })

    app.get('/admin/filesystem', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.fsSize(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(data => {
                    res.render("layouts/sysinfo/filesytem", {
                        title: "Linux Filesystem Statistic",
                        filesystem: data[0],
                        user: data[1][0],
                        notification: data[2]
                    })
                })
                .catch(error => console.error(error))
        } else res.redirect("/login")
    })

    app.get('/admin/sysuser', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.users(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(data => {
                    res.render("layouts/sysinfo/sysuser", {
                        title: "System Users",
                        sysuser: data[0],
                        user: data[1][0],
                        notification: data[2]
                    })
                })
                .catch(error => console.error(error))
        } else {
            res.redirect("/login")
        }
    })

    app.get('/admin/processes', function(req, res) {
        if (req.session.user) {
            Promise.all([
                    sysinfo.processes(), migrator.getOneUser(req.session.user.username), migrator.getNotification(req.session.user.username)
                ])
                .then(result => {
                    res.render("layouts/sysinfo/processes", {
                        title: "Process Manager",
                        all: result[0].all,
                        running: result[0].running,
                        blocked: result[0].blocked,
                        sleeping: result[0].sleeping,
                        list: result[0].list,
                        user: result[1][0],
                        notification: result[2]
                    })
                })
                .catch(error => console.error(error))
        } else {
            res.redirect("/login")
        }
    })
}