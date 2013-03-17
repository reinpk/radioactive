describe('radioactive.js', function () {

    // Decay Chains
    // ------------

    describe('decay chains', function () {

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

        it('has a complete thorium series from Cf-252 to Pb-208', function () {
            var Pb208 = searchDecayTree('Cf-252', 'Pb-208', searchDecayTree);
            expect(Pb208).to.equal('Pb-208');
        });
        it('has a complete actinium series from Pu-239 to Pb-207', function () {
            var Pb207 = searchDecayTree('Pu-239', 'Pb-207', searchDecayTree);
            expect(Pb207).to.equal('Pb-207');
        });
        it('has a complete radium series from Pu-242 to Pb-206', function () {
            var Pb206 = searchDecayTree('Pu-242', 'Pb-206', searchDecayTree);
            expect(Pb206).to.equal('Pb-206');
        });
        it('has a complete neptunium series from Cf-249 to Tl-205', function () {
            var Tl205 = searchDecayTree('Cf-249', 'Tl-205', searchDecayTree);
            expect(Tl205).to.equal('Tl-205');
        });

        it('has a complete fission product light series from Y-99 to Ru-99', function () {
            var Ru99 = searchDecayTree('Y-99', 'Ru-99', searchDecayTree);
            expect(Ru99).to.equal('Ru-99');
        });
        it('has a complete fission product heavy series from Te-135 to Ba-135', function () {
            var Ba135 = searchDecayTree('Te-135', 'Ba-135', searchDecayTree);
            expect(Ba135).to.equal('Ba-135');
        });

    });



    // Decay Profiles
    // --------------

    describe('decay profiles', function () {

        it('has a correct decay profile', function () {
            var profile = nuclear.decayProfile({
                'Pu-239' : 1
            });

            console.log(profile);

            for (var tpow = 0; tpow < 20; tpow++) {
                console.log(profile.radioactivity(Math.pow(10, tpow)).total);
            }
        });
    });

});


