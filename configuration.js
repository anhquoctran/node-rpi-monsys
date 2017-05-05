var express = require("express")
var bodyparser = require("body-parser")
var cookieParser = require('cookie-parser')
var session = require('express-session')
var fs = require('fs')
var pug = require('pug')
var passport = require('passport')
var path = require('path')
var redistStore = require('connect-redis')(session)
var config = require("./config/config")
var multer = require('multer')
var uuid = require("node-uuid-generator")

module.exports = function Configuration(app) {

    var storage = multer.diskStorage({
        filename: function(req, file, cb) {
            cb(null, "rpi_" + uuid.generate())
        }
    })

    //app.engine('pug', pug.renderFile)
    app.set("view engine", "pug")
    app.set('views', __dirname + '/views')
    app.use('/public', express.static(__dirname + '/public'))
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({
        extended: true
    }))
    app.use(session({
        store: new redistStore({
            url: config.redisStore.url
        }),
        secret: config.redisStore.secret,
        resave: false,
        saveUninitialized: false
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    var router = express.Router()
    require("./app/routes")(app, passport)
    require('./app/controllers/RestController')(app, router)
}