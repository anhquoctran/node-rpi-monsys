var express = require('express')

module.exports = function Route(app, passport) {
    app.get('/', function(req, res) {
        res.redirect('/login')
    })

    app.get('/login', function(req, res) {
        res.render('login')
    })

    app.post('/login', function(req, res) {

    })

    app.post('/register', function(req, res) {

    })

    app.get('/register', function(req, res) {

    })

    app.get('/profile', function(req, res) {

    })

    app.get('/profile/setting', function(req, res) {

    })

    app.get('/logout', function(req, res) {

    })

    app.get('/admin', function(req, res) {

    })

    app.get("/admin/overview", function(req, res) {

    })

    app.get('/admin/cpu', function(req, res) {

    })

    app.get('/admin/memory', function(req, res) {

    })

    app.get('/admin/network', function(req, res) {

    })

    app.get('/admin/disk', function(req, res) {

    })

    app.get('/admin/filesystem', function(req, res) {

    })
}