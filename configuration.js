var express = require("express")
var bodyparser = require("body-parser")
var cookieParser = require('cookie-parser')
var session = require('express-session')
var fs = require('fs')
var pug = require('pug')

module.exports = function Configuration(app) {
    app.set("view engine", "pug")
    app.set("views", __dirname + "/views")
    app.set("/resources", express.static(__dirname + '/resources'))
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({
        extended: true
    }))
    app.use(session({
        cookie: 'session',
        secret: 'userlogin',
        resave: false,
        saveUninitialized: true,
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000
    }))

    var router = express.Router()
    require('./app/controllers/RestController')(app, router)
}