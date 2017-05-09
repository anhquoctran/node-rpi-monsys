const os = require('os'),
    fs = require('fs');

const util = require('./util');
const system = require('./system');
const osInfo = require('./osinfo');
const cpu = require('./cpu');
const mem = require('./memory');
const filesystem = require('./filesystem');
const network = require('./network');
const processes = require('./processes');
const users = require('./users');
const internet = require('./internet');
const docker = require('./dock');

var _platform = os.type();
var _windows = (_platform == 'Windows_NT');

const NOT_SUPPORTED = 'not supported';

function getStaticData(callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            if (_windows) {
                var error = new Error(NOT_SUPPORTED);
                if (callback) { callback(NOT_SUPPORTED) }
                reject(error);
            }

            var data = {};

            data.version = version();
            Promise.all([
                    system(), osInfo.osInfo(), osInfo.versions(), cpu.cpu(), network.networkInterfaces()
                ])
                .then(result => {
                    data.system = result[0]
                    data.os = result[1]
                    data.versions = result[2]
                    data.cpu = result[3]
                    data.net = result[4]
                    resolve(data)
                })
                .catch(error => reject(error))
        })
    })
}

function getDynamicData(srv, iface, callback) {

    if (util.isFunction(iface)) {
        callback = iface
        iface = ''
    }
    if (util.isFunction(srv)) {
        callback = srv
        srv = ''
    }

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            if (_windows) {
                var error = new Error(NOT_SUPPORTED);
                if (callback) { callback(NOT_SUPPORTED) }
                reject(error);
            }

            iface = iface || network.getDefaultNetworkInterface();
            srv = srv || '';

            // use closure to track ƒ compvarion
            var functionProcessed = (function() {
                var totalFunctions = 14;

                return function() {
                    if (--totalFunctions === 0) {
                        if (callback) { callback(data) }
                        resolve(data);
                    }
                };
            })();

            // var totalFunctions = 14;
            // function functionProcessed() {
            //   if (--totalFunctions === 0) {
            //     if (callback) { callback(data) }
            //     resolve(data);
            //   }
            // }

            var data = {};

            // get time
            data.time = osInfo.time();

            /**
             * @namespace
             * @property {Object}  versions
             * @property {string}  versions.node
             * @property {string}  versions.v8
             */
            data.node = process.versions.node;
            data.v8 = process.versions.v8;

            cpu.cpuCurrentspeed().then(res => {
                data.cpuCurrentspeed = res;
                functionProcessed();
            });

            users.users().then(res => {
                data.users = res;
                functionProcessed();
            });

            processes.processes().then(res => {
                data.processes = res;
                functionProcessed();
            });

            cpu.currentLoad().then(res => {
                data.currentLoad = res;
                functionProcessed();
            });

            cpu.cpuTemperature().then(res => {
                data.temp = res;
                functionProcessed();
            });

            network.networkStats(iface).then(res => {
                data.networkStats = res;
                functionProcessed();
            });

            network.networkConnections().then(res => {
                data.networkConnections = res;
                functionProcessed();
            });

            mem().then(res => {
                data.mem = res;
                functionProcessed();
            });

            processes.services(srv).then(res => {
                data.services = res;
                functionProcessed();
            });

            filesystem.fsSize().then(res => {
                data.fsSize = res;
                functionProcessed();
            });

            filesystem.fsStats().then(res => {
                data.fsStats = res;
                functionProcessed();
            });

            filesystem.disksIO().then(res => {
                data.disksIO = res;
                functionProcessed();
            });

            internet.inetLatency().then(res => {
                data.inetLatency = res;
                functionProcessed();
            });
        });
    });
}

function getAllData(srv, iface, callback) {

    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            if (_windows) {
                var error = new Error(NOT_SUPPORTED);
                if (callback) { callback(NOT_SUPPORTED) }
                reject(error);
            }

            var data = {};
            Promse.all([
                getStaticData(), getDynamicData(srv, iface)
            ])
            then(res => {
                data = res
                for (var key in res) {
                    if (res.hasOwnProperty(key)) {
                        data[key] = res[key]
                    }
                }
                if (callback) { callback(data) }
                resolve(data)
            })
        });
    });
}

exports.system = system;
exports.time = osInfo.time;
exports.osInfo = osInfo.osInfo;
exports.versions = osInfo.versions;
exports.shell = osInfo.shell;
exports.cpu = cpu.cpu;
exports.cpuFlags = cpu.cpuFlags;
exports.cpuCache = cpu.cpuCache;
exports.cpuCurrentspeed = cpu.cpuCurrentspeed;
exports.cpuTemperature = cpu.cpuTemperature;
exports.currentLoad = cpu.currentLoad;
exports.fullLoad = cpu.fullLoad;
exports.mem = mem;
exports.fsSize = filesystem.fsSize;
exports.blockDevices = filesystem.blockDevices;
exports.fsStats = filesystem.fsStats;
exports.disksIO = filesystem.disksIO;
exports.networkInterfaceDefault = network.networkInterfaceDefault;
exports.networkInterfaces = network.networkInterfaces;
exports.networkStats = network.networkStats;
exports.networkConnections = network.networkConnections;
exports.services = processes.services;
exports.processes = processes.processes;
exports.processLoad = processes.processLoad;
exports.users = users.users;
exports.inetChecksite = internet.inetChecksite;
exports.inetLatency = internet.inetLatency;
exports.dockerContainers = docker.dockerContainers;
exports.dockerContainerStats = docker.dockerContainerStats;
exports.dockerContainerProcesses = docker.dockerContainerProcesses;
exports.dockerAll = docker.dockerAll;
exports.getStaticData = getStaticData;
exports.getDynamicData = getDynamicData;
exports.getAllData = getAllData;