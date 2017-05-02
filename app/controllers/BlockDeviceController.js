var datetime = require('../middleware/datetime')
var block = require('../models/sysinfo')
var jwt_simple = require('jwt-simple')

module.exports = function BlockDeviceController(router, jwt) {
    router.route("/sysinfo/block_device").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                block_list: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                block.blockDevices()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            block_list: data
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