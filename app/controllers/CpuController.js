var datetime = require('../middleware/datetime');
var jwt = require('jwt-simple')

module.exports = function CpuController(router, jwt) {
    router.route("/sysinfo/cpuinfo").get(function(req, res) {
        var token = req.query.token;
        if (!token) {
            res.json({
                message: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu: null
            });
        } else {}
    });

    router.route("/sysinfo/cpucache").get(function(req, res) {
        var token = req.query.token;
        if (!token) {
            res.json({
                message: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu: null
            })
        }
    })

}