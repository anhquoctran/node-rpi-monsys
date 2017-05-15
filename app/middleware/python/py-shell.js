var PythonShell = require("python-shell")

function PythonExecution() {

    this.getCpuUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("cpu_usage.py")
            pyshell.on('message', function(message) {
                resolve(message)
            })
        })
    }

    this.getDiskIo = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell('disk_io.py')
            pyshell.on('message', function(message) {
                resolve(message)
            })
        })
    }

    this.getNetworkTraffic = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("network_traffic.py")

            pyshell.on('message', function(message) {
                resolve(message)
            })
        })
    }

    this.getMemoryUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("ram_usage.py")

            pyshell.on('message', function(message) {
                resolve(message)
            })
        })
    }

    this.killProcess = function(pid) {
        return new Promise((resolve, reject) => {
            var options = {
                mode: 'text',
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
            var pyshell = new PythonShell('gpio_usage.py')

            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }
}

module.exports = new PythonExecution()