var extend      = require('extend'),
    clone       = require('clone'),
    map         = require('map'),
    keys        = require('keys'),
    defaults    = require('defaults'),
    zeroes      = require('zeroes'),
    convert     = require('./convert'),
    isotopeData = require('./isotope-data');


module.exports = Radioactive;


/**
 * Radioactive.
 */

function Radioactive () {
  var self = this;
  this.VERSION = '0.0.2';
}


/**
 * Extend the Radioactive prototype.
 */

extend(Radioactive.prototype, {

    isotopeData : isotopeData,

    // get decay products for the given isotope
    decayProducts : function (isotope) {
        var datum = isotopeData[isotope];
        if (datum && datum.product)
            return [{
                fraction : 1,
                product  : datum.product
            }];
        else if (datum && datum.products)
            return datum.products;
    },

    // get the complete decay chain for the given isotope
    decayChain : function (isotope) {
        var chain = [ isotope ];
        var decayProduct = this.decayProducts(isotope);

        while (decayProduct) {
            // choose first decay product
            decayProduct = decayProduct[0];

            // exit if this isotope is stable
            if (!isotopeData[decayProduct.product]) break;

            // add this isotope to the chain
            chain.push(decayProduct.product);

            // get next decay product
            decayProduct = this.decayProducts(decayProduct.product);
        }

        return chain;
    },

    // This prepares a decay profile for the given `charge` distribution
    // of input isotopes. Only works for one starting chain, so if you want
    // to use it for an arbitrary charge profile you need to loop over all
    // the possible chains (see the decayProfile function below).
    // It returns a dictionary of functions that can compute
    // the distribution of isotopes or radiation at any given time.
    decayChainProfile : function (isotope, charge) {

        var chain = this.decayChain(isotope);
        var C = new Array(chain.length);

        // calculate lambda coefficients
        var lambda = map(chain, function (isotope) {
            return ( Math.log(2) / isotopeData[isotope].halflife );
        });

        // coefficients for the first row
        C[0] = zeroes(chain.length);
        C[0][0] = charge[isotope] || 0;
        charge[isotope] = 0;

        // coefficients for the remaining rows
        for (var i = 1; i < chain.length; i++) {

            // initialize array to zeroes
            C[i] = zeroes(chain.length);

            var sum = 0;
            for (var k = 0; k < i; k++) {
                C[i][k] = lambda[k] * C[i-1][k] / (lambda[i] - lambda[k]);
                sum += C[i][k];
            }

            // the last coefficient (on the diagonal)
            var Ni0 = charge[chain[i]] || 0;
            C[i][i] = Ni0 - sum;
            charge[chain[i]] = 0;
        }

        // return function that can evaluate the profile for any time
        var concentrationProfile = function (years) {
            var N = {};
            N.total = 0;
            for (var i = 0; i < C.length; i++) {
                var Ni = 0;
                for (var k = 0; k < C[i].length; k++) {
                    Ni += C[i][k] * Math.exp(-lambda[k] * years);
                }
                N[chain[i]] = Math.max(0, Ni);
                N.total += N[chain[i]];
            }
            return N;
        };

        var radioactivityProfile = function (years) {
            var Bq = {};
            Bq.total = 0;
            for (var i = 0; i < C.length; i++) {
                var Ni = 0;
                for (var k = 0; k < C[i].length; k++) {
                    Ni += C[i][k] * Math.exp(-lambda[k] * years);
                }
                Bq[chain[i]] = convert.moles(lambda[i] * Math.max(0, Ni)) / (365.25 * 24 * 60 * 60);
                Bq.total += Bq[chain[i]];
            }
            return Bq;
        };

        return {
            concentration : concentrationProfile,
            radioactivity : radioactivityProfile
        };
    },

    // For any given starting profile of isotopes, returns
    // a complete decay profile for all involved chains in one
    // dictionary of time-functions for radiation & isotope distribution.
    decayProfile : function (startingProfile) {

        var charge = clone(startingProfile);
        var isotopesAtStart = keys(charge);

        var self = this;
        var profiles = map(isotopesAtStart, function (isotope) {
            return self.decayChainProfile(isotope, charge);
        });

        // Merge the concentrations from each series
        var concentrationProfile = function (years) {
            var concentration = { total : 0 };
            for (var i = 0; i < profiles.length; i++) {
                var seriesConcentration = profiles[i].concentration(years);
                concentration = defaults(concentration, seriesConcentration);
                concentration.total += seriesConcentration.total;
            }
            return concentration;
        };

        // Merge the radioactivity from each series
        var radioactivityProfile = function (years) {
            var Bq = { total : 0 };
            for (var i = 0; i < profiles.length; i++) {
                var seriesBq = profiles[i].radioactivity(years);
                Bq = defaults(Bq, seriesBq);
                Bq.total += seriesBq.total;
                console.log(seriesBq);
            }
            return Bq;
        };

        return {
            concentration : concentrationProfile,
            radioactivity : radioactivityProfile
        };
    }

});


