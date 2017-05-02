var datetime = require('../middleware/datetime')
var jwt_simple = require('jwt-simple')
var network = require('../models/sysinfo')

module.exports = function NetworkConnectionController(router, jwt) {
    router.route("/sysinfo/networkconns").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                list_connection: null
            })
        } else {
            let decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {

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