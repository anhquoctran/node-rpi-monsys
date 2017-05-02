var datetime = require('../middleware/datetime');
var jwt_simple = require('jwt-simple')
var network = require('../models/sysinfo')

module.exports = function NetworkInterfaceController(router, jwt) {
    router.route('/sysinfo/networkifaces').get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                list_ifaces: null
            })
        } else {
            let decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                network.networkInterfaces()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            list_ifaces: data
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