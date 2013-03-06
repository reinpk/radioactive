// Data
// ----

var E = function (exponent) {
    return Math.pow(10, exponent);
};

/*
Thesis pg 3 has graph
http://trace.tennessee.edu/cgi/viewcontent.cgi?article=1838&context=utk_graddiss

Has typical LWR isotope data
http://radchem.nevada.edu/docs/course%20reading/radiochem%20nucl%20power%20reactor.pdf

OECD NEA Spent Fuel Isotopic Composition Database
http://www.oecd-nea.org/sfcompo/

Recommended datasets from ORNL
http://www.ornl.gov/~webworks/cppr/y2002/rpt/93933.pdf
*/

var reactors = [
    {
        name : 'Pressurized Water',
        slug : 'pressurized-water',
        color : '#222222',
        wasteProfile : {
            // units are kg/MTU initial
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
        },
        wasteDataSource : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Obrigheim&cell=BE124&pin=G7&axis=2315'
    },
    {
        name : 'Boiling Water',
        slug : 'boiling-water',
        color : '#99FF00',
        wasteProfile : {
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
        },
        wasteDataSource : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Gundremmingen&cell=B23&pin=A1&axis=2680'
    },
    {
        name : 'Heavy Water',
        slug : 'heavy-water',
        color : '#FFCC00',
        wasteProfile : [],
        wasteDataSource : 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&ved=0CDoQFjAC&url=http%3A%2F%2Fwww.scirp.org%2Fjournal%2FPaperDownload.aspx%3FDOI%3D10.4236%2Fwjnst.2011.12006&ei=_m3zUODYH-OXiAKqkYG4CQ&usg=AFQjCNEevchP7rDdn-83oQXxqBkRz6YHEA'
    },
    {
        name : 'Hypothetical Super Efficient Reactor',
        slug : 'super-efficient',
        color : '#99FF00',
        wasteProfile : {
            // units are kg/MTU initial
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
        },
        wasteDataSource : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Gundremmingen&cell=B23&pin=A1&axis=2680'
    },
    {
        name : 'Hypothetical Actinide Burner',
        slug : 'molten-salt',
        color : '#FF9900',
        wasteProfile : {
            // units are kg/MTU initial
            'Cs-134' : 9.540*E(-2) * 15 / 1.344,
            'Cs-137' : 1.000*E(0) * 15 / 1.344,
            'Eu-154' : 1.970*E(-2) * 15 / 1.344,
            'U-235'  : 1.010*E(1) * 15 / 1.344,
            'U-236'  : 4.050*E(0) * 15 / 1.344,
            'U-238'  : 3.480*E(2) * 15 / 1.344
        },
        wasteDataSource : 'http://www.ornl.gov/~webworks/cppr/y2001/pres/118013.pdf'
    }
];



// Backbone
// --------

var DecayDemo = {};


// Models

DecayDemo.ReactorModel = Backbone.Model.extend({
    defaults : {
        name          : null,
        slug          : null,
        color         : null,
        wasteProfile  : null
    }
});

DecayDemo.ReactorCollection = Backbone.Collection.extend({
    model : DecayDemo.ReactorModel
});


// Views

