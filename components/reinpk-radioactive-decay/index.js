// RadioactiveDecay
//
// (c) 2013 Peter Reinhardt
// RadioactiveDecay may be freely distributed under the MIT license.

var extend      = require('extend'),
    clone       = require('clone'),
    map         = require('map'),
    each        = require('each'),
    keys        = require('keys'),
    defaults    = require('defaults'),
    zeroes      = require('zeroes'),
    convert     = require('convert'),
    isotopeData = require('isotope-data');

/**
 * RadioactiveDecay.
 */

function RadioactiveDecay () {}


/**
 * Extend the RadioactiveDecay prototype.
 */

extend(RadioactiveDecay.prototype, {

    radiationLevels : {
        // Calculated from http://www.physics.isu.edu/radinf/natural.htm as
        // 653 GBq / mi^2 * ft ==  524 Bq / kg
        soil : 524
    },

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
    products : function (isotope) {
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
    chain : function (isotope) {
        var chain = [ isotope ];
        var product = this.products(isotope);

        while (product) {
            // choose first decay product
            product = product[0];

            // exit if this isotope is stable
            if (!isotopeData[product.product]) break;

            // add this isotope to the chain
            chain.push(product.product);

            // get next decay product
            product = this.products(product.product);
        }

        return chain;
    },

    /**
     * Get a single decay chain time-profile based on the initial mass charge.
     * 
     * This prepares a decay profile for the given `charge` distribution
     * of input isotopes. Only works for one starting chain, so if you want
     * to use it for an arbitrary charge profile you need to loop over all
     * the possible chains (see the profile function below).
     * It returns a dictionary of functions that can compute
     * the distribution of isotopes or radiation at any given time.
     *
     * @param {String} isotope - The compact name of the isotope (like 'Pu-239')
     * for where to start this chain.
     * 
     * @param {Object} charge  - The dictionary of compact isotope names to initial
     * mass charges (kilograms) of that isotope.
     * 
     */
    chainProfile : function (isotope, charge) {

        // First need to convert mass in kg to number of atoms
        each(keys(charge), function (isotope) {
            charge[isotope] /= isotopeData[isotope].molarMass;
        });

        var chain = this.chain(isotope);
        var C = new Array(chain.length);
        var molarMasses = [];

        // calculate lambda coefficients
        var lambda = map(chain, function (isotope) {
            return ( Math.log(2) / isotopeData[isotope].halflife );
        });

        // coefficients for the first row
        C[0] = zeroes(chain.length);
        C[0][0] = charge[isotope] || 0;
        charge[isotope] = 0;
        molarMasses[0] = isotopeData[isotope].molarMass;

        // coefficients for the remaining rows
        for (var i = 1; i < chain.length; i++) {

            // initialize array to zeroes
            C[i] = zeroes(chain.length);
            molarMasses[i] = isotopeData[chain[i]].molarMass;

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
        var massProfile = function (years) {
            var N = {};
            N.total = 0;
            for (var i = 0; i < C.length; i++) {
                var Ni = 0;
                for (var k = 0; k < C[i].length; k++) {
                    Ni += molarMasses[i] * C[i][k] * Math.exp(-lambda[k] * years);
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
            mass          : massProfile,
            radioactivity : radioactivityProfile
        };
    },

    /**
     * Get a decay profile of isotope mass for a starting charge of isotopes.
     * 
     * For any given starting profile of isotopes, returns
     * a complete decay profile for all involved chains as a time-functions
     * that returns the isotope distribution.
     * 
     * @param {Object} charge - The dictionary of compact isotope names (like `Pu-239')
     * to initial charges (kilograms) of that isotope.
     * 
     * @return {Function} A function that can be used to calculate the mass 
     * of isotopes at any given time (units of years) since the starting charge.
     * The format of the object returned by the mass function is
     * {
     *     'Pu-239' : 123, // kilograms
     *     ...other isotopes...
     *     'total   : 12345 // kilograms
     * }
     */
    mass : function (charge) {

        var chargeClone = clone(charge);
        var isotopesAtStart = keys(chargeClone);

        var self = this;
        var profiles = map(isotopesAtStart, function (isotope) {
            return self.chainProfile(isotope, chargeClone);
        });

        // Merge the masses from each series
        return function (years) {
            var mass = { total : 0 };
            for (var i = 0; i < profiles.length; i++) {
                var seriesMass = profiles[i].mass(years);
                mass = defaults(mass, seriesMass);
                mass.total += seriesMass.total;
            }
            return mass;
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
    radioactivity : function (charge) {

        var chargeClone = clone(charge);
        var isotopesAtStart = keys(chargeClone);

        var self = this;
        var profiles = map(isotopesAtStart, function (isotope) {
            return self.chainProfile(isotope, chargeClone);
        });

        // Merge the radioactivity from each series
        return function (years) {
            var Bq = { total : 0 };
            for (var i = 0; i < profiles.length; i++) {
                var seriesBq = profiles[i].radioactivity(years);
                Bq = defaults(Bq, seriesBq);
                Bq.total += seriesBq.total;
            }
            return Bq;
        };
    }

});


module.exports = new RadioactiveDecay();
