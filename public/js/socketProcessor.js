"use strict"

$(document).ready(function() {
    var socket = io.connect()
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

    socket.on("overload", function(data) {
        console.log(data)
    })

    socket.on("cpu", function(cpu) {
        console.log(cpu)
    })

    socket.on('logical', function(logical) {
        console.log(logical)
    })

    socket.on("memory", function(memory) {
        console.log(memory)
    })

    socket.on("disk", function(disk) {
        console.log(disk)
    })

    socket.on("processes", function(processes) {
        console.log(processes)
    })

    socket.on("network", function(network) {
        console.log(network)
    })

    socket.on("gpio", function(gpio) {

    })

})