$(document).ready( function () {
    // set up our data series with 150 random data points

    var seriesKeys = ['udr', 'rsync', 'udt'];

    var seriesData = {'udr': [], 'rsync': [], 'udt': []};

    var cachedData = {'udr': [], 'rsync': [], 'udt': []};

    var palette = new Rickshaw.Color.Palette( { scheme: 'spectrum14' } );

    // instantiate our graph!

    var graph = new Rickshaw.Graph( {
        element: document.getElementById("chart"),
        width: 900,
        height: 500,
        renderer: 'area',
        stroke: true,
        preserve: true,
        series: [
            {
                color: palette.color(),
                data: seriesData[seriesKeys[0]],
                name: seriesKeys[0].toUpperCase()
            }, {
                color: palette.color(),
                data: seriesData[seriesKeys[1]],
                name: seriesKeys[1].toUpperCase()
            }, {
                color: palette.color(),
                data: seriesData[seriesKeys[2]],
                name: seriesKeys[2].toUpperCase()
            },
        ]
    } );

    graph.render();

    var slider = new Rickshaw.Graph.RangeSlider( {
        graph: graph,
        element: $('#slider')
    } );

    // var hoverDetail = new Rickshaw.Graph.HoverDetail( {
    //     graph: graph,
    //     xFormatter: function(x) {
    //         return new Date(x * 1000).toString();
    //     }
    // } );

    // var annotator = new Rickshaw.Graph.Annotate( {
    //     graph: graph,
    //     element: document.getElementById('timeline')
    // } );

    var legend = new Rickshaw.Graph.Legend( {
        graph: graph,
        element: document.getElementById('legend')
    } );

    var reset = document.createElement('button');
    reset.className = 'reset_button';
    var reset_container = $(legend.element).find('div').get(1);
    reset_container.appendChild(reset);
    $('#legend .reset_button').on('click', function () {
        seriesKeys.forEach(function (name) {
            seriesCache[name] = [];
            seriesData[name] = [];
        })
    })

    var buttons = $("#legend .series_button");

    buttons.on('click', function on_click (event) {
        buttons.off();
        buttons.classList.add('clicked');
        var series_key = event.target.innerText.toLowerCase();
        var series = seriesCache[series_key];
        var get_chunk = 0;
        function get_data (time) {
            $.getJSON('stream/params?comm=' + text + 'chunk=' + get_chunk, function (data) {
                if (!data.finished) {
                    if (!data.waiting) {
                        data.x = time;
                        if (series[get_chunk]) {
                            var last = series[get_chunk].length - 1;
                            series[get_chunk][last] = data;
                            seriesData[series_key] = data;
                        }
                        else {
                            seriesKeys.forEach(function (name) {
                                if (name == series_key) {
                                    var new_data = series[get_chunk - 1].push(data);
                                    series[get_chunk] = new_data;
                                    seriesData[name] = new_data
                                }
                                else {
                                    var other_series = seriesCache[name];
                                    var last_data = other_series[get_chunk - 1]
                                    var last = last_data.length - 1;
                                    var last_x = other_series[get_chunk - 1][last].x;
                                    var new_datum = {};
                                    new_datum.x = last_x;
                                    new_datum.y = null;
                                    var new_data =  other_series[get_chunk - 1].push(new_datum);
                                    other_series[get_chunk] = new_data;
                                    seriesData[name] = new_data;
                                }
                            })
                        }
                        graph.update();
                        get_chunk += 1;
                        time  = time + 1;
                    }
                    setTimeout(function () { get_data(next_time); }, 1000);
                }
                else {
                    buttons.classList.remove('clicked');
                    buttons.on('click', on_click);
                }
            });
        }
        $.post('stream/params?comm=' + text, function (time) {
            setTimeout(function () { get_data(time); } , 1000)
        });
    })
//    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
    //     graph: graph,
    //     legend: legend
    // } );

    // var order = new Rickshaw.Graph.Behavior.Series.Order( {
    //     graph: graph,
    //     legend: legend
    // } );

    // var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
    //     graph: graph,
    //     legend: legend
    // } );


    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.Time( {
        graph: graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
    } );

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
    } );

    //     legend: legend
    // } );


    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.Time( {
        graph: graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
    } );

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
    } );

    yAxis.render();

    var controls = new RenderControls( {
        element: document.querySelector('form'),
        graph: graph
    } );

    // add some data every so often
