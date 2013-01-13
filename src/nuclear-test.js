/*global sinon, suite, beforeEach, test, expect, analytics */
(function () {


    // Isotopes
    // --------

    suite('isotopes');


    var searchDecayTree = function (isotope, searchIsotope, searchDecayTree) {
        var products = nuclear.decayProducts(isotope);
        if (products) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].product === searchIsotope)
                    return searchIsotope;
                else
                    return searchDecayTree(products[i].product, searchIsotope, searchDecayTree);
            }
        }
    };

    test('thorium series should be complete from Cf-252 to Pb-208', function () {
        var Pb208 = searchDecayTree('Cf-252', 'Pb-208', searchDecayTree);
        expect(Pb208).to.equal('Pb-208');
    });
    test('actinium series should be complete from Pu-239 to Pb-207', function () {
        var Pb207 = searchDecayTree('Pu-239', 'Pb-207', searchDecayTree);
        expect(Pb207).to.equal('Pb-207');
    });
    test('radium series should be complete from U-238 to Pb-206', function () {
        var Pb206 = searchDecayTree('U-238', 'Pb-206', searchDecayTree);
        expect(Pb206).to.equal('Pb-206');
    });
    test('neptunium series should be complete from Cf-249 to Tl-205', function () {
        var Tl205 = searchDecayTree('Cf-249', 'Tl-205', searchDecayTree);
        expect(Tl205).to.equal('Tl-205');
    });

    test('fission product light series should be complete from Y-99 to Ru-99', function () {
        var Ru99 = searchDecayTree('Y-99', 'Ru-99', searchDecayTree);
        expect(Ru99).to.equal('Ru-99');
    });
    test('fission product heavy series should be complete from Te-135 to Ba-135', function () {
        var Ba135 = searchDecayTree('Te-135', 'Ba-135', searchDecayTree);
        expect(Ba135).to.equal('Ba-135');
    });


    // Isotopes
    // --------

    suite('decay chain');

    test('decay chain matrix should be correct', function () {
        var profile = nuclear.decayChainProfile('Pu-239', {
            'Pu-239' : 1
        });

        console.log(profile);

        for (var tpow = 0; tpow < 20; tpow++) {
            console.log(Math.pow(10, tpow));
            console.log(profile.radioactivity(Math.pow(10, tpow)).total);
        }
    });


})();



