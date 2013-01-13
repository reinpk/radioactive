
// Data
// ----

var E = function (exponent) {
    return Math.pow(10, exponent);
};

var reactors = [
    {
        name : 'Pressurized Water',
        slug : 'pressurized-water',
        wasteProfile : {
            // units are kg/MTU initial
            'Am-241' : 1.400*E(-1),
            'Cm-242' : 1.190*E(-2),
            'Cm-244' : 1.650*E(-2),
            'Cs-134' : 9.540*E(-2),
            'Cs-137' : 1.000*E(0),
            'Eu-154' : 1.970*E(-2),
            'Pu-238' : 1.060*E(-1),
            'Pu-239' : 5.080*E(0),
            'Pu-240' : 2.040*E(0),
            'Pu-241' : 1.110*E(0),
            'Pu-242' : 3.660*E(-1),
            'U-235'  : 1.010*E(1),
            'U-236'  : 4.050*E(0),
            'U-238'  : 9.480*E(2)
        },
        wasteDataSource : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Obrigheim&cell=BE124&pin=G7&axis=2315',
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
    },
    {
        name : 'Boiling Water',
        slug : 'boiling-water',
        wasteProfile : {
            // units are kg/MTU initial
            'Am-241' : 6.630*E(-1),
            'Cm-242' : 1.460*E(-2),
            'Cm-244' : 1.980*E(-2),
            'Cs-134' : 6.580*E(-2),
            'Cs-137' : 8.630*E(-1),
            'Eu-154' : 1.770*E(-2),
            'Pu-236' : 1.550*E(-6),
            'Pu-238' : 1.080*E(-1),
            'Pu-239' : 4.800*E(0),
            'Pu-240' : 2.170*E(0),
            'Pu-241' : 1.140*E(0),
            'Pu-242' : 4.500*E(-1),
            'U-235'  : 6.500*E(0),
            'U-236'  : 3.260*E(0),
            'U-238'  : 9.520*E(2)
        },
        wasteDataSource : 'http://www.oecd-nea.org/sfcompo/Ver.2/search/search.pl?rosin=Gundremmingen&cell=B23&pin=A1&axis=2680',
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
    },
    {
        name : 'Heavy Water',
        slug : 'heavy-water',
        wasteProfile : [],
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
    },
    {
        name : 'Liquid Metal',
        slug : 'liquid-metal',
        wasteProfile : [],
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
    },
    {
        name : 'Molten Salt',
        slug : 'molten-salt',
        wasteProfile : [],
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
    },
    {
        name : 'Pebble Bed',
        slug : 'pebble-bed',
        wasteProfile : [],
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
    },
    {
        name : 'Aqueous',
        slug : 'aqueous',
        wasteProfile : [],
        wasteAnalysis : '',
        description   : '',
        diagram       : ''
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
        wasteProfile  : null,
        wasteAnalysis : null,
        description   : null,
        diagram       : null
    }
});

DecayDemo.ReactorCollection = Backbone.Collection.extend({
    model : DecayDemo.ReactorModel
});


// Views

DecayDemo.ReactorListItemView = Backbone.View.extend({

    tagName   : 'li',
    className : 'demo-reactor-list-item',

    template : _.template('<a href="#<%= slug %>"><%= name %></a>'),

    events : {
        'click' : 'onItemClick'
    },

    render : function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    onItemClick : function () {
        this.trigger('selected', this);
    }
});

DecayDemo.ReactorListView = Backbone.View.extend({

    tagName : 'ul',
    className : 'demo-reactor-list',

    render : function () {
        var self = this;
        this.collection.each(function (model) {
            var itemView = new DecayDemo.ReactorListItemView({
                model : model
            });
            itemView.render()
                    .on('selected', self.onItemSelected, self);
            self.$el.append(itemView.$el);
        });
    },

    onItemSelected : function (itemView) {
        this.$el.find('.demo-reactor-list-item').toggleClass('selected', false);
        itemView.$el.toggleClass('selected', true);

        this.trigger('selected:reactor', itemView.model);
    }
});

DecayDemo.ResultsView = Backbone.View.extend({

    initialize : function (options) {
        if (options.reactorListView)
            options.reactorListView.on('selected:reactor', this.onReactorSelected, this);
    },

    onReactorSelected : function (reactorModel) {
        this.model = reactorModel;
        this.render();
    },

    render : function () {
        this.$('.demo-results-title').text(this.model.get('name') + ' Reactor Waste');
        this.$('.demo-waste-analysis').html(this.model.get('wasteAnalysis'));
        this.$('.demo-reactor-description').html(this.model.get('description'));

        this.renderGraph();
        return this;
    },

    renderGraph : function () {
        var wasteProfile = this.model.get('wasteProfile');
        var decayProfile = nuclear.decayProfile(wasteProfile);
        for (var pow = 0; pow < 10; pow++) {
            console.log(decayProfile.radioactivity(Math.exp(10, pow)));
        }
        // TODO run through nuclear.js
        // TODO graph it
    }
});


$(function () {

    var reactorCollection = new DecayDemo.ReactorCollection(reactors);

    var reactorList = new DecayDemo.ReactorListView({
        el         : $('.demo-reactor-list'),
        collection : reactorCollection
    });
    reactorList.render();

    var results = new DecayDemo.ResultsView({
        el              : $('.demo-results'),
        reactorListView : reactorList
    });

    $('.demo-reactor-list-item').first().click();
});