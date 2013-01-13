
// Data
// ----

var reactors = [
    {
        name : 'Light Water',
        slug : 'light-water',
        wasteProfile : [],
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
        this.$('.demo-results-title').text(this.model.get('name') + ' Reactor Waste Profile');
        this.$('.demo-waste-analysis').html(this.model.get('wasteAnalysis'));
        this.$('.demo-reactor-description').html(this.model.get('description'));

        this.renderGraph();
        return this;
    },

    renderGraph : function () {
        var wasteProfile = this.model.get('wasteProfile');
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