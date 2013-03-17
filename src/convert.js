// date and unit conversion utilities

module.exports = {
    E : function (exponent) {
        return Math.pow(10, exponent);
    },
    years : function (years) {
        return years;
    },
    days : function (days) {
        return ( days / 365.25);
    },
    hours : function (hours) {
        return ( hours / (24 * 365.25) );
    },
    minutes : function (minutes) {
        return ( minutes / (60 * 24 * 365.25) );
    },
    seconds : function (seconds) {
        return ( seconds / (60 * 60 * 24 * 365.25) );
    },

    moles : function (moles) {
        return (moles * 6.02214179 * Math.pow(10, 23));
    }
};