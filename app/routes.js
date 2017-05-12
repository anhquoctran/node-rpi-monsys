var express = require('express')
var sysinfo = require('../app/models/sysinfo')
var localStrategy = require("passport-local").Strategy
var migrator = require('../database/migration/migrate')
var file = require('../app/middleware/file')
var datetime = require("../app/middleware/datetime")
var mail = require("../app/middleware/mail")
var JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
var ensure_login = require("connect-ensure-login")

module.exports = function Route(app, passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.username)
    })

    passport.deserializeUser(function(username, done) {
        migrator.getOneUser(username)
            .then(data => {
                done(null, data[0])
            })
            .catch(error => done(error, null))
    })

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
    passport.use('login', new localStrategy({
        usernameField: "usernameOrEmail",
        passwordField: "password",
        passReqToCallback: true
    }, function(usernameOrEmail, password, done) {
        migrator.login(usernameOrEmail, passport)
            .then(result => {
                if (!result.length) return done(null, false, req.flash('loginMessage', 'No user found.'))

                if (!(rows[0].password == password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))

                return done(null, rows[0]);
            })
            .catch(error => {
                return done(error)
            })
    }))

    passport.use("register", new localStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, username, email, password, fullname, done) {
        migrator.register(username, passport, email, fullname).then(data => {
                (data === true) ? true: false
            })
            .catch(error => {
                done(error)
            })
    }))

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    }

    app.get('/', function(req, res) {
        res.redirect("/login")
    })

    app.get('/login', function(req, res) {
        res.render('login', {
            title: "Login to your system - RPiMonSys"
        })
    })

    app.post('/login', passport.authenticate('login'), { successRedirect: '/admin', failureRedirect: '/login' })

    app.post('/register', function(req, res) {

        var username = req.body.username,
            fullname = req.body.fullname,
            email = req.body.email,
            password = req.body.password,
            birthdate = req.body.birthdate,
            hometown = req.body.hometown,
            wherenow = req.body.wherenow,
            phone = req.body.phone,
            bio = req.body.bio

        if (username || fullname || email || password || birthdate || hometown || wherenow || phone || bio || description) {
            migrator.register(username, password, email, fullname, phone, hometown, wherenow, bio)
                .then(result => {
                    if (result == true) {

                    } else {

                    }
                })
                .catch(error => console.error(error))
        } else {

        }

    })

    app.get('/forgot', function(req, res) {
        res.render('forgot', {
            title: "Forgot your password - RPiMonSys"
        })
    })

    app.get('/register', function(req, res) {
        res.render('register', {
            title: "Create an account to access our system"
        });
    })

    app.get('/account/:username', ensure_login.ensureLoggedIn(), function(req, res) {
        var username = req.params.username
        if (!username) {

        } else {
            if (username) {
                migrator.getOneUser(username)
                    .then(data => {
                        res.render("layouts/profile/settings", {
                            title: "Profile - RPiMonSys",
                            user: data
                        })
                    })
                    .catch(error => {
                        console.error(error)
                    })
            } else {
                res.redirect("/admin?error=permission_denied")
            }
        }
    })

    app.get('/account/preferences', ensure_login.ensureLoggedIn(), function(req, res) {
        res.render('layouts/profile/setting', {
            title: "Setting",
            message: null
        });
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
        req.logout();
        res.redirect('/login')
    })

    app.get('/admin/admin_cp', ensure_login.ensureLoggedIn(), function(req, res) {
        res.render("admin_cp", {
            title: "Administrator Control Panel",
            data: null
        })
    })

    app.get('/admin', function(req, res) {

        Promise.all([
                sysinfo.mem(), ensure_login.ensureLoggedIn(), sysinfo.disksIO(), sysinfo.networkConnections(), sysinfo.processes()
            ])
            .then(result => {
                res.render("layouts/sysinfo/general", {
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

    app.get('/sysinfo/terminal/ssh', ensure_login.ensureLoggedIn(), function(req, res) {
        res.json({ message: "OK" })
    })

    app.get("/admin/overview", ensure_login.ensureLoggedIn(), function(req, res) {
        Promise.all([
                sysinfo.osInfo(), sysinfo.cpu(), sysinfo.cpuCache(), sysinfo.cpuCurrentspeed(),
                sysinfo.mem(), sysinfo.disksIO(), sysinfo.networkConnections(), sysinfo.networkInterfaces(), sysinfo.networkInterfaceDefault(), sysinfo.fsSize()
            ])
            .then(result => {
                res.render("layouts/sysinfo/overview", {
                    title: "Overview System Information",
                    osInfo: result[0],
                    cpuinfo: result[1],
                    cpuCache: result[2],
                    cpuCurrentspeed: result[3],
                    mem: result[4],
                    disksIO: result[5],
                    networkConnections: result[6],
                    networkInterfaces: result[7],
                    networkInterfaceDefault: result[8],
                    filesystem: result[9]
                })
            }).catch(error => {
                console.error(error)
            })
    })

    app.get('/admin/cpu', ensure_login.ensureLoggedIn(), function(req, res) {
        Promise.all([
                sysinfo.cpu(), sysinfo.cpuCache(), sysinfo.cpuCurrentspeed(), sysinfo.cpuFlags()
            ])
            .then(result => {
                res.render("layouts/sysinfo/cpu", {
                    title: 'CPU Usage Statistic',
                    cpu: result[0],
                    cpuCache: result[1],
                    cpuCurrentspeed: result[2],
                    cpuFlags: result[3]
                })
            })
    })

    app.get('/admin/memory', ensure_login.ensureLoggedIn(), function(req, res) {
        sysinfo.mem()
            .then(memory => {
                res.render("/layouts/sysinfo/memory", {
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

    app.get('/admin/network', ensure_login.ensureLoggedIn(), function(req, res) {
        Promise.all([
                sysinfo.networkInterfaces(), sysinfo.networkInterfaceDefault(), sysinfo.networkConnections()
            ])
            .then(result => {
                res.render("layout/sysinfo/network", {
                    title: "Network Statistic",
                    result: result
                })
            })
    })

    app.get('/admin/disk', ensure_login.ensureLoggedIn(), function(req, res) {
        Promise.all([
                sysinfo.disksIO(), sysinfo.blockDevices()
            ])
            .then(result => {
                res.render("layouts/sysinfo/disk", {
                    title: "Disk I/O and Block Device Statistic",
                    io: result[0],
                    device: result[1]
                })

            })
    })

    app.get('/admin/filesystem', ensure_login.ensureLoggedIn(), function(req, res) {
        sysinfo.fsSize()
            .then(fs => {
                res.render("layouts/sysinfo/filesytem", {
                    title: "Linux Filesystem Statistic",
                    filesystem: fs
                })
            })
            .catch(error => console.error)
    })

    app.get('/admin/sysuser', ensure_login.ensureLoggedIn(), function(req, res) {
        sysinfo.users()
            .then(users => {
                res.render("layouts/sysinfo/sysuser", {
                    users: users
                })
            })
            .catch(error => console.error(error))
    })

    app.get('/admin/processes', ensure_login.ensureLoggedIn(), function(req, res) {
        sysinfo.processes()
            .then(processes => {
                res.render("layouts/sysinfo/processes", {
                    title: "Process Manager",
                    all: processes.all,
                    running: processes.running,
                    blocked: processes.blocked,
                    sleeping: processes.sleeping,
                    list: processes.list
                })
            })
            .catch(error => console.error(error))
    })
}