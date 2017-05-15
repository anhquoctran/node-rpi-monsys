var pyshell = require("../middleware/python/py-shell")

function MemoryShell() {
    this.getMemory = function(callback) {
        pyshell.getMemoryUsage()
            .then(memory => {
                callback(memory)
            })
            .catch(error => {
                console.error(error)
            })
    }
}

module.exports = new MemoryShell()