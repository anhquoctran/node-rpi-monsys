var express = require('express')

module.exports = function Route(app, passport) {
    app.get('/', function(req, res) {
        res.render('index')
    })

    app.get('/login', function(req, res) {
        res.render('login')
    })

    app.get('/logout', function(req, res) {

    })

    app.get('/user/preferences', function(req, res) {

    })

    app.get('admin/cp/devices', function(req, res) {

    })

    app.get('/admin/cp', function(req, res) {
        res.render('admin-cp');
    })

    app.get('/user/profile/:username', function(req, res) {

    })
}