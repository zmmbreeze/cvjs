/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:true, noempty:true, regexp:false, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:true, undef:true */
/*global cv:true, CVColor:true, CVImage:true */

// -----------------------------------------------------------------------
// cv.Image.grayscale
// 图片灰阶化
// -----------------------------------------------------------------------

/**
 * gray scale
 *
 * @return {CVImage} this
 */
CVImage.prototype.grayscale = function() {
    this.map(function(cvColor, row, column) {
        var mono = Math.floor(
            (0.2125 * cvColor.r)
            + (0.7154 * cvColor.g)
            + (0.0721 * cvColor.b)
        );
        return new CVColor(
            mono,
            mono,
            mono,
            cvColor.a
        );
    });
    return this;
};
