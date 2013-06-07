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