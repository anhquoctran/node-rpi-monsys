var PythonShell = require("python-shell")

function PythonExecution(server) {
    var io = require("socket.io")(server)

    io.on('connection', function(socket) {
        console.log("Client connected")

        var cpu_usage = new PythonShell.run("cpu_usage.py", { scriptPath: __dirname }, function(er, r) {})
        cpu_usage.on("message", function(message) {
            socket.emit("cpu", [new Date().getTime(), parseFloat(message)])
        })

        var logical = new PythonShell.run("cpu_logical_processors.py", { scriptPath: __dirname }, function(er, r) {})
        logical.on("message", function(message) {
            socket.emit("logical", message)
        })

        var freq = new PythonShell.run("cpu_freq.py", { scriptPath: __dirname }, function(er, r) {})
        freq.on("message", function(message) {
            socket.emit("freq", message)
        })

        var mem = new PythonShell.run("ram_usage.py", { scriptPath: __dirname }, function(er, r) {})
        mem.on("message", function(message) {
            socket.emit("memory", message)
        })

        var disk = new PythonShell.run('disk_io.py', { scriptPath: __dirname }, function(er, r) {})
        disk.on("message", function(message) {
            socket.emit("disk", message)
        })

        var net = new PythonShell.run("network_traffic.py", { scriptPath: __dirname }, function(er, r) {})
        net.on("message", function(message) {
            socket.emit("network", message)
        })

        var gpio = new PythonShell.run('gpio_usage.py', { scriptPath: __dirname }, function(er, r) {})
        gpio.on("message", function(message) {
            socket.on("gpio", message)
        })

        socket.on("kill", function(id) {
            opts = {
                scriptPath: __dirname,
                args: [pid],
                pythonOptions: ["-p"]
            }
            var kill = new PythonShell.run("process_kill.py", opts, function(err, r) {})
            kill.on("message", function(message) {
                socket.emit("killon", message)
            })

        })

    })
}

module.exports = PythonExecution