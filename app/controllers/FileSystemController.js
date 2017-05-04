var datetime = require('../middleware/datetime');
var jwt_simple = require('jwt-simple')
var fs = require('../models/sysinfo')

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
            let decoded = jwt_simple.decode(token, jwt.secret);
            if (decoded == jwt.user) {
                fs.fsSize()
                    .then(data => {
                        console.log("GET " + req.originalUrl + " 200 OK")
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            fs_sizes: data
                        });
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