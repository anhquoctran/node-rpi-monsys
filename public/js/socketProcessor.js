"use strict"

$(document).ready(function() {
    var socket = io.connect()
    var _cpuAdmin = $("#cpu-usage-chart"),
        _cpuFreq = $("#cpu-freq"),
        _cpuPercent = $("#cpu-percent"),
        _diskIo = $("#diskIoChart"),
        _killprocBtn = $("#killprocBtn")

    socket.on("connected", function(message) {
        console.log(message)
    })

    var arr
    $('.end').click(function() {
        arr = $('#table-rpi').find('[type="checkbox"]:checked').map(function() {
            return $(this).closest('tr').find('td:nth-child(2)').text();
        }).get();

        socket.emit("processes", arr)
    });

    socket.on("overload", function(data) {

    })

    socket.on("freq", function(data) {
        _cpuFreq.text(readableSpeed(data.toString()))
    })

    socket.on("cpu", function(data) {
        _cpuPercent.text(data + " %")
    })

    function readableSpeed(speed) {
        speed = Math.round(parseFloat(speed))
        if (speed < 1000) {
            return (speed + " MHz")
        } else {
            return ((speed / 1000) + " GHz")
        }
    }

    socket.on("cpu", function(cpu) {
        var data = []
        data.push(cpu)
        console.log(data)
        Highcharts.chart("cpu-usage-chart", {
            chart: {
                zoomType: 'x',
                events: {
                    load: function() {
                        chart = this

                    }
                }
            },
            title: {
                text: 'CPU Percentage (%)'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Percentage (%)'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: 'Percent',
                data: data
            }]
        })
    })

    socket.on('logical', function(logical) {

    })

    socket.on("memory", function(memory) {
        $("#memPercent").text(memory + " %")
    })

    socket.on("disk", function(disk) {
        console.log(disk)
    })

    socket.on("processes", function(processes) {
        console.log(processes)
    })

    socket.on("network", function(network) {

    })

    socket.on("gpio", function(gpio) {

    })

})