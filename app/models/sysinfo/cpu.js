const os = require('os')
const exec = require('child_process').exec
const fs = require('fs')
const util = require('./util')

var _platform = os.type()

const _linux = (_platform == 'Linux')
const _darwin = (_platform == 'Darwin')
const _windows = (_platform == 'Windows_NT')
const NOT_SUPPORTED = 'OS not supported'

var _cpu_speed = '0.00'
var _current_cpu = {
    user: 0,
    nice: 0,
    system: 0,
    idle: 0,
    irq: 0,
    load: 0,
    tick: 0,
    ms: 0,
    currentload: 0,
    currentload_user: 0,
    currentload_nice: 0,
    currentload_system: 0,
    currentload_irq: 0
}
var _cpus = []
var _corecount = 0

function cpuBrandManufacturer(res) {
    res.brand = res.brand.replace(/\(R\)+/g, "®")
    res.brand = res.brand.replace(/\(TM\)+/g, "™")
    res.brand = res.brand.replace(/\(C\)+/g, "©")
    res.brand = res.brand.replace(/CPU+/g, "").trim()
    res.manufacturer = res.brand.split(' ')[0]

    var parts = res.brand.split(' ')
    parts.shift()
    res.brand = parts.join(' ')
    return res
}

// --------------------------
// CPU - brand, speed

function getCpu() {

    return new Promise((resolve) => {
        process.nextTick(() => {
            var result = {
                manufacturer: 'unknown',
                brand: 'unknown',
                speed: '0.00',
                cores: util.cores()
            }
            if (_darwin) {
                exec("sysctl -n machdep.cpu.brand_string", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        result.brand = lines[0].split('@')[0].trim()
                        result.speed = lines[0].split('@')[1].trim()
                        result.speed = parseFloat(result.speed.replace(/GHz+/g, ""))
                        _cpu_speed = result.speed
                    }
                    result = cpuBrandManufacturer(result)
                    resolve(result)
                })
            }
            if (_linux) {
                exec("cat /proc/cpuinfo | grep 'model name'", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        var line = lines[0].split(':')[1]
                        result.brand = line.split('@')[0].trim()
                        result.speed = line.split('@')[1] ? parseFloat(line.split('@')[1].trim()).toFixed(2) : '0.00'
                        if (result.speed == '0.00') {
                            var current = getCpuCurrentSpeedSync()
                            if (current != '0.00') result.speed = current
                        }
                        _cpu_speed = result.speed
                    }
                    result = cpuBrandManufacturer(result)
                    resolve(result)
                })
            }
            if (_windows) {
                exec("wmic cpu get name", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.split('\r\n').filter(line => line.trim() != '').filter((line, idx) => idx > 0)
                        var line = (lines && lines[0]) ? lines[0] : ''
                        result.brand = line.split('@')[0].trim()
                        result.speed = line.split('@')[1].trim()
                        result.speed = parseFloat(result.speed.replace(/GHz+/g, ""))
                        _cpu_speed = result.speed
                    }
                    result = cpuBrandManufacturer(result)
                    resolve(result)
                })
            }
        })
    })
}

function cpu(callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            getCpu().then(result => {
                if (callback) { callback(result) }
                resolve(result)
            })
        })
    })
}

exports.cpu = cpu

function getCpuCurrentSpeedSync() {

    var cpus = os.cpus()
    var minFreq = 999999999
    var maxFreq = 0
    var avgFreq = 0

    if (cpus.length) {
        for (var i in cpus) {
            if (cpus.hasOwnProperty(i)) {
                avgFreq = avgFreq + cpus[i].speed
                if (cpus[i].speed > maxFreq) maxFreq = cpus[i].speed
                if (cpus[i].speed < minFreq) minFreq = cpus[i].speed
            }
        }
        avgFreq = avgFreq / cpus.length
        return {
            min: parseFloat((minFreq / 1000).toFixed(2)),
            max: parseFloat((maxFreq / 1000).toFixed(2)),
            avg: parseFloat((avgFreq / 1000).toFixed(2))
        }
    } else {
        return {
            min: 0,
            max: 0,
            avg: 0
        }
    }
}

