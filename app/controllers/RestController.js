var datetime = require('../middleware/datetime')
var migrate = require("../../database/migration/migrate")
module.exports = function Rest(app, router) {

    app.use('/api/oauth2', router);
    router.route('/').get(function(req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.json({
            message: "The API is OK and running at " + fullUrl,
            request_datetime: datetime.getDateTimeNow()
        })
    })

    router.route("/").head(function(req, res) {
        res.json({ accept: true })
    })

    router.route('/user/checkUsername', function(req, res) {
        var username = req.query.username(!username) ? res.json({
            message: "Unexpected username parameter"
        }) : migrate.checkUsername(username).then(data => (data == true) ? true : false).catch(error => console.error(error))
    })

    require('../middleware/oauth2')(router);
}