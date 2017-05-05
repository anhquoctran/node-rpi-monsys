var express = require('express')
var sysinfo = require('../app/models/sysinfo')
var localStrategy = require("passport-local")
var migrator = require('../database/migration/migrate')
var file = require('../app/middleware/file')
var datetime = require("../app/middleware/datetime")

module.exports = function Route(app, passport) {

    /*passport.use(new localStrategy({
        function(username, password, done) {
            return new Promise(function(resolve, reject) {
                migrate.getOneUser(username)
                    .then(user => {
                        if (!user) {
                            resolve(null)
                        } else if (passport !== user.password) {
                            resolve(null)
                        } else {
                            resolve(user)
                        }
                    })
                    .catch(error => console.error(error))
            })
        }
    }))
*/
    function authenticationMiddleware() {
        return function(req, res, next) {
            if (req.isAuthenticated()) {
                return next()
            }
            res.redirect('/login')
        }
    }

    app.get('/', function(req, res) {
        console.log("GET " + req.originalUrl + " 200 OK from " + req.ip)
        res.render("register", {
            data: [1, 2, 3, 4, 5, 6]
        })
    })

    app.get('/login', function(req, res) {
        console.log("GET " + req.originalUrl + " 200 OK from " + req.ip)
        res.render('login')
    })

    app.post('/login', function(req, res) {
        var username = req.body.username,
            password = req.body.password;
        if (!username || !password) {

        } else {

        }
    })

    app.post('/register', function(req, res) {
        var username = req.body.username,
            fullname = req.body.fullname,
            email = req.body.email,
            password = req.body.password,
            birthdate = req.body.birthdate,
            hometown = req.body.hometown,
            wherenow = req.body.wherenow,
            phone = req.body.phone,
            bio = req.body.bio,
            description = req.body.description

        if (username || fullname || email || password || birthdate || hometown || wherenow || phone || bio || description) {
            migrator.register(username, password, email, fullname, phone, hometown, wherenow, bio, description)
                .then(result => {

                })
                .catch(error => console.error(error))
        } else {

        }
    })

    app.get('/register', function(req, res) {
        res.render('register', {
            title: "Create an account to access our system"
        });
    })

    app.get('/profile', function(req, res) {
        res.render('profile', {
            title: "Profile",
            message: null
        });
    })

    app.get('/profile/setting', function(req, res) {

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

    app.get('/admin', function(req, res) {

        Promise.all([
                sysinfo.mem, sysinfo.disksIO, sysinfo.networkConnections, sysinfo.processes
            ])
            .then(result => {
                res.render("", {
                    title: "Dashboard",
                    mem: result[0],
                    disk: result[1],
                    network: result[2],
                    processes: result[3]
                })

            })
            .catch(error => {
                console.error(error)
            })
    })

    app.get("/admin/overview", function(req, res) {

        Promise.all([
                sysinfo.osInfo, sysinfo.cpu, sysinfo.cpuCache, sysinfo.cpuCurrentspeed,
                sysinfo.mem, sysinfo.disksIO, sysinfo.networkConnections, sysinfo.networkInterfaces, sysinfo.networkInterfaceDefault
            ])
            .then(result => {
                res.render("", {
                    title: "Overview System Information",
                    osInfo: result[0],
                    cpuinfo: result[1],
                    cpuCache: result[2],
                    cpuCurrentspeed: result[3],
                    mem: result[4],
                    disksIO: result[5],
                    networkConnections: result[6],
                    networkInterfaces: result[7],
                    networkInterfaceDefault: result[8]
                })
            }).catch(error => {
                console.error(error)
            })
    })

    app.get('/admin/cpu', function(req, res) {
        Promise.all([
                sysinfo.cpu, sysinfo.cpuCache, sysinfo.cpuCurrentspeed, sysinfo.cpuFlags
            ])
            .then(result => {
                res.render("", {
                    title: 'CPU Usage Statistic',
                    cpu: result[0],
                    cpuCache: result[1],
                    cpuCurrentspeed: result[2],
                    cpuFlags: result[3]
                })
            })
    })

    app.get('/admin/memory', function(req, res) {
        sysinfo.mem()
            .then(memory => {
                res.render("", {
                    title: "Memory Usage Statistic",
                    total: memory.total,
                    free: memory.free,
                    inuse: memory.used,
                    active: memory.active,
                    available: memory.available,
                    buffer_cache: memory.buffcache,
                    swap_total: memory.swaptotal,
                    swap_use: memory.swapused,
                    swap_free: memory.swapfree
                })
            })
            .catch(error => console.error(error))
    })

    app.get('/admin/network', function(req, res) {
        Promise.all([
                sysinfo.networkInterfaces, sysinfo.networkInterfaceDefault, sysinfo.networkConnections
            ])
            .then(result => {
                res.render("", {
                    title: "Network Statistic",
                    result: result
                })
            })
    })

    app.get('/admin/disk', function(req, res) {
        Promise.all([
                sysinfo.disksIO, sysinfo.blockDevices
            ])
            .then(result => {
                res.render("", {
                    title: "Disk I/O and Block Device Statistic",
                    io: result[0],
                    device: result[1]
                })

            })
    })

    app.get('/admin/filesystem', function(req, res) {
        sysinfo.fsSize()
            .then(fs => {
                res.render("", {
                    title: "Linux Filesystem Statistic",
                    filesystem: fs
                })
            })
            .catch(error => console.error)
    })

    app.get('/admin/sysuser', function(req, res) {
        sysinfo.users()
            .then(users => {
                res.render("", {
                    users: users
                })
            })
            .catch(error => console.error(error))
    })

    app.get('/admin/processes', function(req, res) {
        sysinfo.processes()
            .then(processes => {
                res.render("", {
                    title: "Process Manager",
                    all: processes.all,
                    running: processes.running,
                    blocked: processes.blocked,
                    sleeping: processes.sleeping,
                    list: processes.processes
                })
            })
            .catch(error => console.error(error))
    })
}