// radioactive.js
//
// (c) 2013 Peter Reinhardt
// radioactive.js may be freely distributed under the MIT license.

var extend      = require('extend'),
    isotopeData = require('isotope-data'),
    decay       = require('radioactive-decay');

/**
 * Radioactive.
 */

function Radioactive () {}


/**
 * Extend the Radioactive prototype.
 */

extend(Radioactive.prototype, {

    isotopeData : isotopeData,

    decay       : decay

});


module.exports = new Radioactive();
