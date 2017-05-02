var pyshell = require("../middleware/py-shell")

function DiskShell() {
    this.getIo = function(callback) {
        pyshell.getDiskIo()
            .then(io => {
                callback(io)
            })
            .catch(error => {
                console.error(error)
            })
    }
}

module.exports = new DiskShell()