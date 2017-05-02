var datetime = require('../middleware/datetime');
var jwt_simple = require('jwt-simple')
var disk = require('../models/sysinfo')

module.exports = function DiskIOController(router, jwt) {
    router.route('/sysinfo/disk_io').get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                io: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.scret)
            if (decoded == jwt.user) {
                disk.disksIO()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            io: data
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