function cpuCurrentspeed(callback) {

    return new Promise((resolve) => {
        process.nextTick(() => {
            var result = getCpuCurrentSpeedSync()
            if (result == 0 && _cpu_speed != '0.00') result = parseFloat(_cpu_speed)

            if (callback) { callback(result) }
            resolve(result)
        })
    })
}

exports.cpuCurrentspeed = cpuCurrentspeed

function cpuTemperature(callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var result = {
                main: -1.0,
                cores: [],
                max: -1.0
            }
            if (_linux) {
                exec("sensors", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        lines.forEach(function(line) {
                            var regex = /\+([^°]*)/g
                            var temps = line.match(regex)
                            if (line.split(':')[0].toUpperCase().indexOf('PHYSICAL') != -1) {
                                result.main = parseFloat(temps)
                            }
                            if (line.split(':')[0].toUpperCase().indexOf('CORE ') != -1) {
                                result.cores.push(parseFloat(temps))
                            }
                        })
                        if (result.cores.length > 0) {
                            var maxtmp = Math.max.apply(Math, result.cores)
                            result.max = (maxtmp > result.main) ? maxtmp : result.main
                        }
                        if (callback) { callback(result) }
                        resolve(result)
                    } else {
                        fs.stat('/sys/class/thermal/thermal_zone0/temp', function(err, stat) {
                            if (err == null) {
                                exec("cat /sys/class/thermal/thermal_zone0/temp", function(error, stdout) {
                                    if (!error) {
                                        var lines = stdout.toString().split('\n')
                                        if (lines.length > 0) {
                                            result.main = parseFloat(lines[0]) / 1000.0
                                            result.max = result.main
                                        }
                                    }
                                    if (callback) { callback(result) }
                                    resolve(result)
                                })
                            } else {
                                exec("/opt/vc/bin/vcgencmd measure_temp", function(error, stdout) {
                                    if (!error) {
                                        var lines = stdout.toString().split('\n')
                                        if (lines.length > 0 && lines[0].indexOf('=')) {
                                            result.main = parseFloat(lines[0].split("=")[1])
                                            result.max = result.main
                                        }
                                    }
                                    if (callback) { callback(result) }
                                    resolve(result)
                                })
                            }
                        })

                    }
                })
            }
            if (_darwin) {
                var smc = require('../build/Release/smc')

                var cores = ['TC0P', 'TC1C', 'TC2C', 'TC3C', 'TC4C', 'TC5C', 'TC6C', 'TC7C', 'TC8C']
                var sum = 0
                var id = 0
                cores.forEach(function(key) {
                    var value = smc.get(key)
                    if (id == 0) {
                        if (value > 0) {
                            result.main = value
                            result.max = value
                        }
                        id = 1
                    } else {
                        if (value > 0) {
                            result.cores.push(value)
                            sum = sum + value
                            if (value > result.max) result.max = value
                        }
                    }
                })
                if (result.cores.length) {
                    result.main = sum / result.cores.length
                }

                if (callback) { callback(result) }
                resolve(result)
            }
            if (_windows) {
                exec("wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CriticalTripPoint,CurrentTemperature /value", function(error, stdout) {
                    if (!error) {
                        var sum = 0
                        var lines = stdout.trim().split(/\s\s+/)
                        lines.forEach(function(line) {
                            if (line.match('CriticalTripPoint') && !result.max)
                                result.max = (parseInt(line.split('CriticalTripPoint=')[1]) - 2732) / 10
                            else if (line.match('CurrentTemperature')) {
                                var value = (parseInt(line.split('CurrentTemperature=')[1]) - 2732) / 10
                                sum = sum + value
                                result.cores.push(value)
                            }
                        })
                        if (result.cores.length) {
                            result.main = sum / result.cores.length
                        }
                        if (callback) { callback(result) }
                        resolve(result)
                    }
                })
            }
        })
    })
}

exports.cpuTemperature = cpuTemperature

function cpuFlags(callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            if (_windows) {
                var error = new Error(NOT_SUPPORTED)
                if (callback) { callback(NOT_SUPPORTED) }
                reject(error)
            }

            var result = ''
            if (_linux) {
                exec("lscpu", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        lines.forEach(function(line) {
                            if (line.split(':')[0].toUpperCase().indexOf('FLAGS') != -1) {
                                result = line.split(':')[1].trim().toLowerCase()
                            }
                        })
                    }
                    if (callback) { callback(result) }
                    resolve(result)
                })
            }
            if (_darwin) {
                exec("sysctl machdep.cpu.features", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        if (lines.length > 0 && lines[0].indexOf('machdep.cpu.features:') != -1) {
                            result = lines[0].split(':')[1].trim().toLowerCase()
                        }
                    }
                    if (callback) { callback(result) }
                    resolve(result)
                })
            }
        })
    })
}

