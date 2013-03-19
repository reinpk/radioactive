;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("segmentio-extend/index.js", function(exports, require, module){

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};
});
require.register("reinpk-convert/index.js", function(exports, require, module){
var convert = {};


// exponential notation
convert.E = function (exponent) {
    return Math.pow(10, exponent);
};


// timespans (years-based)
convert.years = function (years) {
    return years;
};
convert.days = function (days) {
    return convert.years( days / 365.25 );
};
convert.hours = function (hours) {
    return convert.days( hours / 24 );
};
convert.minutes = function (minutes) {
    return convert.hours( minutes / 60 );
};
convert.seconds = function (seconds) {
    return convert.minutes( seconds / 60 );
};


// chemistry conversions
convert.moles = function (moles) {
    return (moles * 6.02214179 * Math.pow(10, 23));
};
convert.atomicMassMolar = function (amu) {
    return amu * 0.001; // molar mass based on atomic mass units
};


module.exports = convert;
});
require.register("reinpk-isotope-data/index.js", function(exports, require, module){
var convert = require('convert');

// Halflives and products taken during Jan & Mar 2013 from
//     http://en.wikipedia.org/wiki/Decay_chain 
// Atomic masses taken during Mar 2013 from 
//     http://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl
module.exports = {

    // Thorium series

    'Cf-252' : {
        halflife  : convert.years(2.645),
        product   : 'Cm-248',
        molarMass : convert.atomicMassMolar(252.081626)
    },
    'Cm-248' : {
        halflife  : convert.years(3.4) * convert.E(5),
        product   : 'Pu-244',
        molarMass : convert.atomicMassMolar(248.072349)
    },
    'Cm-244' : {
        halflife  : convert.years(18.1),
        product   : 'Pu-240',
        molarMass : convert.atomicMassMolar(244.0627526)
    },
    'Pu-244' : {
        halflife  : convert.years(8) * convert.E(7),
        product   : 'U-240',
        molarMass : convert.atomicMassMolar(244.064204)
    },
    'U-240' : {
        halflife  : convert.hours(14.1),
        product   : 'Np-240',
        molarMass : convert.atomicMassMolar(240)
    },
    'Np-240' : {
        halflife  : convert.hours(1.032),
        product   : 'Pu-240',
        molarMass : convert.atomicMassMolar(240)
    },
    'Pu-240' : {
        halflife  : convert.years(6561),
        product   : 'U-236',
        molarMass : convert.atomicMassMolar(240.0538135)
    },
    'Pu-236' : {
        halflife  : convert.years(2.858),
        product   : 'U-232',
        molarMass : convert.atomicMassMolar(236)
    },
    'U-236' : {
        halflife  : convert.years(2.3) * convert.E(7),
        product   : 'Th-232',
        molarMass : convert.atomicMassMolar(236.0455680)
    },
    'U-232' : {
        halflife  : convert.years(68.9),
        product   : 'Th-228',
        molarMass : convert.atomicMassMolar(232)
    },
    'Th-232' : {
        halflife  : convert.years(1.405) * convert.E(10),
        product   : 'Ra-228',
        molarMass : convert.atomicMassMolar(232.0380553)
    },
    'Ra-228' : {
        halflife  : convert.years(5.75),
        product   : 'Ac-228',
        molarMass : convert.atomicMassMolar(228.0310703)
    },
    'Ac-228' : {
        halflife  : convert.hours(6.25),
        product   : 'Th-228',
        molarMass : convert.atomicMassMolar(228)
    },
    'Th-228' : {
        halflife  : convert.years(1.9116),
        product   : 'Ra-224',
        molarMass : convert.atomicMassMolar(228)
    },
    'Ra-224' : {
        halflife  : convert.days(3.6319),
        product   : 'Rn-220',
        molarMass : convert.atomicMassMolar(224.0202118)
    },
    'Rn-220' : {
        halflife  : convert.seconds(55.6),
        product   : 'Po-216',
        molarMass : convert.atomicMassMolar(220.0113940)
    },
    'Po-216' : {
        halflife  : convert.seconds(0.145),
        product   : 'Pb-212',
        molarMass : convert.atomicMassMolar(216)
    },
    'Pb-212' : {
        halflife  : convert.hours(10.64),
        product   : 'Bi-212',
        molarMass : convert.atomicMassMolar(212)
    },
    'Bi-212' : {
        halflife  : convert.minutes(60.55),
        products  : [
            {
                fraction : 0.6406,
                product  : 'Po-212'
            },
            {
                fraction : 0.3594,
                product  : 'Tl-208'
            }
        ],
        molarMass : convert.atomicMassMolar(212)
    },
    'Po-212' : {
        halflife  : convert.seconds(299) * convert.E(-9),
        product   : 'Pb-208',
        molarMass : convert.atomicMassMolar(212)
    },
    'Tl-208' : {
        halflife  : convert.minutes(3.053),
        product   : 'Pb-208',
        molarMass : convert.atomicMassMolar(208)
    },



    // Neptunium series

    'Cf-249' : {
        halflife  : convert.years(351),
        product   : 'Cm-245',
        molarMass : convert.atomicMassMolar(249.0748535)
    },
    'Cm-245' : {
        halflife  : convert.years(8500),
        product   : 'Pu-241',
        molarMass : convert.atomicMassMolar(245.0654912)
    },
    'Pu-241' : {
        halflife  : convert.years(14.4),
        product   : 'Am-241',
        molarMass : convert.atomicMassMolar(241.0568515)
    },
    'Am-241' : {
        halflife  : convert.years(432.7),
        product   : 'Np-237',
        molarMass : convert.atomicMassMolar(241.0568291)
    },
    'Np-237' : {
        halflife  : convert.years(2.14) * convert.E(6),
        product   : 'Pa-233',
        molarMass : convert.atomicMassMolar(237.0481734)
    },
    'Pa-233' : {
        halflife  : convert.days(27.0),
        product   : 'U-233',
        molarMass : convert.atomicMassMolar(233)
    },
    'U-233' : {
        halflife  : convert.years(1.592) * convert.E(5),
        product   : 'Th-229',
        molarMass : convert.atomicMassMolar(233.0396352)
    },
    'Th-229' : {
        halflife  : convert.years(7340),
        product   : 'Ra-225',
        molarMass : convert.atomicMassMolar(229)
    },
    'Ra-225' : {
        halflife  : convert.days(14.9),
        product   : 'Ac-225',
        molarMass : convert.atomicMassMolar(225)
    },
    'Ac-225' : {
        halflife  : convert.days(10.0),
        product   : 'Fr-221',
        molarMass : convert.atomicMassMolar(225)
    },
    'Fr-221' : {
        halflife  : convert.minutes(4.8),
        product   : 'At-217',
        molarMass : convert.atomicMassMolar(221)
    },
    'At-217' : {
        halflife  : convert.seconds(32) * convert.E(-3),
        product   : 'Bi-213',
        molarMass : convert.atomicMassMolar(217)
    },
    'Bi-213' : {
        halflife  : convert.minutes(46.5),
        products  : [
            {
                fraction : 0.9780,
                product  : 'Po-213'
            },
            {
                fraction : 0.022,
                product  : 'Tl-209'
            }
        ],
        molarMass : convert.atomicMassMolar(213)
    },
    'Po-213' : {
        halflife  : convert.seconds(3.72) * convert.E(-6),
        product   : 'Pb-209',
        molarMass : convert.atomicMassMolar(213)
    },
    'Tl-209' : {
        halflife  : convert.minutes(2.2),
        product   : 'Pb-209',
        molarMass : convert.atomicMassMolar(209)
    },
    'Pb-209' : {
        halflife  : convert.hours(3.25),
        product   : 'Bi-209',
        molarMass : convert.atomicMassMolar(209)
    },
    'Bi-209' : {
        halflife  : convert.years(1.9) * convert.E(19),
        product   : 'Tl-205',
        molarMass : convert.atomicMassMolar(208.9803987)
    },


    // Radium series (aka uranium series)
    'Am-242' : {
        halflife  : convert.hours(16.02),
        product   : 'Cm-242',
        molarMass : convert.atomicMassMolar(242)
    },
    'Cm-242' : {
        halflife  : convert.days(162.8),
        product   : 'Pu-238',
        molarMass : convert.atomicMassMolar(242)
    },
    'Pu-242' : {
        halflife  : convert.years(376) * convert.E(3),
        product   : 'U-238',
        molarMass : convert.atomicMassMolar(242.0587426)
    },
    'Pu-238' : {
        halflife  : convert.years(87.7),
        product   : 'U-234',
        molarMass : convert.atomicMassMolar(238.0495599)
    },
    'U-238' : {
        halflife  : convert.years(4.468) * convert.E(9),
        product   : 'Th-234',
        molarMass : convert.atomicMassMolar(238.0507882)
    },
    'Th-234' : {
        halflife  : convert.days(24.10),
        product   : 'Pa-234m',
        molarMass : convert.atomicMassMolar(234)
    },
    'Pa-234m' : {
        halflife  : convert.minutes(1.16),
        products  : [
            {
                fraction : 0.9984,
                product  : 'U-234'
            },
            {
                fraction : 0.0016,
                product  : 'Pa-234'
            }
        ],
        molarMass : convert.atomicMassMolar(234)
    },
    'Pa-234' : {
        halflife  : convert.hours(6.70),
        product   : 'U-234',
        molarMass : convert.atomicMassMolar(234)
    },
    'U-234' : {
        halflife  : convert.years(245500),
        product   : 'Th-230',
        molarMass : convert.atomicMassMolar(234.0409521)
    },
    'Th-230' : {
        halflife  : convert.years(75380),
        product   : 'Ra-226',
        molarMass : convert.atomicMassMolar(230.0331338)
    },
    'Ra-226' : {
        halflife  : convert.years(1602),
        product   : 'Rn-222',
        molarMass : convert.atomicMassMolar(226.0254098)
    },
    'Rn-222' : {
        halflife  : convert.days(3.8235),
        product   : 'Po-218',
        molarMass : convert.atomicMassMolar(222)
    },
    'Po-218' : {
        halflife  : convert.minutes(3.10),
        products  : [
            {
                fraction : 0.9998,
                product  : 'Pb-214'
            },
            {
                fraction : 0.0002,
                product  : 'At-218'
            }
        ],
        molarMass : convert.atomicMassMolar(218)
    },
    'At-218' : {
        halflife  : convert.seconds(1.5),
        products  : [
            {
                fraction : 0.9990,
                product  : 'Bi-214'
            },
            {
                fraction : 0.0010,
                product  : 'Rn-218'
            }
        ],
        molarMass : convert.atomicMassMolar(218)
    },
    'Rn-218' : {
        halflife  : convert.seconds(35) * convert.E(-3),
        product   : 'Po-214',
        molarMass : convert.atomicMassMolar(218)
    },
    'Pb-214' : {
        halflife  : convert.minutes(26.8),
        product   : 'Bi-214',
        molarMass : convert.atomicMassMolar(214)
    },
    'Bi-214' : {
        halflife  : convert.minutes(19.9),
        products  : [
            {
                fraction : 0.9998,
                product  : 'Po-214'
            },
            {
                fraction : 0.0002,
                product  : 'Tl-210'
            }
        ],
        molarMass : convert.atomicMassMolar(214)
    },
    'Po-214' : {
        halflife  : convert.seconds(164.3) * convert.E(-6),
        product   : 'Pb-210',
        molarMass : convert.atomicMassMolar(214)
    },
    'Tl-210' : {
        halflife  : convert.minutes(1.30),
        product   : 'Pb-210',
        molarMass : convert.atomicMassMolar(210)
    },
    'Pb-210' : {
        halflife  : convert.years(22.3),
        product   : 'Bi-210',
        molarMass : convert.atomicMassMolar(210)
    },
    'Bi-210' : {
        halflife  : convert.days(5.013),
        products  : [
            {
                fraction : 0.9999987,
                product  : 'Po-210'
            },
            {
                fraction : 0.0000013,
                product  : 'Tl-206'
            }
        ],
        molarMass : convert.atomicMassMolar(210)
    },
    'Po-210' : {
        halflife  : convert.days(138.376),
        product   : 'Pb-206',
        molarMass : convert.atomicMassMolar(209.9828737)
    },
    'Tl-206' : {
        halflife  : convert.minutes(4.199),
        product   : 'Pb-206',
        molarMass : convert.atomicMassMolar(206)
    },


    // Actinium series

    'Am-243' : {
        halflife  : convert.years(7370),
        product   : 'Np-239',
        molarMass : convert.atomicMassMolar(243.0613811)
    },
    'Np-239' : {
        halflife  : convert.days(2.356),
        product   : 'Pu-239',
        molarMass : convert.atomicMassMolar(239)
    },
    'Pu-239' : {
        halflife  : convert.years(2.41) * convert.E(4),
        product   : 'U-235',
        molarMass : convert.atomicMassMolar(239.0521634)
    },
    'U-235' : {
        halflife  : convert.years(7.04) * convert.E(8),
        product   : 'Th-231',
        molarMass : convert.atomicMassMolar(235.0439299)
    },
    'Th-231' : {
        halflife  : convert.hours(25.52),
        product   : 'Pa-231',
        molarMass : convert.atomicMassMolar(231)
    },
    'Pa-231' : {
        halflife  : convert.years(32760),
        product   : 'Ac-227',
        molarMass : convert.atomicMassMolar(231.0358840)
    },
    'Ac-227' : {
        halflife  : convert.years(21.772),
        products  : [
            {
                fraction : 0.9862,
                product  : 'Th-227'
            },
            {
                fraction : 0.0138,
                product  : 'Fr-223'
            }
        ],
        molarMass : convert.atomicMassMolar(227.0277521)
    },
    'Th-227' : {
        halflife  : convert.days(18.68),
        product   : 'Ra-223',
        molarMass : convert.atomicMassMolar(227)
    },
    'Fr-223' : {
        halflife  : convert.minutes(22.00),
        products  : [
            {
                fraction : 0.99994,
                product  : 'Ra-223'
            },
            {
                fraction : 0.00006,
                product  : 'At-219'
            }
        ],
        molarMass : convert.atomicMassMolar(223.0197359)
    },
    'Ra-223' : {
        halflife  : convert.days(11.43),
        product   : 'Rn-219',
        molarMass : convert.atomicMassMolar(223.0185022)
    },
    'At-219' : {
        halflife  : convert.seconds(56),
        products  : [
            {
                fraction : 0.9700,
                product  : 'Bi-215'
            },
            {
                fraction : 0.0300,
                product  : 'Rn-219'
            }
        ],
        molarMass : convert.atomicMassMolar(219)
    },
    'Rn-219' : {
        halflife  : convert.seconds(3.96),
        product   : 'Po-215',
        molarMass : convert.atomicMassMolar(219)
    },
    'Bi-215' : {
        halflife  : convert.minutes(7.6),
        product   : 'Po-215',
        molarMass : convert.atomicMassMolar(215)
    },
    'Po-215' : {
        halflife  : convert.seconds(1.781) * convert.E(-3),
        products  : [
            {
                fraction : 0.9999977,
                product  : 'Pb-211'
            },
            {
                fraction : 0.0000023,
                product  : 'At-215'
            }
        ],
        molarMass : convert.atomicMassMolar(215)
    },
    'At-215' : {
        halflife  : convert.seconds(0.1) * convert.E(-3),
        product   : 'Bi-211',
        molarMass : convert.atomicMassMolar(215)
    },
    'Pb-211' : {
        halflife  : convert.minutes(36.1),
        product   : 'Bi-211',
        molarMass : convert.atomicMassMolar(211)
    },
    'Bi-211' : {
        halflife  : convert.minutes(2.14),
        products  : [
            {
                fraction : 0.99724,
                product  : 'Tl-207'
            },
            {
                fraction : 0.00276,
                product  : 'Po-211'
            }
        ],
        molarMass : convert.atomicMassMolar(211)
    },
    'Po-211' : {
        halflife  : convert.seconds(516) * convert.E(-3),
        product   : 'Pb-207',
        molarMass : convert.atomicMassMolar(211)
    },
    'Tl-207' : {
        halflife  : convert.minutes(4.77),
        product   : 'Pb-207',
        molarMass : convert.atomicMassMolar(207)
    },


    // Fission products

    // strontium-90
    'Sr-90' : {
        halflife  : convert.years(28.8),
        product   : 'Y-90',
        molarMass : convert.atomicMassMolar(90)
    },
    'Y-90' : {
        halflife  : convert.hours(64),
        product   : 'Zr-90',
        molarMass : convert.atomicMassMolar(90)
    },

    // cesium-134
    'Cs-134' : {
        halflife  : convert.years(2.0652),
        product   : 'Ba-134',
        molarMass : convert.atomicMassMolar(134)
    },

    // cesium-137
    'Cs-137' : {
        halflife  : convert.years(30.17),
        product   : 'Ba-137m',
        molarMass : convert.atomicMassMolar(137)
    },
    'Ba-137m' : {
        halflife  : convert.seconds(153),
        product   : 'Ba-137',
        molarMass : convert.atomicMassMolar(136.9058274)
    },


    // light
    'Y-99' : {
        halflife  : convert.seconds(1.470),
        product   : 'Zr-99',
        molarMass : convert.atomicMassMolar(99)
    },
    'Zr-99' : {
        halflife  : convert.seconds(2.1),
        product   : 'Nb-99m',
        molarMass : convert.atomicMassMolar(99)
    },
    'Nb-99m' : {
        halflife  : convert.minutes(2.6),
        product   : 'Nb-99',
        molarMass : convert.atomicMassMolar(99)
    },
    'Nb-99' : {
        halflife  : convert.seconds(15.0),
        product   : 'Mo-99m2',
        molarMass : convert.atomicMassMolar(99)
    },
    'Mo-99m2' : {
        halflife  : convert.seconds(0.76) * convert.E(-3),
        product   : 'Mo-99m1',
        molarMass : convert.atomicMassMolar(99)
    },
    'Mo-99m1' : {
        halflife  : convert.seconds(15.5) * convert.E(-3),
        product   : 'Mo-99',
        molarMass : convert.atomicMassMolar(99)
    },
    'Mo-99' : {
        halflife  : convert.days(2.7489),
        product   : 'Tc-99m',
        molarMass : convert.atomicMassMolar(99)
    },
    'Tc-99m' : {
        halflife  : convert.hours(6.0058),
        product   : 'Tc-99',
        molarMass : convert.atomicMassMolar(98.9062547)
    },
    'Tc-99' : {
        halflife  : convert.years(2.11) * convert.E(5),
        product   : 'Ru-99',
        molarMass : convert.atomicMassMolar(98.9062547)
    },

    // heavy
    'Te-135' : {
        halflife  : convert.seconds(19.0),
        product   : 'I-135',
        molarMass : convert.atomicMassMolar(135)
    },
    'I-135' : {
        halflife  : convert.hours(6.57),
        product   : 'Xe-135',
        molarMass : convert.atomicMassMolar(135)
    },
    'Xe-135' : {
        halflife  : convert.hours(9.14),
        product   : 'Cs-135',
        molarMass : convert.atomicMassMolar(135)
    },
    'Cs-135' : {
        halflife  : convert.years(2.3) * convert.E(6),
        product   : 'Ba-135',
        molarMass : convert.atomicMassMolar(135)
    },

    // europium 154
    'Eu-154' : {
        halflife  : convert.years(8.593),
        product   : 'Gd-154',
        molarMass : convert.atomicMassMolar(154)
    }

};
});
require.register("component-type/index.js", function(exports, require, module){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("component-clone/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var type;

try {
  type = require('type');
} catch(e){
  type = require('type-component');
}

/**
 * Module exports.
 */

module.exports = clone;

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

function clone(obj){
  switch (type(obj)) {
    case 'object':
      var copy = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = clone(obj[key]);
        }
      }
      return copy;

    case 'array':
      var copy = new Array(obj.length);
      for (var i = 0, l = obj.length; i < l; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      var flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);

    case 'date':
      return new Date(obj.getTime());

    default: // string, number, boolean, …
      return obj;
  }
}

});
require.register("component-to-function/index.js", function(exports, require, module){

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  }
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  }
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18"
  return new Function('_', 'return _.' + str);
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {}
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key])
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  }
}

});
require.register("component-map/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var toFunction = require('to-function');

/**
 * Map the given `arr` with callback `fn(val, i)`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

module.exports = function(arr, fn){
  var ret = [];
  fn = toFunction(fn);
  for (var i = 0; i < arr.length; ++i) {
    ret.push(fn(arr[i], i));
  }
  return ret;
};
});
require.register("component-each/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var type = require('type');

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @api public
 */

module.exports = function(obj, fn){
  switch (type(obj)) {
    case 'array':
      return array(obj, fn);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn);
      return object(obj, fn);
    case 'string':
      return string(obj, fn);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @api private
 */

function string(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function object(obj, fn) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn(key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @api private
 */

function array(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj[i], i);
  }
}
});
require.register("matthewp-keys/index.js", function(exports, require, module){
module.exports = Object.keys || function(obj){
  var keys = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  return keys;
};
});
require.register("avetisk-defaults/index.js", function(exports, require, module){
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

});
require.register("reinpk-zeroes/index.js", function(exports, require, module){
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
});
require.register("reinpk-radioactive-decay/index.js", function(exports, require, module){
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
                console.log(seriesBq);
            }
            return Bq;
        };
    }

});


