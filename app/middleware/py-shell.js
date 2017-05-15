var PythonShell = require("python-shell")

function PythonExecution() {

    this.getCpuUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("../python/cpu_usage.py")
            pyshell.on('message', function(message) {
                resolve(message)
            })


        })
    }

    this.getDiskIo = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell('../python/disk_io.py')
            pyshell.on('message', function(message) {
                resolve(message)
            })
        })
    }

    this.getNetworkTraffic = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("../python/network_traffic.py")

            pyshell.on('message', function(message) {
                resolve(message)
            })
        })
    }

    this.getMemoryUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("../python/ram_usage.py")

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
            PythonShell.run('../python/process_kill.py', options, function(err, results) {
                if (err) reject(err)
                else {
                    resolve(results)
                }
            })
        })
    }

    this.getGpio = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell('../python/gpio_usage.py')

            pyshell.on("message", function(message) {
                resolve(message)
            })
        })
    }
}

module.exports = new PythonExecution()