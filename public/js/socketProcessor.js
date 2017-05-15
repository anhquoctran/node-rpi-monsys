"use strict"

$(document).ready(function() {
    var socket = io()
    var _cpuAdmin = $("#cpu-usage-chart"),
        _cpuFreq = $("#cpu-freq"),
        _cpuPercent = $("#cpu-percent"),
        _memPercent = $("#memPercentChart"),
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

    socket.on("test", function(data) {
        console.log(data)
    })

    _killprocBtn.on("click", function() {
        var pid = $(".rowSelected").value()
        socket.emit("processes", pid)
    })

    socket.emit("overload", function(data) {

    })

    socket.on("cpu", function(cpu) {

    })

    socket.on('logical', function(logical) {
        for (let i = 0; i <= logical.length; i++) {

        }
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