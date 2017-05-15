var pyshell = require("../middleware/python/py-shell")

function CpuShell() {
    this.getUsage = function(callback) {
        pyshell.getCpuUsage()
            .then(usage => {
                callback(usage)
            })
            .catch(error => console.error(error))
    }
}

module.exports = new CpuShell()