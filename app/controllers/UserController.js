var jwt_simple = require('jwt-simple')
var datetime = require('../middleware/datetime')
var migrator = require("../../database/migration/migrate")
module.exports = function UserController(router, passport) {
    var authenticated = {
        user: {
            username: String,
            password: String
        },
        secret: String
    }

    router.route("/login").get(function(req, res) {
        var callback = req.query.callback || '/'

        res.json({
            message: "Please use POST /login to login API",
            request_datetime: datetime.getDateTimeNow()
        })

    })

    router.route('/login').post(function(req, res, next) {
        var callback = req.query.callback || '/profile'
        var usernameOrEmail = req.body.usernameOrEmail;
        var password = req.body.password

        if (!usernameOrEmail || !password) {
            res.json({
                message: "Required fields not null",
                request_datetime: datetime.getDateTimeNow()
            })
        } else {
            migrator.getUserByEmail(usernameOrEmail, password)
                .then(data => {
                    if (data) {

                    } else {

                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }
    })

    router.route('/').get(passport.authenticate('oauth'))

    router.route('/callback').get(passport.authenticate('oauth', function(req, res) {
        res.redirect("/authenticated")
    }))

    router.route('/authenticated').get(passport.authenticate('main', function(req, res) {
        res.json({
            message: "Login sucessfully! Your session ready for new request",
            request_datetime: datetime.getDateTimeNow()
        })
    }))

    router.route('/user/create').post(passport.authenticate('main', function(req, res) {

    }))

    router.route('/user/fetchAll').get(passport.authenticate('main', function(req, res) {

    }))

    router.route('/user/fetch/:username').get(function(req, res) {

    })

    router.route('/user/delete/').delete(function(req, res) {

    })

    router.route('/user/update/').put(function(req, res) {

    })

    require('../controllers/BlockDeviceController')(router, authenticated)
    require('../controllers/CpuController')(router, authenticated)
    require('../controllers/DiskIOController')(router, authenticated)
    require('../controllers/FileSystemController')(router, authenticated)
    require('../controllers/MemoryController')(router, authenticated)
    require('../controllers/NetIfaceController')(router, authenticated)
    require('../controllers/NetworkConnectionController')(router, authenticated)
    require('../controllers/OSController')(router, authenticated)
    require('../controllers/ProcessController')(router, authenticated)
    require("../controllers/ServiceController")(router, authenticated)
    require('../controllers/SystemUserController')(router, authenticated)
}