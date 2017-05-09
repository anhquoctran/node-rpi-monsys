var notify = require("push-notify")
var fs = require('fs')

function NotificationProvider() {

    const settings = {
        wns: {
            client_id: "00000000441CE008",
            client_secret: "ndhjUOODx3YL0kvNp+LYmQB76vd7h/wl",
        },
        gcm: {
            apiKey: '<GOOGLE_SERVER_API_KEY>',
            retries: 1
        },
        apn: {
            key: "",
            cert: ""
        }
    }

    var apn = notify.apn(settings.apn)

    var gcm = notify.gcm(settings.gcm)

    var wns = notify.wns(settings.wns)

    var mpns = notify.mpns(settings.mpns)
}
module.exports = new NotificationProvider();