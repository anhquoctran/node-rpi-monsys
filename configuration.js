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
var morgan = require("morgan")

module.exports = function Configuration(app) {

    //app.engine('pug', pug.renderFile)
    app.set("view engine", "pug")
    app.set('views', __dirname + '/views')
    app.use('/public', express.static(__dirname + '/public'))
    app.use(morgan('dev'))
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({
        extended: true
    }))
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

    app.use(passport.initialize())
    app.use(passport.session())
    var router = express.Router()

    require("./app/routes")(app, passport)
    require('./app/controllers/RestController')(app, router)
}