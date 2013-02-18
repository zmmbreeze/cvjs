/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:true, noempty:true, regexp:false, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:true, undef:true */
/*global cv:true, CVColor:true, CVImage:true */

// -----------------------------------------------------------------------
// cv.Image.desaturate
// 图片灰阶化
// -----------------------------------------------------------------------

/**
 * desaturate
 *
 * @return {cvimage} this
 */
CVImage.prototype.desaturate = function() {
    this.map(function(cvColor, row, column) {
        var average = (cvColor.r + cvColor.g + cvColor.b) / 3;
        return new CVColor(
            average,
            average,
            average,
            cvColor.a
        );
    });
    return this;
};
