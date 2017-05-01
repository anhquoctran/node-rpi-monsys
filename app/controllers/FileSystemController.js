var datetime = require('../middleware/datetime');
var jwt_simple = require('jwt-simple')
var cpu = require('../models/sysinfo')

module.exports = function FileSystemController(router, jwt) {

    router.route('/sysinfo/fs_size').get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                fs_sizes: null
            })
        } else {

        }
    })
}