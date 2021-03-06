var datetime = require("../middleware/datetime")
var jwt_simple = require("jwt-simple")
var sysuser = require('../models/sysinfo')

module.exports = function SystemUserController(router, jwt) {
    router.route("/sysinfo/sysuser").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                users: null
            })
        } else {
            let decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                sysuser.users()
                    .then(users => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            users: users
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