exports.cpuFlags = cpuFlags

function cpuCache(callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            if (_windows) {
                var error = new Error(NOT_SUPPORTED)
                if (callback) { callback(NOT_SUPPORTED) }
                reject(error)
            }

            var result = {}
            if (_linux) {
                exec("lscpu", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        lines.forEach(function(line) {
                            var parts = line.split(':')
                            if (parts[0].toUpperCase().indexOf('L1D CACHE') != -1) {
                                result.l1d = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                            if (parts[0].toUpperCase().indexOf('L1I CACHE') != -1) {
                                result.l1i = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                            if (parts[0].toUpperCase().indexOf('L2 CACHE') != -1) {
                                result.l2 = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                            if (parts[0].toUpperCase().indexOf('L3 CACHE') != -1) {
                                result.l3 = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                        })
                    }
                    if (callback) { callback(result) }
                    resolve(result)
                })
            }
            if (_darwin) {
                exec("sysctl hw.l1icachesize hw.l1dcachesize hw.l2cachesize hw.l3cachesize", function(error, stdout) {
                    if (!error) {
                        var lines = stdout.toString().split('\n')
                        lines.forEach(function(line) {
                            var parts = line.split(':')
                            if (parts[0].toLowerCase().indexOf('hw.l1icachesize') != -1) {
                                result.l1d = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                            if (parts[0].toLowerCase().indexOf('hw.l1dcachesize') != -1) {
                                result.l1i = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                            if (parts[0].toLowerCase().indexOf('hw.l2cachesize') != -1) {
                                result.l2 = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                            if (parts[0].toLowerCase().indexOf('hw.l3cachesize') != -1) {
                                result.l3 = parseInt(parts[1].trim()) * (parts[1].indexOf('K') != -1 ? 1024 : 1)
                            }
                        })
                    }
                    if (callback) { callback(result) }
                    resolve(result)
                })
            }
        })
    })
}

exports.cpuCache = cpuCache

function getLoad() {

    return new Promise((resolve) => {
        process.nextTick(() => {
            var loads = os.loadavg().map(function(x) { return x / util.cores() })
            var avgload = parseFloat((Math.max.apply(Math, loads)).toFixed(2))
            var result = {}

            var now = Date.now() - _current_cpu.ms
            if (now >= 200) {
                _current_cpu.ms = Date.now()
                const cpus = os.cpus()
                var totalUser = 0
                var totalSystem = 0
                var totalNice = 0
                var totalIrq = 0
                var totalIdle = 0
                var cores = []
                _corecount = cpus.length

                for (var i = 0; i < _corecount; i++) {
                    const cpu = cpus[i].times
                    totalUser += cpu.user
                    totalSystem += cpu.sys
                    totalNice += cpu.nice
                    totalIrq += cpu.irq
                    totalIdle += cpu.idle
                    var tmp_tick = (_cpus && _cpus[i] && _cpus[i].totalTick ? _cpus[i].totalTick : 0)
                    var tmp_load = (_cpus && _cpus[i] && _cpus[i].totalLoad ? _cpus[i].totalLoad : 0)
                    var tmp_user = (_cpus && _cpus[i] && _cpus[i].user ? _cpus[i].user : 0)
                    var tmp_system = (_cpus && _cpus[i] && _cpus[i].sys ? _cpus[i].sys : 0)
                    var tmp_nice = (_cpus && _cpus[i] && _cpus[i].nice ? _cpus[i].nice : 0)
                    var tmp_irq = (_cpus && _cpus[i] && _cpus[i].irq ? _cpus[i].irq : 0)
                    _cpus[i] = cpu
                    _cpus[i].totalTick = _cpus[i].user + _cpus[i].sys + _cpus[i].nice + _cpus[i].irq + _cpus[i].idle
                    _cpus[i].totalLoad = _cpus[i].user + _cpus[i].sys + _cpus[i].nice + _cpus[i].irq
                    _cpus[i].currentTick = _cpus[i].totalTick - tmp_tick
                    _cpus[i].load = (_cpus[i].totalLoad - tmp_load) / _cpus[i].currentTick * 100
                    _cpus[i].load_user = (_cpus[i].user - tmp_user) / _cpus[i].currentTick * 100
                    _cpus[i].load_system = (_cpus[i].sys - tmp_system) / _cpus[i].currentTick * 100
                    _cpus[i].load_nice = (_cpus[i].nice - tmp_nice) / _cpus[i].currentTick * 100
                    _cpus[i].load_irq = (_cpus[i].irq - tmp_irq) / _cpus[i].currentTick * 100
                    cores[i] = {}
                    cores[i].load = _cpus[i].load
                    cores[i].load_user = _cpus[i].load_user
                    cores[i].load_system = _cpus[i].load_system
                    cores[i].load_nice = _cpus[i].load_nice
                    cores[i].load_irq = _cpus[i].load_irq
                }
                var totalTick = totalUser + totalSystem + totalNice + totalIrq + totalIdle
                var totalLoad = totalUser + totalSystem + totalNice + totalIrq
                var currentTick = totalTick - _current_cpu.tick
                result = {
                    avgload: avgload,
                    currentload: (totalLoad - _current_cpu.load) / currentTick * 100,
                    currentload_user: (totalUser - _current_cpu.user) / currentTick * 100,
                    currentload_system: (totalSystem - _current_cpu.system) / currentTick * 100,
                    currentload_nice: (totalNice - _current_cpu.nice) / currentTick * 100,
                    currentload_irq: (totalIrq - _current_cpu.irq) / currentTick * 100,
                    cpus: cores
                }
                _current_cpu = {
                    user: totalUser,
                    nice: totalNice,
                    system: totalSystem,
                    idle: totalIdle,
                    irq: totalIrq,
                    tick: totalTick,
                    load: totalLoad,
                    ms: _current_cpu.ms,
                    currentload: result.currentload,
                    currentload_user: result.currentload_user,
                    currentload_system: result.currentload_system,
                    currentload_nice: result.currentload_nice,
                    currentload_irq: result.currentload_irq,
                }
            } else {
                var cores = []
                for (var i = 0; i < _corecount; i++) {
                    cores[i] = {}
                    cores[i].load = _cpus[i].load
                    cores[i].load_user = _cpus[i].load_user
                    cores[i].load_system = _cpus[i].load_system
                    cores[i].load_nice = _cpus[i].load_nice
                    cores[i].load_irq = _cpus[i].load_irq
                }
                result = {
                    avgload: avgload,
                    currentload: _current_cpu.currentload,
                    currentload_user: _current_cpu.currentload_user,
                    currentload_system: _current_cpu.currentload_system,
                    currentload_nice: _current_cpu.currentload_nice,
                    currentload_irq: _current_cpu.currentload_irq,
                    cpus: cores
                }
            }
            resolve(result)
        })
    })
}

function currentLoad(callback) {

    return new Promise((resolve) => {
        process.nextTick(() => {
            getLoad().then(result => {
                if (callback) { callback(result) }
                resolve(result)
            })
        })
    })
}

exports.currentLoad = currentLoad

function getFullLoad() {

    return new Promise((resolve) => {
        process.nextTick(() => {

            const cpus = os.cpus()
            var totalUser = 0
            var totalSystem = 0
            var totalNice = 0
            var totalIrq = 0
            var totalIdle = 0

            for (var i = 0, len = cpus.length; i < len; i++) {
                const cpu = cpus[i].times
                totalUser += cpu.user
                totalSystem += cpu.sys
                totalNice += cpu.nice
                totalIrq += cpu.irq
                totalIdle += cpu.idle
            }
            var totalTicks = totalIdle + totalIrq + totalNice + totalSystem + totalUser
            var result = (totalTicks - totalIdle) / totalTicks * 100.0

            resolve(result)
        })
    })
}

function fullLoad(callback) {

    return new Promise((resolve) => {
        process.nextTick(() => {
            getFullLoad().then(result => {
                if (callback) { callback(result) }
                resolve(result)
            })
        })
    })
}

exports.fullLoad = fullLoad