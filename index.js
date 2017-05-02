var express = require('express')
var app = express()
var port = process.env.PORT || 3927

app.listen(port, function() {
    console.log("Application is running at: " + port)
});

require("./configuration")(app)
require("./app/routes")(app)