var datetime = require("../middleware/datetime")
var jwt_simple = require('jwt-simple')
var processes = require('../models/sysinfo')

module.exports = function ProcessController(router, jwt) {
    router.route("/sysinfo/process").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                list_process: null
            })
        } else {
            let decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                processes.processes()
                    .then(processeList => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            list_process: processeList
                        })
                    })
                    .catch(error => {
                        console.error(error)
                    })
            } else handleBadAuthentication(res)
        }
    })

    function handleBadAuthentication(res) {
        res.status(400).send({
            message: "Error when authenticating session",
            status: 400
        })
    }
}