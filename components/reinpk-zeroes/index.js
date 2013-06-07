/**
 * Create a zeroes array with the given `dimensions`.
 *
 * @param {Number|Array} dimensions
 * @param {Number} initialValue
 * @return {Array}
 * @api public
 */

function zeroes (dimensions, initialValue) {
  var array;

  if (dimensions.length === 1) dimensions = dimensions[0];
  if (initialValue === undefined) initialValue = 0;

  // if it's a number, create a flat array of zeroes
  if (typeof dimensions === 'number') {
    array = new Array(dimensions);
    for (var i = 0; i < dimensions; i += 1) {
      array[i] = initialValue;
    }
  }
  // else create an array of one-dimension-less arrays full of zeroes
  else {
    array = new Array(dimensions[0]);
    for (var j = 0; j < dimensions[0]; j += 1) {
      array[j] = zeroes(dimensions.slice(1));
    }
  }
  return array;
}

module.exports = zeroes;