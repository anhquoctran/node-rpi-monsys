var PythonShell = require("python-shell")

function PythonExecution() {

    this.getCpuUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("../../python/cpu_usage.py")
            pyshell.on('message', function(message) {
                resolve(message)
            })

            pyshell.end(function(error) {
                if (error) reject(error)
                console.log("Finished execution")
            })
        })
    }

    this.getDiskIo = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell('../../python/disk_io.py')
            pyshell.on('message', function(message) {
                resolve(message)
            })

            pyshell.end(function(error) {
                if (error) reject(error)
                console.log("Finished execution")
            })

        })
    }

    this.getNetworkTraffic = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("../../python/network_traffic.py")

            pyshell.on('message', function(message) {
                resolve(message)
            })

            pyshell.end(function(error) {
                if (error) reject(error)
                console.log("Finished execution")
            })

        })
    }

    this.getMemoryUsage = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell("../../python/ram_usage.py")

            pyshell.on('message', function(message) {
                resolve(message)
            })

            pyshell.end(function(error) {
                if (error) reject(error)
                console.log("Finished execution")
            })
        })
    }

    this.killProcess = function(pid) {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell('../../python/process_kill.py')

            pyshell.send("-pid " + pid);
            pyshell.on("message", function(message) {
                resolve(message)
            })

            pyshell.end(function(error) {
                if (error) reject(error)
                console.log("Finished execution")
            })
        })
    }

    this.getGpio = function() {
        return new Promise((resolve, reject) => {
            var pyshell = new PythonShell('../../python/gpio_usage.py')

            pyshell.on("message", function(message) {
                resolve(message)
            })

            pyshell.end(function(error) {
                if (error) reject(error)
                console.log("Finished execution")
            })
        })
    }
}

module.exports = new PythonExecution()