"use strict"

$(function() {
    var socket = io("http://localhost:3927")
    var _cpuAdmin = $("#cpuPercentChart"),
        _cpuFreq = $("#cpuFreq"),
        _cpuPercent = $("#cpuPercent"),
        _memPercent = $("#memPercent"),
        _diskIo = $("#diskIoChart"),
        _killprocBtn = $("#killprocBtn"),
        _networkIo = $("#netioChart")

    socket.on("connected", function() {
        socket.emit("cpu")
        socket.emit("memory")
        socket.emit("disk")
        socket.emit("network")
        socket.emit("gpio")
    })

    _killprocBtn.on("click", function() {
        var pid = $(".rowSelected").value()
        socket.emit("processes", pid)
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