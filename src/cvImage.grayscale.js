/*global cv:true, CVColor:true, CVImage:true */

// -----------------------------------------------------------------------
// cv.Image.grayscale
// -----------------------------------------------------------------------

/**
 * gray scale
 *
 * @return {CVImage} this.
 */
CVImage.prototype.grayscale = function() {
    this.map(function(cvColor, row, column) {
        var mono = Math.floor(
            (0.2125 * cvColor.r) +
            (0.7154 * cvColor.g) +
            (0.0721 * cvColor.b)
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

/**
 * desaturate
 *
 * @return {cvimage} this.
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
