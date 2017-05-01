module.exports = function UserController(router, passport) {
    router.route("/login").get(function(req, res) {
        var callback = req.query.callback || '/'

        if (req.isAuthenticated()) {
            return res.redirect(callback)
        } else {
            res.json({
                message: "Please use POST /login to login API",
                request_datetime: datetime.getDateTimeNow()
            })
        }
    })

    router.route('/login').post(function(req, res, next) {
        var callback = req.query.callback || '/profile'

        passport.authenticate('local', function(err, user, info) {
            if (err || !user) {
                res.json({
                    message: "Unable to login! Please check your username and password",
                    request_datetime: datetime.getDateTimeNow(),
                    user_info: null
                })
            }

            req.logIn(user, function(error) {
                if (error) {
                    return next(error)
                }

                return res.redirect(callback)
            })
        })(req, res, next)
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
}