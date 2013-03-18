// radioactive.js
//
// (c) 2013 Peter Reinhardt
// radioactive.js may be freely distributed under the MIT license.

var extend      = require('extend'),
    clone       = require('clone'),
    map         = require('map'),
    keys        = require('keys'),
    defaults    = require('defaults'),
    zeroes      = require('zeroes'),
    convert     = require('convert'),
    isotopeData = require('isotope-data');

/**
 * Radioactive.
 */

function Radioactive () {}


/**
 * Extend the Radioactive prototype.
 */

extend(Radioactive.prototype, {

    isotopeData : isotopeData,

    /**
     * Get the decay products for the given isotope.
     *
     * @param {String} isotope - The compact name of the isotope like 'Pu-239'
     *
     * @return {Array} An array of objects containing the compact isotope names and
     * the fraction of that isotope produced during decay. The form of the arrayis:
     * [
     *     {
     *         fraction : 1,        // in the range [0, 1]
     *         product  : 'Pu-239'  // a compact isotope name
     *     },
     *     ...
     * ]
     */
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

    /**
     * Get the complete decay chain for the given isotope
     *
     * @param {String} isotope - The compact name of the isotope like 'Pu-239'
     *
     * @return {Array} An array of all the compact isotope names in the resulting chain.
     */
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

    /**
     * Get a single decay chain time-profile based on the initial charge.
     * 
     * This prepares a decay profile for the given `charge` distribution
     * of input isotopes. Only works for one starting chain, so if you want
     * to use it for an arbitrary charge profile you need to loop over all
     * the possible chains (see the decayProfile function below).
     * It returns a dictionary of functions that can compute
     * the distribution of isotopes or radiation at any given time.
     *
     * @param {String} isotope - The compact name of the isotope (like 'Pu-239')
     * for where to start this chain.
     * 
     * @param {Object} charge  - The dictionary of compact isotope names to initial
     * charges (kilograms) of that isotope.
     * 
     */
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

    /**
     * Get a decay profile of isotope concentration for a starting charge of isotopes.
     * 
     * For any given starting profile of isotopes, returns
     * a complete decay profile for all involved chains as a time-functions
     * that returns the isotope distribution.
     * 
     * @param {Object} charge - The dictionary of compact isotope names (like `Pu-239')
     * to initial charges (kilograms) of that isotope.
     * 
     * @return {Function} A function that can be used to calculate the concentration 
     * of isotopes at any given time (units of years) since the starting charge.
     * The format of the object returned by the concentration function is
     * {
     *     'Pu-239' : 123, // kilograms
     *     ...other isotopes...
     *     'total   : 12345 // kilograms
     * }
     */
    decayConcentration : function (charge) {

        var chargeClone = clone(charge);
        var isotopesAtStart = keys(chargeClone);

        var self = this;
        var profiles = map(isotopesAtStart, function (isotope) {
            return self.decayChainProfile(isotope, chargeClone);
        });

        // Merge the concentrations from each series
        return function (years) {
            var concentration = { total : 0 };
            for (var i = 0; i < profiles.length; i++) {
                var seriesConcentration = profiles[i].concentration(years);
                concentration = defaults(concentration, seriesConcentration);
                concentration.total += seriesConcentration.total;
            }
            return concentration;
        };
    },

    /**
     * Get a decay profile of radioactivity for a starting charge of isotopes.
     * 
     * For any given starting profile of isotopes, returns
     * a complete decay profile for all involved chains as a time-function
     * that returns the radioactivity of each isotope and the total radioactivity.
     * 
     * @param {Object} charge - The dictionary of compact isotope names (like `Pu-239')
     * to initial charges (kilograms) of that isotope.
     * 
     * @return {Function} A function that can be used to calculate the radioactivity 
     * of the existing isotopes at any given time (units of years) since the starting charge.
     * The format of the object returned by the radioactivity function is
     * {
     *     'Pu-239' : 123, // becquerels
     *     ...other isotopes...
     *     'total   : 12345 // becquerels
     * }
     */
    decayRadioactivity : function (charge) {

        var chargeClone = clone(charge);
        var isotopesAtStart = keys(chargeClone);

        var self = this;
        var profiles = map(isotopesAtStart, function (isotope) {
            return self.decayChainProfile(isotope, chargeClone);
        });

        // Merge the radioactivity from each series
        return function (years) {
            var Bq = { total : 0 };
            for (var i = 0; i < profiles.length; i++) {
                var seriesBq = profiles[i].radioactivity(years);
                Bq = defaults(Bq, seriesBq);
                Bq.total += seriesBq.total;
                console.log(seriesBq);
            }
            return Bq;
        };
    }

});


module.exports = new Radioactive();
