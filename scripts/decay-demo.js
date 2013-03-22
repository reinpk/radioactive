function renderRadioactivityPlot (container, series, units) {
    var chart = new Highcharts.Chart({
            
        chart: {
            renderTo: container
        },

        credits : {
            enabled: false
        },
        
        title: {
            text: ''
        },

        legend : {
            enabled: false
        },
        
        xAxis: {
            title: {
                enabled: true,
                text: 'Years',
                style : {
                    color : '#57534a'
                }
            },
            type: 'logarithmic',
            tickInterval: 1
        },
        
        yAxis: {
            title: {
                text: 'Radioactivity ('+units+')',
                style : {
                    color : '#57534a'
                }
            },
            type: 'logarithmic',
            minorTickInterval: 1,
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            min: 100000
        },

        plotOptions: {
            line : {
                marker : {
                    enabled: false
                },
                lineWidth: 3
            },
            series : {
                shadow: false
            }
        },
        
        tooltip: {
            formatter    : function () {
                console.log(this.point);
                var x = numberFormat(this.point.x);
                var y = numberFormat(this.point.y, 'Bq');
                return ('<b>'+this.series.name+'</b><br />' + y + ' after ' + x + ' years');
            }
        },
        
        series: series
    });   
}

function numberFormat (number, unit) {
    var num = Math.abs(number);
    if (num > 1000000000000000)
        return ( Highcharts.numberFormat((number/1000000000000000), 0) + (unit ? ' E'+unit : 'Q'));
    else if (num > 1000000000000)
        return ( Highcharts.numberFormat((number/1000000000000), 0) + (unit ? ' P'+unit : 'T'));
    else if (num > 1000000000)
        return ( Highcharts.numberFormat((number/1000000000), 0) + (unit ? ' G'+unit : 'B'));
    else if (num > 1000000)
        return ( Highcharts.numberFormat((number/1000000), 0) + (unit ? ' M'+unit : 'M'));
    else if (num > 1000)
        return ( Highcharts.numberFormat((number/1000), 0) + (unit ? ' K'+unit : 'K'));
    else if (num < 1000)
        return Highcharts.numberFormat(number, 0);

}

function massOfCharge (charge) {
    return _.reduce(_.keys(charge), function (memo, isotopeName) {
        return (memo + charge[isotopeName]);
    }, 0);
}

function generateRadioactivityTimeSeries (charge) {
    var backgroundSoilRadiation = radioactive.decay.radiationLevels.soil * massOfCharge(charge);
    var backgroundCutoff = backgroundSoilRadiation / 500;

    var radioactivity = radioactive.decay.radioactivity(charge);

    var data = [];
    var tpow = 0;
    var lastTotal = backgroundCutoff * 2;
    while (lastTotal > backgroundCutoff) {
        var t = Math.pow(10, tpow);
        for (var mult = 1; mult < 10; mult+=2) {
            var profile = radioactivity(mult*t);
            data.push([ mult*t, profile.total ]);
        }

        lastTotal = _.last(data)[1];
        tpow++;
    }
    data = _.filter(data, function (datum) {
        return (datum[1] >= backgroundCutoff);
    });

    return data;
}

function generateBackgroundRadioactivityTimeSeries (mass, years) {
    var backgroundSoilRadiation = radioactive.decay.radiationLevels.soil * mass;

    var data = [];
    var tpow = 0;
    var t = Math.pow(10, tpow);
    while (t < years) {
        t = Math.pow(10, tpow);
        for (var mult = 1; mult < 10; mult+=2) {
            data.push([ mult*t, backgroundSoilRadiation ]);
        }
        tpow++;
    }

    return data;
}




