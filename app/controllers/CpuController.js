var datetime = require('../middleware/datetime');
var jwt_simple = require('jwt-simple')
var cpu = require('../models/sysinfo')

module.exports = function CpuController(router, jwt) {
    router.route("/sysinfo/cpuinfo").get(function(req, res) {
        var token = req.query.token;
        if (!token) {
            res.json({
                message: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu: null
            });
        } else {
            var decoded = jwt_simple.decode(token, jwt.scret);
            if (decoded === jwt.user) {
                cpu.cpu()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            cpu: data
                        })
                    })
                    .catch(error => console.error(error))
            } else handleBadAuthentication(res)

        }
    })

    router.route("/sysinfo/cpucache").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu_cache: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.scret)
            if (decoded == jwt.user) {
                cpu.cpuCache()
                    .then(data =>
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            cpu_cache: data
                        })
                    )
                    .catch(error => console.error(error))
            } else handleBadAuthentication(res)
        }
    })

    router.route("/sysinfo/cpu_temp").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu_temp: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.scret)
            if (decoded == jwt.user) {
                cpu.cpuTemperature()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            cpu_temp: data
                        })
                    })
                    .catch(error => console.error(error))
            } else handleBadAuthentication(res)
        }
    })

    router.route("/sysinfo/cpu_speed").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu_currentSpeed: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.secret)
            if (decoded == jwt.user) {
                cpu.cpuCurrentspeed()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            cpu_currentSpeed: data
                        })
                    })
                    .catch(error => {
                        console.error(error)
                    })
            } else handleBadAuthentication(res)

        }
    })

    router.route("/sysinfo/cpu_flags").get(function(req, res) {
        var token = req.query.token
        if (!token) {
            res.json({
                token: "Request token invalid or null",
                request_datetime: datetime.getDateTimeNow(),
                cpu_flags: null
            })
        } else {
            var decoded = jwt_simple.decode(token, jwt.scret)
            if (decoded == jwt.user) {
                cpu.cpuFlags()
                    .then(data => {
                        res.json({
                            token: token,
                            request_datetime: datetime.getDateTimeNow(),
                            flags: data
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