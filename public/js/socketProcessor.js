"use strict"

$(function() {
    var socket = io("http://localhost:3927")
    var _cpuAdmin = $("#cpuPercentChart"),
        _cpuFreq = $("#cpuFreq"),
        _cpuPercent = $("#cpuPercent"),
        _memPercent = $("#memPercent"),
        _diskIo = $("#diskIoChart"),
        _processes = $("#processes"),
        _networkIo = $("#netioChart")

    socket.on("connected", function() {
        socket.emit("cpu")
        socket.emit("memory")
        socket.emit("disk")
        socket.emit("processes")
        socket.emit("network")
        socket.emit("gpio")
    })

    socket.on("cpu", function(cpu) {

    })

    socket.on("memory", function(cpu) {

    })

    socket.on("disk", function(cpu) {

    })

    socket.on("processes", function(cpu) {

    })

    socket.on("network", function(cpu) {

    })

    socket.on("gpio", function(cpu) {

    })
})