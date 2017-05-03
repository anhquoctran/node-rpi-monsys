var express = require('express')
var crypto = require('crypto'),
    text = 'hello',
    key = 'abcfdfsdf'

module.exports = function Route(app, passport) {
    app.get('/', function(req, res) {
        res.redirect('/login')
    })

    app.get('/login', function(req, res) {
        res.render('login')
    })

    app.post('/login', function(req, res) {

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

    app.get('/admin/network/interfaces', function(req, res) {

    })

    app.get('/admin/network/connections', function(req, res) {

    })

    app.get('/admin/network/traffic', function(req, res) {

    })

    app.get('/admin/disk', function(req, res) {

    })

    app.get('/admin/filesystem', function(req, res) {

    })
}