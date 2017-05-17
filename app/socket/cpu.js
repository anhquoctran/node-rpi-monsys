var pyshell = require("../middleware/python/py-shell")

function CpuShell() {
    this.getUsage = function(callback) {
        pyshell.getCpuUsage()
            .then(usage => {
                console.log("CPU: " + usage)
                callback(usage)
            })
            .catch(error => console.error(error))
    }

    this.getLogicalProcessor = function(callback) {
        pyshell.getLogical()
            .then(logical => {
                callback(logical)
            })
            .catch(error => console.log(error))
    }

    this.getFreq = function(callback) {
        pyshell.getFreq()
            .then(data => {
                callback(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}

module.exports = new CpuShell()