module.exports = function Rest(app, router) {
    app.use('/api/oauth2', router);

    require('../middleware/oauth2')(router);
}