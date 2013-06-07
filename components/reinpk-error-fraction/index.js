/**
 * Calculates the error fraction for a measured and expected value.
 *
 * @param {Number} expected
 * @param {Number} measured
 * @return {Number} the error fraction
 * @api public
 */

function errorFraction (expected, measured) {
  return Math.abs( (measured - expected) / expected );
}

module.exports = errorFraction;