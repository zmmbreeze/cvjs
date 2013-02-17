/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:true, noempty:true, regexp:false, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:true, undef:true */
/*global cv:true */

// -----------------------------------------------------------------------
// cv.Color
// -----------------------------------------------------------------------

/**
 * @class cv.Color
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @param {number} a alpha
 */
var CVColor = cv.Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};
