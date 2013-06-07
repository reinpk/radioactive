
window.Worksheet = window.Worksheet || {};

// Display decay products at a point in time
window.Worksheet.displayDecayProducts = function (isotope, mass, time) {
    // compute the decay products
    var charge = {};
    charge[isotope] = mass;
    var products = radioactive.decay.mass(charge)(time);

    // create the list template
    var rowTemplate = _.template($('#decay-products-row-template').html());
    var tbody = $('#decay-products-table').children('tbody');
    tbody.html('');

    // show all the decay product isotopes and masses
    var names = _.keys(products);
    products = _.map(names, function (name) {
        var data = radioactive.isotopeData[name];
        var halflife = data ? data.halflife : '';
        halflife = window.Worksheet.getAppropriateTimeAndUnit(halflife);
        mass = window.Worksheet.getAppropriateMassAndUnit(products[name]);
        return {
            isotope  : name,
            mass     : mass.mass,
            massUnit : mass.unit,
            halflife : halflife.time,
            halflifeUnit : halflife.unit
        };
    });
    _.each(products, function (product) {
        if (product.isotope !== 'total')
            tbody.append(rowTemplate(product));
    });
};

// Generate a time series of decay products as a CSV
window.Worksheet.downloadTimeSeries = function (isotope, mass, interval) {
    // generate the decay products function
    var charge = {};
    charge[isotope] = mass;
    var products = radioactive.decay.mass(charge);

    // Create the header row of the CSV
    var csv = 'Years';
    var chain = products(1);
    _.each(_.keys(chain), function (isotope) {
        if (isotope !== 'total')
            csv += ','+isotope;
    });

    // Iterate on the interval to create the body of the CSV
    for (var i = 1; i <= 1000; i++) {

        var years = i * interval;

        csv += '\n';
        csv += years; // Years column

        var productsAtInterval = products(years);
        _.each(_.keys(productsAtInterval), function (isotope) {
            if (isotope !== 'total')
                csv += ','+productsAtInterval[isotope]*1000;
        });
    }

    // Download the CSV
    // TODO
    // console.log(csv);
};


// Convert time and timeUnit into years
window.Worksheet.convertTimeUnitsToYears = function (time, unit) {
    if (unit === 'years')
        return time;
    else if (unit === 'weeks')
        return (time * 7 / 365.25 );
    else if (unit === 'days')
        return (time / 365.25);
    else if (unit === 'hours')
        return (time / (365.25 * 24) );
    else if (unit === 'minutes')
        return (time / (365.25 * 24 * 60) );
    else if (unit === 'seconds')
        return (time / (365.25 * 24 * 60 * 60) );
};

// Get the appropriate unit from a timespan in years
window.Worksheet.getAppropriateTimeAndUnit = function (years) {
    if (years > 1)
        return { time : years, unit : 'years' };

    var weeks = years * 365.25 / 7 > 1;
    if (weeks > 1)
        return { time : weeks, unit : 'weeks' };

    var days = years * 365.25;
    if (days > 1)
        return { time : days, unit : 'days' };

    var hours = days * 24;
    if (hours > 1)
        return { time : hours, unit : 'hours' };

    var minutes = hours * 60;
    if (minutes > 1)
        return { time : minutes, unit : 'minutes' };

    var seconds = minutes * 60;
    if (seconds > 1)
        return { time : seconds, unit : 'seconds' };

    var ms = seconds * 1000;
    if (ms > 1)
        return { time : ms, unit : 'milliseconds' };

    var ns = ms * 1000000;
    return { time : ns, unit : 'nanoseconds' };
};

// Convert mass and massUnit to grams
window.Worksheet.convertMassUnitsToGrams = function (mass, massUnit) {
    if (massUnit === 'kilograms')
        return mass*1000;
    else if (massUnit === 'grams')
        return mass;
    else if (massUnit === 'milligrams')
        return mass/1000;
    else if (massUnit === 'micrograms')
        return mass/1000000;
    else if (massUnit === 'picograms')
        return mass/1000000000000;
};

// Get the appropriate unite from a mass in grams
window.Worksheet.getAppropriateMassAndUnit = function (grams) {

    var kg = grams / 1000;
    if (kg > 1)
        return { mass : kg, unit : 'kilograms' };

    if (grams > 1)
        return { mass : grams, unit : 'grams' };

    var mg = grams * 1000;
    if (mg > 1)
        return { mass : mg, unit : 'milligrams' };

    var ug = mg * 1000;
    if (ug > 1)
        return { mass : ug, unit : 'micrograms' };

    var pg = ug * 1000000;
    return { mass : pg, unit : 'picograms' };
};


// Set up the worksheet
$(function () {
    
    // Grab all of our input elements
    var isotopeInput = $('#isotope-input');
    var massInput = $('#mass-input');
    var massUnitSelect = $('#mass-unit-select');

    var timeInput = $('#time-input');
    var timeUnitSelect = $('#time-unit-select');

    var intervalInput = $('#interval-input');
    var intervalUnitSelect = $('#interval-unit-select');
    var downloadButton = $('#download-button');


    // Listen on isotopeInput, massInput, timeInput and timeUnitSelect blur
    // to display updated point-in-time decay products.
    var updateDecayProducts = function () {
        var isotope = isotopeInput.val();
        var mass = parseFloat(massInput.val());
        var massUnit = massUnitSelect.val();

        var grams = window.Worksheet.convertMassUnitsToGrams(mass, massUnit);

        var time = parseFloat(timeInput.val());
        var timeUnit = timeUnitSelect.val();

        // Convert units on time to years
        var years = window.Worksheet.convertTimeUnitsToYears(time, timeUnit);

        // Update the decay products display
        window.Worksheet.displayDecayProducts(isotope, grams, years);
    };

    isotopeInput.on('keyup', updateDecayProducts);
    massInput.on('keyup', updateDecayProducts);
    massUnitSelect.on('change', updateDecayProducts);
    timeInput.on('keyup', updateDecayProducts);
    timeUnitSelect.on('change', updateDecayProducts);


    // Listen on download button to download the time series CSV
    downloadButton.on('click', function (event) {

        event.preventDefault();

        var isotope = isotopeInput.val();
        var mass = parseFloat(massInput.val());
        var massUnit = massUnitSelect.val();

        var grams = window.Worksheet.convertMassUnitsToGrams(mass, massUnit);

        var interval = parseFloat(intervalInput.val());
        var intervalUnit = intervalUnitSelect.val();

        // Convert units on time to years
        var years = window.Worksheet.convertTimeUnitsToYears(interval, intervalUnit);

        // Generate and download the CSV
        window.Worksheet.downloadTimeSeries(isotope, mass, years);
    });

    isotopeInput.keyup();
});