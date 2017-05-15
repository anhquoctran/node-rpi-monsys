var pyshell = require("../middleware/python/py-shell")

function ProcessShell() {
    this.kill = function(pid, callback) {
        pyshell.killProcess(pid)
            .then(result => {
                callback(result)
            })
            .catch(error => console.error(error))
    }
}

module.exports = new ProcessShell()