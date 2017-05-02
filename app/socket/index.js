var io = require('socket.io'),
    cpu = require('./cpu'),
    mem = require('./memory'),
    disk = require('./disk'),
    network = require('./network'),
    gpio = require('./gpio')

function SysInfoSocketHandle(server) {
    io.listen(server)
    io.on('connection', function(socket) {
        console.log("Client connected")

        socket.on("cpu", function(info) {

        })

        socket.on("memory", function(info) {

        })

        socket.on("disk", function(info) {

        })

        socket.on("processes", function(info) {

        })

        socket.on("network", function(info) {

        })

        socket.on("gpio", function(info) {

        })
    })

    io.on("disconnected", function() {
        console.log("Client has disconnected from Socket")
    })
}

module.exports = SysInfoSocketHandle