const net = require('net')

class DockerSocket {

    listContainers(all, callback) {
        try {

            var socket = net.createConnection({ path: '/var/run/docker.sock' })
            var alldata = ''

            socket.on("connect", () => {
                socket.write('GET http:/containers/json' + (all ? "?all=1" : "") + ' HTTP/1.0\r\n\r\n')
            })

            socket.on("data", data => {
                alldata = alldata + data.toString()
            })

            socket.on("error", () => {
                socket = false
                callback({})
            })

            socket.on('end', () => {
                var startbody = alldata.indexOf("\r\n\r\n")
                alldata = alldata.substring(startbody, 100000).replace(/[\n\r]/g, '')
                socket = false
                callback(JSON.parse(alldata))
            })
        } catch (err) {
            callback({})
        }
    }

    getStats(id, callback) {
        id = id || ''
        if (id) {
            try {
                var socket = net.createConnection({ path: '/var/run/docker.sock' })
                var alldata = ''

                socket.on("connect", () => {
                    socket.write('GET http:/containers/' + id + '/stats?stream=0 HTTP/1.0\r\n\r\n')
                })

                socket.on("data", data => {
                    alldata = alldata + data.toString()
                })

                socket.on("error", () => {
                    socket = false
                    callback({})
                })

                socket.on('end', () => {
                    var startbody = alldata.indexOf("\r\n\r\n")
                    alldata = alldata.substring(startbody, 100000).replace(/[\n\r]/g, '')
                    socket = false
                    callback(JSON.parse(alldata))
                })
            } catch (err) {
                callback({})
            }
        } else {
            callback({})
        }
    }

    getProcesses(id, callback) {
        id = id || ''
        if (id) {
            try {
                var socket = net.createConnection({ path: '/var/run/docker.sock' })
                var alldata = ''

                socket.on("connect", () => {
                    socket.write('GET http:/containers/' + id + '/top?ps_args=-opid,ppid,pgid,vsz,time,etime,nice,ruser,user,rgroup,group,stat,rss,args HTTP/1.0\r\n\r\n')
                })

                socket.on("data", data => {
                    alldata = alldata + data.toString()
                })

                socket.on("error", () => {
                    socket = false
                    callback({})
                })

                socket.on('end', () => {
                    var startbody = alldata.indexOf("\r\n\r\n")
                    alldata = alldata.substring(startbody, 100000).replace(/[\n\r]/g, '')
                    socket = false
                    callback(JSON.parse(alldata))
                })
            } catch (err) {
                callback({})
            }
        } else {
            callback({})
        }
    }
}

module.exports = DockerSocket