var express = require('express')
var sysinfo = require('../app/models/sysinfo')
var localStrategy = require("passport-local")

module.exports = function Route(app, passport) {

    passport.use(new localStrategy({
        function(username, password, done) {
            migrate.findUser(username, function(err, user) {
                if (err) return done(err)
                if (!user) {
                    return done(null, false)
                }

                if (password !== user.password) {
                    return done(null, false)
                }
                return done(null, user)
            })
        }
    }))

    function authenticationMiddleware() {
        return function(req, res, next) {
            if (req.isAuthenticated()) {
                return next()
            }
            res.redirect('/login')
        }
    }

    app.get('/', function(req, res) {
        res.redirect('/login')
    })

    app.get('/login', function(req, res) {
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
            phone = req.body.phone;

        if (username || fullname || email || password || birthdate || hometown || wherenow || phone) {

        } else {

        }
    })

    app.get('/register', function(req, res) {
        res.render('register');
    })

    app.get('/profile', function(req, res) {
        res.render('profile');
    })

    app.get('/profile/setting', function(req, res) {

    })

    app.get('/logout', function(req, res) {

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