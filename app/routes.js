var express = require('express')
var crypto = require('crypto'),
    text = 'hello',
    key = 'abcfdfsdf'

module.exports = function Route(app, passport) {
    app.get('/', function(req, res) {
        var fullUrl = req.protocol + '://' + req.get('host');
        var hash = crypto.createHash('sha512')
        hash.update(new Date().toLocaleTimeString())
        var key = hash.digest('hex')

        var hashtoken = crypto.createHash('sha256')
        hashtoken.update(key)
        var token = hashtoken.digest('hex')

        res.json({
            message: "The API is running on " + fullUrl,
            status: 200,
            current_time: new Date().toLocaleTimeString(),
            session_base: {
                key: key,
                token: token,
                bare: req.session
            },
            data: req.route || null
        })
    })
}