DecayDemo.ResultsView = Backbone.View.extend({

    initialize : function (options) {
        this.onReactorSelected(options.collection.first());
        this.onReactorSelected(options.collection.at(3));
        this.onReactorSelected(options.collection.last());
    },

    onReactorSelected : function (reactorModel) {
        this.model = reactorModel;
        this.render();
    },

    render : function () {
        this.renderGraph();
        return this;
    },

    renderGraph : function () {

        var backgroundSoilRadiation = 130600000;
        var backgroundCutoff = backgroundSoilRadiation / 500;

        var wasteProfile = this.model.get('wasteProfile');
        var decayProfile = nuclear.decayProfile(wasteProfile);

        var data = [];
        var tpow = 0;
        var lastTotal = backgroundCutoff * 2;
        while (lastTotal > backgroundCutoff) {
            var t = Math.pow(10, tpow);
            for (var mult = 1; mult < 10; mult+=2) {
                var profile = decayProfile.radioactivity(mult*t);
                data.push({
                    t  : mult*t,
                    bq : profile.total
                });
            }

            lastTotal = _.last(data).bq;
            tpow++;
        }
        data = _.filter(data, function (datum) {
            return (datum.bq >= backgroundCutoff);
        });

        var svg = d3.select('svg');

        var xScale = d3.scale.linear()
            .domain([0, Math.log(_.last(data).t)])
            .range([35, 580]);

        var yScale = d3.scale.linear()
            .domain([Math.log(backgroundCutoff), 40])
            .range([250, 5]);

        var line = d3.svg.line()
            .x(function (datum) {
              return Math.floor(xScale(Math.log(datum.t)));
            })
            .y(function (datum) {
              return Math.floor(yScale(Math.log(datum.bq)));
            })
            .interpolate('cubic');

        svg.append('path')
            .attr('d', line(data))
            .style('stroke', this.model.get('color'));

        // Calculated from http://www.physics.isu.edu/radinf/natural.htm
        // by using an equivalent mass of soil as the input waste mass.
        var soilbackgroundLine = d3.svg.line()
            .x(function (datum) {
              return Math.floor(xScale(Math.log(datum.t)));
            })
            .y(function (datum) {
              return Math.floor(yScale(Math.log(backgroundSoilRadiation)));
            })
            .interpolate('cubic');


        svg.append('path')
            .attr('class', 'soil-background')
            .attr('d', soilbackgroundLine(data));

        svg.append('rect')
            .attr('class', 'axis')
            .attr('x', xScale(0))
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', yScale(Math.log(backgroundCutoff)));
        svg.append('rect')
            .attr('class', 'axis')
            .attr('x', xScale(0))
            .attr('y', yScale(Math.log(backgroundCutoff)))
            .attr('width', 580)
            .attr('height', 1);

        var tickData = [
            { y : 1, label : 'Start' },
            { y : 10, label : '10 years' },
            { y : 1000, label : '1000 years' },
            { y : 1000000, label : '1m years' },
            { y : 10000000000, label : '10B years'}
        ];
        var ticks = svg.selectAll('rect.tick').data(tickData);
        ticks.enter().append('rect')
            .attr('class', 'tick')
            .attr('x', function (datum) {
                return Math.round(xScale(Math.log(datum.y)));
            })
            .attr('y', yScale(Math.log(backgroundCutoff)))
            .attr('width', 1)
            .attr('height', 3);

        var tickLabels = svg.selectAll('text.tick-label').data(tickData);
        tickLabels.enter().append('text')
            .attr('class', 'tick-label')
            .attr('x', function (datum) {
                return xScale(Math.log(datum.y));
            })
            .attr('y', yScale(Math.log(backgroundCutoff))+15)
            .attr('text-anchor', 'middle')
            .text(function (datum) {
                return datum.label;
            });

        var yTickData = [
            { bq : Math.pow(10, 6), label : '1 MBq' },
            { bq : Math.pow(10, 9), label : '1 GBq' },
            { bq : Math.pow(10, 15), label : '1 PBq' }
        ];
        var yTicks = svg.selectAll('rect.y-tick').data(yTickData);
        yTicks.enter().append('rect')
            .attr('class', 'y-tick')
            .attr('y', function (datum) {
                return Math.round(yScale(Math.log(datum.bq)));
            })
            .attr('x', xScale(0)-2)
            .attr('width', 3)
            .attr('height', 1);

        var yTickLabels = svg.selectAll('text.y-tick-label').data(yTickData);
        yTickLabels.enter().append('text')
            .attr('class', 'y-tick-label')
            .attr('y', function (datum) {
                return yScale(Math.log(datum.bq))+4;
            })
            .attr('x', xScale(0)-5)
            .attr('text-anchor', 'end')
            .text(function (datum) {
                return datum.label;
            });
    }
});


$(function () {

    var reactorCollection = new DecayDemo.ReactorCollection(reactors);

    new DecayDemo.ResultsView({
        el         : $('.demo-graph'),
        collection : reactorCollection
    });
});
