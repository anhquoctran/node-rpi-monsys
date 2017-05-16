var PythonShell = require("python-shell")

function PythonExecution() {
    this.getCpuUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell.run("cpu_usage.py", { scriptPath: __dirname }, function(er, r) {})
            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.getLogical = function() {
        return new Promise(function(req, res) {
            var pyshell = new PythonShell.run("cpu_logical_processors.py", { scriptPath: __dirname }, function(err, r) {})

            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.getFreq = function() {
        return new Promise(function(resolve, reject) {
            var pyshell = new PythonShell.run("cpu_freq.py", { scriptPath: __dirname }, function(err, r) {})

            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.getDiskIo = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell.run('disk_io.py', { scriptPath: __dirname }, function(er, r) {})
            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.getNetworkTraffic = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell.run("network_traffic.py", { scriptPath: __dirname }, function(er, r) {})
            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.getMemoryUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell.run("ram_usage.py", { scriptPath: __dirname }, function(er, r) {})
            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }

    this.killProcess = function(pid) {
        return new Promise((resolve, reject) => {
            var options = {
                mode: 'text',
                scriptPath: __dirname,
                pythonOptions: ['-p'],
                args: [pid]
            };
            PythonShell.run('process_kill.py', options, function(err, results) {
                if (err) reject(err)
                else {
                    resolve(results)
                }
            })
        })
    }

    this.getGpio = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell.run('gpio_usage.py', { scriptPath: __dirname }, function(er, r) {})
            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }
}

module.exports = new PythonExecution()