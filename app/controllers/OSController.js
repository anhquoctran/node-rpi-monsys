var datetime = require('../middleware/datetime')
var jwt_simple = require('jwt-simple')
var os = require("../models/sysinfo")

module.exports = function OSController(router, jwt) {
    router.route('/sysinfo/os_info').get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                os: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                os.osInfo()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            os: data
                        })
                    })
                    .catch(error => console.error(error))
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