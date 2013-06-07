/**
 * Expose `defaults`.
 */
module.exports = defaults;

/**
 * Merge default values.
 *
 * @param {Object} dest
 * @param {Object} defaults
 * @return {Object}
 * @api public
 */
function defaults (dest, defaults) {
  for (var prop in defaults) {
    if (! (prop in dest)) {
      dest[prop] = defaults[prop];
    }
  }

  return dest;
};
