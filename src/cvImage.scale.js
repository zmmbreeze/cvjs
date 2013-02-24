/*jshint undef:true, multistr:true, boss:true, eqnull:true, eqeqeq:true */
/*global cv:true, CVColor:true, CVImage:true */

// -----------------------------------------------------------------------
// cv.Image.scale
// http://en.wikipedia.org/wiki/Image_scaling
//
// example:
//      var cvImage = new cv.Image('http://someserver/logo.png');
//      cvImage.scale(100).rendTo('#canvas');
//      cvImage.scale(100, 200).rendTo('#canvas');
//      cvImage.scale(null, 200).rendTo('#canvas');
// -----------------------------------------------------------------------
var scaleAlgorithm = {
    /**
     * calculate color base on target Image, row and column.
     * Nearest-neighbor interpolation algorithm.
     *
     * @param {CVImage} cvImage target image.
     * @param {number} row float type.
     * @param {number} column float type.
     * @return {CVColor} calculated color.
     */
    nearest: function(cvImage, row, column) {
        return cvImage.getColor(
            Math.round(row),
            Math.round(column)
        );
    },
    /**
     * Bilinear interpolation algorithm.
     * http://zh.wikipedia.org/wiki/双线性插值 .
     *
     * @return {CVColor} color.
     */
    bilinear: function(cvImage, row, column) {
        var y = row,
            x = column,
            y1 = Math.floor(row),
            x1 = Math.floor(column),
            y2 = y1 + 1,
            x2 = x1 + 1,
            div = ((x2 - x1) * (y2 - y1)),
            x2_x = x2 - x,
            y2_y = y2 - y,
            x_x1 = x - x1,
            y_y1 = y - y1,
            f1 = x2_x * y2_y / div,
            f2 = x_x1 * y2_y / div,
            f3 = x2_x * y_y1 / div,
            f4 = x_x1 * y_y1 / div,
            v11 = cvImage.getColor(y1, x1),
            v12 = cvImage.getColor(y2, x1),
            v21 = cvImage.getColor(y1, x2),
            v22 = cvImage.getColor(y2, x2);
        var r = {
            r: v11.r * f1 + v21.r * f2 + v12.r * f3 + v22.r * f4,
            g: v11.g * f1 + v21.g * f2 + v12.g * f3 + v22.g * f4,
            b: v11.b * f1 + v21.b * f2 + v12.b * f3 + v22.b * f4,
            a: v11.a * f1 + v21.a * f2 + v12.a * f3 + v22.a * f4
        };
        return r;
    }
};

/**
 * Scale and generate a new image.
 *
 * @param {number | null} width new width.
 * @param {number} height new height.
 * @param {string|Function} algorithm algorithm to be use
 *  function(targetCvImage, row, column) {
 *      return targetCvImage.getColor(
 *          Math.round(row),
 *          Math.round(column)
 *      );
 *  }.
 * @return {cvImage} this.
 */
CVImage.prototype.scale = function(width, height, algorithm) {
    if ((width && (width <= 0)) ||
        (height && (height <= 0))) {
        return null;
    }

    // calculate scale
    var rowScale = height ? this.getHeight() / height : 0,
        columnScale = width ? this.getWidth() / width : 0;
    if (!rowScale && columnScale) {
        rowScale = columnScale;
        height = this.getHeight() / rowScale;
    }
    if (!columnScale && rowScale) {
        columnScale = rowScale;
        width = this.getWidth() / columnScale;
    }

    // scaling to 0x0
    if (rowScale === 0 && columnScale === 0) {
        return this.clone();
    }

    // set algorithm
    if (algorithm == null) {
        algorithm = 'bilinear';
    }
    if (typeof algorithm === 'string') {
        algorithm = scaleAlgorithm[algorithm];
    }

    // create new image
    var targetCvImage = this,
        newCvImage = CVImage.createEmptyImage(width, height);
    newCvImage.map(function(cvColor, row, column) {
        return algorithm(
            targetCvImage,
            rowScale * row,
            columnScale * column
        );
    });
    return newCvImage;
};
