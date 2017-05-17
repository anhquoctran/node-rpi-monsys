var PythonShell = require("python-shell")

function PythonExecution(server) {
    var io = require("socket.io")(server)

    io.on('connection', function(socket) {
        console.log("Client connected")

        var cpu_usage = new PythonShell.run("cpu_usage.py", { scriptPath: __dirname }, function(er, r) {})
        cpu_usage.on("message", function(message) {
            socket.emit("cpu", message)
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
        pyshell.on("message", function(message) {
            socket.emit("network", message)
        })

        var gpio = new PythonShell.run('gpio_usage.py', { scriptPath: __dirname }, function(er, r) {})
        pyshell.on("message", function(message) {
            socket.on("gpio", message)
        })

        var options = {
            mode: 'text',
            scriptPath: __dirname,
            pythonOptions: ['-p'],
            args: [pid]
        }

        var kill = new PythonShell.run('process_kill.py', options, function(err, results) {
            if (err) reject(err)
            else {
                resolve(results)
            }
        })

    })

    this.getFreq = function() {
        return new Promise(function(resolve, reject) {
            var pyshell = new PythonShell.run("cpu_freq.py", { scriptPath: __dirname }, function(err, r) {})

            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.killProcess = function(pid) {
        return new Promise((resolve, reject) => {;

        })
    }

    this.getGpio = function() {
        return new Promise((resolve, reject) => {

        })
    }
}

module.exports = new PythonExecution()