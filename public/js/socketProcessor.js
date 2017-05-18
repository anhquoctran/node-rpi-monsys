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

        socket.emit("kill", arr)
    });

    socket.on("overload", function(data) {

    })

    socket.on("freq", function(data) {
        _cpuFreq.text(readableSpeed(data.toString()))
    })

    socket.on("cpu", function(data) {
        _cpuPercent.text(data[1] + " %")
    })

    function readableSpeed(speed) {
        speed = Math.round(parseFloat(speed))
        if (speed < 1000) {
            return (speed + " MHz")
        } else {
            return ((speed / 1000) + " GHz")
        }
    }
    var data = []
    var chart = new Highcharts.chart("cpu-usage-chart", {
        chart: {
            type: 'spline',
            events: {
                load: function() {
                    socket.on("cpu", function(cpu) {
                        console.log(cpu)
                        var series = chart.series[0]
                        series.addPoint(cpu)
                    })
                }
            },
            animation: Highcharts.svg
        },
        title: {
            text: 'CPU Percentage (%)'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            min: 0,
            max: 50
        },
        yAxis: {
            title: {
                text: 'Percentage (%)'
            }
        },
        legend: {
            enabled: false
        },
        scrollbar: {
            enabled: true
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
            name: 'Percent',
            data: []
        }]
    })

    var memoryChart = new Highcharts.chart("memory-usage-chart", {
        chart: {
            zoomType: 'x',
            events: {
                load: function() {
                    socket.on("memory", function(memory) {
                        console.log(memory)
                        var series = memoryChart.series[0]
                        series.addPoint(memory)
                    })
                }
            }
        },
        title: {
            text: 'Memory Usage'
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
                text: 'Memory Percentage (%)'
            }
        },
        scrollbar: {
            enabled: true
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
            data: []
        }]
    })

    var iochart = new Highcharts.chart("iochart", {
        colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
            '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
        ],
        chart: {
            type: 'spline',
            events: {
                load: function() {
                    socket.on("cpu", function(cpu) {
                        console.log(cpu)
                        var series = chart.series[0]
                        series.addPoint(cpu)
                    })
                }
            },
            animation: Highcharts.svg
        },
        title: {
            text: 'Disk Transfer Rate (KB/s)'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            min: 0,
            max: 50,
            labels: {
                style: {
                    color: '#6e6e70'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Transfer rate (KB/s)'
            }
        },
        legend: {
            enabled: false
        },
        scrollbar: {
            enabled: true
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
                candlestick: {
                    lineColor: '#404048'
                },
                series: {
                    shadow: true
                },
                angeSelector: {
                    buttonTheme: {
                        fill: 'white',
                        stroke: '#C0C0C8',
                        'stroke-width': 1,
                        states: {
                            select: {
                                fill: '#D0D0D8'
                            }
                        }
                    }
                },
                threshold: null
            }
        },
        series: [{
            name: 'KB/s',
            data: []
        }]
    })

    socket.on('logical', function(logical) {

    })

    socket.on("memory", function(memory) {
        $("#memPercent").text(memory[1] + " %")
    })

    socket.on("disk", function(disk) {
        $("#io").text(parseFloat(disk) + " KB/s")
    })

    socket.on("processes", function(processes) {
        console.log(processes)
    })

    socket.on("network", function(network) {

    })

    socket.on("gpio", function(gpio) {

    })

})