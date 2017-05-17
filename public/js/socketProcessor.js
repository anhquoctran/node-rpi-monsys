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

    socket.on("test", function(data) {
        console.log(data)
    })

    var arr
    $('.end').click(function() {
        arr = $('#table-rpi').find('[type="checkbox"]:checked').map(function() {
            return $(this).closest('tr').find('td:nth-child(2)').text();
        }).get();

        socket.emit("processes", arr)
    });

    socket.on("overload", function(data) {
        console.log(data)
    })

    socket.on("freq", function(data) {
        _cpuFreq.text(data)
    })

    socket.on("cpu", function(data) {
        _cpuPercent.text(readableSpeed(data.toString()))
    })

    function readableSpeed(speed) {
        speed = Math.round(parseFloat(speed))
        if (speed < 1000) {
            return (speed + " MHz")
        } else {
            return ((speed / 1000) + " GHz")
        }
    }

    Highcharts.chart("cpu-usage-chart", {
        chart: {
            zoomType: 'x'
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
            name: 'Utilize',
            data: (function() {
                socket.on("cpu", function(cpu) {
                    console.log(cpu)
                    data = []
                    data.push(cpu)

                })
            })
        }]
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
        console.log(network)
    })

    socket.on("gpio", function(gpio) {

    })

})