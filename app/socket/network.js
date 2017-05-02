var pyshell = require("../middleware/py-shell")

function NetworkShell() {
    this.getTraffic = function(callback) {
        pyshell.getNetworkTraffic()
            .then(traffic => {
                callback(traffic)
            })
            .catch(error => {
                console.error(error)
            })
    }
}

module.exports = new NetworkShell()