module.exports = new RadioactiveDecay();

});
require.register("radioactive/index.js", function(exports, require, module){
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

});
require.alias("segmentio-extend/index.js", "radioactive/deps/extend/index.js");

require.alias("reinpk-isotope-data/index.js", "radioactive/deps/isotope-data/index.js");
require.alias("reinpk-convert/index.js", "reinpk-isotope-data/deps/convert/index.js");

require.alias("reinpk-radioactive-decay/index.js", "radioactive/deps/radioactive-decay/index.js");
require.alias("reinpk-radioactive-decay/index.js", "radioactive/deps/radioactive-decay/index.js");
require.alias("component-clone/index.js", "reinpk-radioactive-decay/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("component-map/index.js", "reinpk-radioactive-decay/deps/map/index.js");
require.alias("component-to-function/index.js", "component-map/deps/to-function/index.js");

require.alias("component-each/index.js", "reinpk-radioactive-decay/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("matthewp-keys/index.js", "reinpk-radioactive-decay/deps/keys/index.js");
require.alias("matthewp-keys/index.js", "reinpk-radioactive-decay/deps/keys/index.js");
require.alias("matthewp-keys/index.js", "matthewp-keys/index.js");

require.alias("avetisk-defaults/index.js", "reinpk-radioactive-decay/deps/defaults/index.js");

require.alias("segmentio-extend/index.js", "reinpk-radioactive-decay/deps/extend/index.js");

require.alias("reinpk-zeroes/index.js", "reinpk-radioactive-decay/deps/zeroes/index.js");

require.alias("reinpk-convert/index.js", "reinpk-radioactive-decay/deps/convert/index.js");

require.alias("reinpk-isotope-data/index.js", "reinpk-radioactive-decay/deps/isotope-data/index.js");
require.alias("reinpk-convert/index.js", "reinpk-isotope-data/deps/convert/index.js");

require.alias("reinpk-radioactive-decay/index.js", "reinpk-radioactive-decay/index.js");

require.alias("radioactive/index.js", "radioactive/index.js");

if (typeof exports == "object") {
  module.exports = require("radioactive");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("radioactive"); });
} else {
  window["radioactive"] = require("radioactive");
}})();