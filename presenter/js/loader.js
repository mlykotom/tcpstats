/**
 * @author Tomas Mlynaric
 */

var options = {
    global: {
        useUTC: false
    },

    title: {
        text: ''
    },

    xAxis: {
        type: 'datetime',
        units: [
            [
                'millisecond',
                [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
            ]
        ],

        dateTimeLabelFormats: {
            millisecond: '%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '',
            day: '',
            week: '',
            month: '',
            year: ''
        }
    },
    yAxis: {
        //title: {
        //    text: 'Temperature (°C)'
        //},
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    }
};


$.getJSON('./log/log.json', function (json) {
    options.tooltip = {
        valueSuffix: ' B'
    };

    options.series = [
        {
            name: 'sender window',
            data: json.client.windows
        },
        {
            name: 'receiver window',
            data: json.server.windows
        }
    ];

    $('#graph_windows').highcharts(options);

    var speed_options = jQuery.extend(true, {}, options);
    speed_options.series = [
        {
            name: 'server->client',
            data: json.server.speed
        },
        {
            name: 'client->server',
            data: json.client.speed
        }
    ];

    $('#graph_speed').highcharts(speed_options);


    var rtt_options = jQuery.extend(true, {}, options);

    rtt_options.tooltip = {
        valueSuffix: ' ms',
        valueDecimals: 6 // TODO pryc
    };

    var srv_cli = [];
    var srv_cli_data = [];
    $.each(json.server.roundtrip, function () {
        if (this.replied == 0) return;

        srv_cli.push(this.seq);
        srv_cli_data.push(this.time);
    });

    rtt_options.xAxis = {
        categories: srv_cli
    };

    rtt_options.yAxis = {
        title: {
            text: 'Roundtrip time [ms]'
        },
        labels: {
            format: '{value:.2f}'
        }
    };

    rtt_options.series = [
        {
            name: 'roundtrip server->client',
            data: srv_cli_data
        }
    ];

    $('#graph_rtt').highcharts(rtt_options);

    var rtt2_options = jQuery.extend(true, {}, rtt_options);
    var cli_srv = [];
    var cli_srv_data = [];
    $.each(json.client.roundtrip, function () {
        if (this.replied == 0) return;

        cli_srv.push(this.seq);
        cli_srv_data.push(this.time);
    });

    rtt2_options.xAxis = {
        categories: cli_srv
    };

    rtt2_options.series = [
        {
            name: 'roundtrip client->server',
            data: cli_srv_data
        }
    ];

    $('#graph_rtt2').highcharts(rtt2_options);


    var seq_options = jQuery.extend(true, {}, options);
    seq_options.series = [
        {
            name: 'server->client',
            data: json.server.speed
        }
    ];


    $('#graph_seq').highcharts(seq_options);
});