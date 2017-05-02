var express = require('express')

module.exports = function Route(app, passport) {
    app.get('/', function(req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.render("work", {
            server: fullUrl
        })
    })
}