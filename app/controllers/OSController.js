module.exports = function OSController(router, jwt) {
    router.route('/sysinfo/os_info').get(function(req, res) {
        var token = req.query.token
        if (!token) {

        } else {

        }
    })
}