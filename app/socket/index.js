var cpu = require('./cpu'),
    mem = require('./memory'),
    disk = require('./disk'),
    network = require('./network'),
    gpio = require('./gpio'),
    proc = require('./process')

function SysInfoSocketHandle(server) {
    var io = require('socket.io')(server)
    io.on('connection', function(socket) {
        console.log("Client connected")

        cpu.getUsage(function(result) {
            if (result.percent >= 90) {
                socket.emit("overload", { message: "Warning! Your system overloading!" })
            }
        })

        socket.emit("start", {
            status: "OK"
        })

        socket.emit("connected", "Start")

        cpu.getUsage(function(result) {
            socket.emit("cpu", result)
        })

        cpu.getFreq(function(result) {
            socket.emit("freq", result)
        })

        cpu.getLogicalProcessor(function(result) {
            socket.emit("logical", result)
        })

        mem.getMemory(function(result) {
            socket.emit("memory", result)
        })

        disk.getIo(function(result) {
            socket.emit("disk", result)
        })

        socket.on("processes", function(info) {
            proc.kill(info.pid, function(result) {
                socket.emit('processes', result)
            })
        })

        network.getTraffic(function(result) {
            socket.emit('network', result)
        })

        gpio.getGpioActivation(function(result) {
            socket.emit('gpio', result)
        })
    })

    io.on("disconnected", function() {
        console.log("Client has disconnected from Socket")
    })
}

module.exports = SysInfoSocketHandle