/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:true, noempty:true, regexp:false, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:true, undef:true */
/*global cv:true, CVColor:true */

// -----------------------------------------------------------------------
// cv.Image
// -----------------------------------------------------------------------

/**
 * @class cv.Image
 * @param {string | Object} src url | canvas | context | img
 */
var CVImage = cv.Image = function(src) {
    var me = this;
    if (typeof src === 'string') {
        CVImage.loadFromUrl(src, function(img) {
            var cvImg = new CVImage(img);
            me.imageData = cvImg.imageData;
            me._doLoadCallback();
        });
    } else {
        var cvs, ctx;
        if (src.nodeName) {
            var name = src.nodeName.toLowerCase();
            // canvas element object
            if (name === 'canvas') {
                cvs = src;
                ctx = src.getContext('2d');
            // img element object
            } else if (name === 'img') {
                cvs = document.createElement('canvas');
                cvs.width = src.width;
                cvs.height = src.height;
                ctx = cvs.getContext('2d');
                ctx.drawImage(src, 0, 0);
            } else {
                throw new Error('[cv.Image] src wasn\'t supported!');
            }
        // canvas context
        } else if (src.canvas) {
            cvs = src.canvas;
            ctx = src;
        } else {
            throw new Error('[cv.Image] src wasn\'t supported!');
        }
        me.imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
        me._loaded = true;
    }
};

/**
 * util function to load muti-urls
 *
 * @param {Array.<string>} urls
 * @param {Function} callback function(cvImgs){}
 */
CVImage.loadFromUrls = function(urls, callback) {
    var cvImgs = [],
        i, l,
        count = 0,
        cb = function(img) {
            if (img) {
                cvImgs.push(new CVImage(img));
            }
            count++;
            if (count === l) {
                callback(cvImgs);
            }
        };
    for (i=0, l=urls.length; i<l; i++) {
        this.loadFromUrl(urls[i], cb);
    }
};

/**
 * load image form url
 *
 * @param {string} url image url
 * @param {Function} callback function(img) {}
 */
CVImage.loadFromUrl = function(url, callback) {
    var img = new Image();
    img.src = url;

    // 命中缓存
    if (img.complete) {
        callback(img);
        img = null;
        return;
    }

    img.onload = function () {
        callback(img);
        img = null;
    };
    img.onabort = img.onerror = function() {
        img = null;
        callback();
    };
};

/**
 * bind callback on img loaded
 *
 * @param {Function} cb function(me){me === this;};
 * @return {Object} this
 */
CVImage.prototype.onload = function(cb) {
    if (this._loaded) {
        cb.call(this, this);
    } else {
        this._loadedCallback = this._loadedCallback || [];
        this._loadedCallback.push(cb);
    }
    return this;
};

/**
 * private function call by initial
 * to call loadedCallback
 */
CVImage.prototype._doLoadCallback = function() {
    this._loaded = true;
    if (this._loadedCallback) {
        var i, l;
        for (i=0, l=this._loadedCallback.length; i<l; i++) {
            this._loadedCallback[i].call(this, this);
        }
        this._loadedCallback = null;
    }
};

/**
 * get data
 *
 * @return {Uint8ClampedArray} data
 */
CVImage.prototype.getData = function() {
    return this.imageData.data;
};

/**
 * get width of image
 *
 * @return {Number} width
 */
CVImage.prototype.getWidth = function() {
    return this.imageData.width;
};

/**
 * get height of image
 *
 * @return {Number} height
 */
CVImage.prototype.getHeight = function() {
    return this.imageData.height;
};

/**
 * get CVColor by row and column
 *
 * @param {number} row
 * @param {number} column
 * @return {Object} color
 */
CVImage.prototype.getColor = function(row, column) {
    var data = this.imageData.data,
        i = row*(this.imageData.width*4) + column*4;
    return new CVColor(data[i], data[i+1], data[i+2], data[i+3]);
};

/**
 * get length of pixel
 *
 * @return {number}
 */
CVImage.prototype.getLength = function() {
    return this.imageData.data.length;
};

/**
 * map for pixel
 *
 * @param {Function} func function(CVColor){}
 * @return {Object} this
 */
CVImage.prototype.map = function(func) {
    var i, l, color, newColor,
        data = this.imageData.data;
    for (i=0, l=data.length; i<l; i=i+4) {
        color = new CVColor(data[i], data[i+1], data[i+2], data[i+3]);
        newColor = func.call(null, color);
        if (newColor) {
            data[i] = newColor.r;
            data[i+1] = newColor.g;
            data[i+2] = newColor.b;
            data[i+3] = newColor.a;
        }
    }
    return this;
};

/**
 * rend cvImage to html
 *
 * @param {Object} el container element or canvas
 * @return {Object} this
 */
CVImage.prototype.rendTo = function(el) {
    var cvs, ctx;
    if (el.nodeName.toLowerCase() !== 'canvas') {
        cvs = document.createElement('canvas');
        el.appendChild(cvs);
    } else {
        cvs = el;
    }
    cvs.width = this.imageData.width;
    cvs.height = this.imageData.height;
    ctx = cvs.getContext('2d');
    ctx.putImageData(this.imageData, 0, 0);
    return this;
};