$(function () {

    // Basic Datasets
    // --------------

    var naturalSoil = {
        name  : 'Natural Soil',
        data  : generateBackgroundRadioactivityTimeSeries(1000, 10000000000),
        color : '#AAA',
        dashStyle: 'Dot'
    };
    var uranium238 = {
        name  : 'Uranium-238',
        data  : generateRadioactivityTimeSeries({
            'U-238'  : 1000.0 // kilograms
        }),
        color : '#427e80'
    };
    var cesium134 = {
        name  : 'Cesium-134',
        data  : generateRadioactivityTimeSeries({
            'Cs-134' : 10.0 // kilograms
        }),
        color : '#e14e0c'
    };
    var plutonium239 = {
        name  : 'Plutonium-239',
        data  : generateRadioactivityTimeSeries({
            'Pu-239'  : 348.0 // kilograms
        }),
        color : '#a0586c'
    };

    // Real Reactor Profiles
    // ---------------------

    var E = function (exp) {
        return Math.pow(10, exp);
    };

    var pressurizedWaterReactor = {
        name  : 'Pressurized Water Reactor',
        data  : generateRadioactivityTimeSeries({
            // units are kg/MTU initial * 15 tons/year / 1.344 GWe
            // so end units are kg/GWe/year
            'Am-241' : 1.400*E(-1) * 15 / 1.344,
            'Cm-242' : 1.190*E(-2) * 15 / 1.344,
            'Cm-244' : 1.650*E(-2) * 15 / 1.344,
            'Cs-134' : 9.540*E(-2) * 15 / 1.344,
            'Cs-137' : 1.000*E(0) * 15 / 1.344,
            'Eu-154' : 1.970*E(-2) * 15 / 1.344,
            'Pu-238' : 1.060*E(-1) * 15 / 1.344,
            'Pu-239' : 5.080*E(0) * 15 / 1.344,
            'Pu-240' : 2.040*E(0) * 15 / 1.344,
            'Pu-241' : 1.110*E(0) * 15 / 1.344,
            'Pu-242' : 3.660*E(-1) * 15 / 1.344,
            'U-235'  : 1.010*E(1) * 15 / 1.344,
            'U-236'  : 4.050*E(0) * 15 / 1.344,
            'U-238'  : 9.480*E(2) * 15 / 1.344
        }),
        color  : '#211f18',
        source : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Obrigheim&cell=BE124&pin=G7&axis=2315'
    };

    var boilingWaterReactor = {
        name  : 'Boiling Water Reactor',
        data  : generateRadioactivityTimeSeries({
            // units are kg/MTU initial * 15 tons/year / 1.344 GWe
            // so end units are kg/year/GWe
            'Am-241' : 6.630*E(-1) * 15 / 1.344,
            'Cm-242' : 1.460*E(-2) * 15 / 1.344,
            'Cm-244' : 1.980*E(-2) * 15 / 1.344,
            'Cs-134' : 6.580*E(-2) * 15 / 1.344,
            'Cs-137' : 8.630*E(-1) * 15 / 1.344,
            'Eu-154' : 1.770*E(-2) * 15 / 1.344,
            'Pu-236' : 1.550*E(-6) * 15 / 1.344,
            'Pu-238' : 1.080*E(-1) * 15 / 1.344,
            'Pu-239' : 4.800*E(0) * 15 / 1.344,
            'Pu-240' : 2.170*E(0) * 15 / 1.344,
            'Pu-241' : 1.140*E(0) * 15 / 1.344,
            'Pu-242' : 4.500*E(-1) * 15 / 1.344,
            'U-235'  : 6.500*E(0) * 15 / 1.344,
            'U-236'  : 3.260*E(0) * 15 / 1.344,
            'U-238'  : 9.520*E(2) * 15 / 1.344
        }),
        color  : '#99FF00',
        source : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Gundremmingen&cell=B23&pin=A1&axis=2680'
    };

    var hypotheticalSuperEfficentReactor = {
        name : 'Hypothetical Super Efficient Reactor',
        data  : generateRadioactivityTimeSeries({
            // units are kg/MTU initial * 15 tons/year / 1.344 GWe
            // so end units are kg/year/GWe
            'Am-241' : 1.400*E(-1) * 15 / 1.344,
            'Cm-242' : 1.190*E(-2) * 15 / 1.344,
            'Cm-244' : 1.650*E(-2) * 15 / 1.344,
            'Cs-134' : 9.540*E(-2) * 15 / 1.344,
            'Cs-137' : 1.000*E(0) * 15 / 1.344,
            'Eu-154' : 1.970*E(-2) * 15 / 1.344,
            'Pu-238' : 1.060*E(-1) * 15 / 1.344,
            'Pu-239' : 5.080*E(0) * 15 / 1.344,
            'Pu-240' : 2.040*E(0) * 15 / 1.344,
            'Pu-241' : 1.110*E(0) * 15 / 1.344,
            'Pu-242' : 3.660*E(-1) * 15 / 1.344,
            'U-235'  : 1.010*E(1) * 15 / 1.344,
            'U-236'  : 4.050*E(0) * 15 / 1.344,
            'U-238'  : 3.480*E(2) * 15 / 1.344
        }),
        color : '#9cba18',
        source : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Gundremmingen&cell=B23&pin=A1&axis=2680'
    };

    var hypotheticalActinideBurnerReactor = {
        name : 'Hypothetical Actinide Burner',
        color : '#4bbc7e',
        data  : generateRadioactivityTimeSeries({
            // units are kg/MTU initial * 15 tons/year / 1.344 GWe
            // so end units are kg/year/GWe
            'Am-241' : 1.400*E(-1) * 15 / 1.344,
            'Cm-242' : 1.190*E(-2) * 15 / 1.344,
            'Cm-244' : 1.650*E(-2) * 15 / 1.344,
            'Cs-134' : 9.540*E(0) * 15 / 1.344,
            'Cs-137' : 1.000*E(0) * 15 / 1.344,
            'Eu-154' : 1.970*E(-2) * 15 / 1.344,
            'U-235'  : 1.010*E(1) * 15 / 1.344,
            'U-236'  : 4.050*E(0) * 15 / 1.344,
            'U-238'  : 9.480*E(2) * 15 / 1.344
        }),
        source : 'http://www.ornl.gov/~webworks/cppr/y2001/pres/118013.pdf'
    };

    var units  = 'becquerels';
    var series = [naturalSoil, uranium238, cesium134, plutonium239, pressurizedWaterReactor];
    renderRadioactivityPlot('demo-graph', series, units);

});