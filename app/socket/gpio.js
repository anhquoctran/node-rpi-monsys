var pyshell = require("../middleware/py-shell")

function GpioShell() {
    this.getGpioActivation = function(callback) {
        pyshell.getGpio()
            .then(gpio => {
                callback(gpio)
            })
            .catch(error => console.error(error))
    }
}

module.exports = new GpioShell();