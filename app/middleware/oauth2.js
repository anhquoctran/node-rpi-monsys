var OAuth2Strategy = require('passport-oauth2')
var LocalStrategy = require('passport-local').Strategy
var OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy
var passport = require('passport')
var datetime = require('./datetime')

module.exports = function OAuth2(router) {
    var refreshStrategy = new OAuth2RefreshTokenStrategy({
        refreshWindow: 20,
        userProperty: 'ticket',
        authenticationURL: 'login',
        callbackParameter: 'callback'
    })

    passport.use('main', refreshStrategy)

    var oauthstrategy = new OAuth2Strategy({
        authorizationURL: "http://localhost:3927/api/oauth2/auth",
        tokenURL: "http://localhost:3927/api/oauth2/token",
        clientID: "clientID",
        clientSecret: "clientSecret",
        callbackURL: "/oauth/callback",
        passReqToCallback: false
    }, refreshStrategy.getOAuth2StrategyCallback())

    passport.use('oauth', oauthstrategy)
    refreshStrategy.useOAuth2Strategy(oauthstrategy)

    var localstrategy = new LocalStrategy({
        usernameField: "username",
        passwordField: "password"
    }, refreshStrategy.getLocalStrategyCallback())

    passport.use("local", localstrategy)

    require('../controllers/UserController')(router, passport)
    require('../controllers/BlockDeviceController')(router, passport)
    require('../controllers/CpuController')(router, passport)
    require('../controllers/DiskIOController')(router, passport)
    require('../controllers/FileSystemController')(router, passport)
    require('../controllers/MemoryController')(router, passport)
    require('../controllers/NetIfaceController')(router, passport)
    require('../controllers/NetworkConnectionController')(router, passport)
    require('../controllers/OSController')(router, passport)
    require('../controllers/ProcessController')(router, passport)
    require("../controllers/ServiceController")(router, passport)
    require('../controllers/SystemUserController')(router, passport)
}