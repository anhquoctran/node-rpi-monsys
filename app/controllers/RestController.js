var datetime = require('../middleware/datetime')

module.exports = function Rest(app, router) {

    app.use('/api/oauth2', router);
    router.route('/').get(function(req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.json({
            message: "The API is OK and running at " + fullUrl,
            request_datetime: datetime.getDateTimeNow()
        })
    })
    require('../middleware/oauth2')(router);
}