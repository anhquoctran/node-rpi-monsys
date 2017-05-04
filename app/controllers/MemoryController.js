var memory = require("../models/sysinfo")
var datetime = require('../middleware/datetime')
var jwt_simple = require('jwt-simple')

module.exports = function MemoryController(router, jwt) {
    router.route('/sysinfo/mem_info').get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid",
                request_datetime: datetime.getDateTimeNow(),
                memory_properties: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                memory.mem()
                    .then(data => {
                        console.log("GET " + req.originalUrl + " 200 OK")
                        res.json({

                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            memory_properties: data
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