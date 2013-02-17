/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:true, noempty:true, regexp:false, evil:false, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:true, undef:true */
/*global cv:true */

cv.Util = {
    toString: Object.prototype.toString,
    _class2type: { // Ideas from jquery, but don't use string and each to make it faster
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object'
    },
    type: function(obj) {
        return obj == null ? String(obj) : this.class2type[this.toString.call(obj)] || 'object';
    }
};
