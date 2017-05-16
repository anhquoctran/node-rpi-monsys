const os = require('os')
const exec = require('child_process').exec
const fs = require('fs')
const util = require('./util')

var _platform = os.type()

const _linux = (_platform == 'Linux')
const _darwin = (_platform == 'Darwin')
const _windows = (_platform == 'Windows_NT')
const NOT_SUPPORTED = 'not supported'

module.exports = function(callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {

            var result = {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),

                active: os.totalmem() - os.freemem(), // temporarily (fallback)
                available: os.freemem(), // temporarily (fallback)
                buffcache: 0,

                swaptotal: 0,
                swapused: 0,
                swapfree: 0
            }

            if (_linux) {
                exec("free -b", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')

                        var mem = lines[1].replace(/ +/g, " ").split(' ')
                        result.total = parseInt(mem[1])
                        result.free = parseInt(mem[3])

                        if (lines.length === 4) { // free (since free von procps-ng 3.3.10)
                            result.buffcache = parseInt(mem[5])
                            result.available = parseInt(mem[6])
                            mem = lines[2].replace(/ +/g, " ").split(' ')
                        } else { // free (older versions)
                            result.buffcache = parseInt(mem[5]) + parseInt(mem[6])
                            result.available = result.free + result.buffcache
                            mem = lines[3].replace(/ +/g, " ").split(' ')
                        }
                        result.active = result.total - result.free - result.buffcache

                        result.swaptotal = parseInt(mem[1])
                        result.swapfree = parseInt(mem[3])
                        result.swapused = parseInt(mem[2])

                    }
                    if (callback) { callback(result) }
                    resolve(result)
                })
            }
            if (_darwin) {
                exec("vm_stat | grep 'Pages active'", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')

                        result.active = parseInt(lines[0].split(':')[1]) * 4096
                        result.buffcache = result.used - result.active
                        result.available = result.free + result.buffcache
                    }
                    exec("sysctl -n vm.swapusage", function(error, stdout) {
                        if (!error) {
                            var lines = stdout.toString().split('\n')
                            if (lines.length > 0) {
                                var line = lines[0].replace(/,/g, ".").replace(/M/g, "")
                                line = line.trim().split('  ')
                                for (var i = 0; i < line.length; i++) {
                                    if (line[i].toLowerCase().indexOf('total') != -1) result.swaptotal = parseFloat(line[i].split('=')[1].trim()) * 1024 * 1024
                                    if (line[i].toLowerCase().indexOf('used') != -1) result.swapused = parseFloat(line[i].split('=')[1].trim()) * 1024 * 1024
                                    if (line[i].toLowerCase().indexOf('free') != -1) result.swapfree = parseFloat(line[i].split('=')[1].trim()) * 1024 * 1024

                                }
                            }
                        }
                        if (callback) { callback(result) }
                        resolve(result)
                    })
                })
            }
        })
    })
}