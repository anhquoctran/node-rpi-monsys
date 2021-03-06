var express = require('express')
var app = express()
var server = require('http').Server(app)
var port = process.env.PORT || 3927
server.listen(port, function() {
    console.log("Application is running at " + port)
})

require("./configuration")(app)
require("./app/middleware/python/py-shell")(server)