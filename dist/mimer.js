require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"./mimer.js":[function(require,module,exports){
module.exports=require('GyUpUy');
},{}],"GyUpUy":[function(require,module,exports){
module.exports = require('./lib/exec');

},{"./lib/exec":1}],1:[function(require,module,exports){
/*
 * mimer
 * https://github.com/heldr/mimer
 *
 * Copyright (c) 2013 Helder Santana
 * Licensed under the MIT license.
 * https://raw.github.com/heldr/mimer/master/MIT-LICENSE.txt
 */

var Mimer = function (extPath) {
    if (!(this instanceof Mimer)) {
        if (extPath) {
            var mime = new Mimer();
            return mime.get(extPath);
        }
        return new Mimer();
    }

    this._loadMultipleList();
};

Mimer.prototype = {
    extGetter : require('./extensions/getter'),

    set : function ( ext , type ) {
        if (!(ext instanceof Array)) {
            if (ext.match('.')) {
                ext = ext.replace('.','');
            }
            this.list[ext] = type;
            return this;
        } else {
            for ( var i = 0; i < ext.length; i++ ) {
                this.set(ext[i], type);
            }
        }
    },

    get : function ( ext ) {
        ext = this.extGetter(ext).split('.')[1];
        return ( this.list[ext] ) ? this.list[ext] : '\nInvalid extension';
    },

    list : require('./extensions/single'),

    _loadMultipleList : function () {
        var multiple = require('./extensions/multiple');

        for (var item in multiple) {
            if ( multiple.hasOwnProperty(item) ) {
                this.set( multiple[item] , item );
            }
        }
    }
};

module.exports = Mimer;

},{"./extensions/getter":2,"./extensions/single":3,"./extensions/multiple":4}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function(process){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// based on: https://raw.github.com/joyent/node/master/lib/path.js

// verify process to ensure browser compatibility
if (process && process.platform === 'win32') {

    var splitDeviceRe =
      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

    // Regex to split the tail part of the above into [*, dir, basename, ext]
    var splitTailRe =
      /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

    // Function to split a filename into [root, dir, basename, ext]
    // windows version
    var splitPath = function(filename) {
        // Separate device+slash from tail
        var result = splitDeviceRe.exec(filename),
            device = (result[1] || '') + (result[2] || ''),
            tail = result[3] || '';
        // Split the tail into dir, basename and extension
        var result2 = splitTailRe.exec(tail),
            dir = result2[1],
            basename = result2[2],
            ext = result2[3];
        return [device, dir, basename, ext];
    };

} else {
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

    var splitPath = function(filename) {
        return splitPathRe.exec(filename).slice(1);
    };
}

function getter (path) {
    if (!path.match('.')) {
        return path;
    }

    path = splitPath(path);
    var last = path[path.length - 1];
    return (last !== '') ? last : path[path.length - 2];
}

module.exports = getter;

})(require("__browserify_process"))
},{"__browserify_process":5}],3:[function(require,module,exports){
module.exports = {
    'html' : 'text/html',
    'css' : 'text/css',
    '7z' : "application/x-7z-compressed",
    'atom' : "application/atom+xml",
    'avi' : "video/x-msvideo",
    'bmp' : "image/x-ms-bmp",
    'cco' : "application/x-cocoa",
    'doc' : "application/msword",
    'flv' : "video/x-flv",
    'gif' : "image/gif",
    'hqx' : "application/mac-binhex40",
    'htc' : "text/x-component",
    'ico' : "image/x-icon",
    'jad' : "text/vnd.sun.j2me.app-descriptor",
    'jardiff' : "application/x-java-archive-diff",
    'jng' : "image/x-jng",
    'jnlp' : "application/x-java-jnlp-file",
    'js' : "application/x-javascript",
    'kml' : "application/vnd.google-earth.kml+xml",
    'kmz' : "application/vnd.google-earth.kmz",
    'mml' : "text/mathml",
    'mng' : "video/x-mng",
    'mov' : "video/quicktime",
    'mp4' : "video/mp4",
    'ogv' : "video/ogg",
    'ogx' : "application/ogg",
    'pdf' : "application/pdf",
    'png' : "image/png",
    'ppt' : "application/vnd.ms-powerpoint",
    'ra' : "audio/x-realaudio",
    'rar' : "application/x-rar-compressed",
    'rpm' : "application/x-redhat-package-manager",
    'rtf' : "application/rtf",
    'run' : "application/x-makeself",
    'sea' : "application/x-sea",
    'sit' : "application/x-stuffit",
    'swf' : "application/x-shockwave-flash",
    'txt' : "text/plain",
    'wbmp' : "image/vnd.wap.wbmp",
    'weba' : "audio/webm",
    'webm' : "video/webm",
    'webp' : "image/webp",
    'wml' : "text/vnd.wap.wml",
    'wmlc' : "application/vnd.wap.wmlc",
    'wmv' : "video/x-ms-wmv",
    'xhtml' : "application/xhtml+xml",
    'xls' : "application/vnd.ms-excel",
    'xpi' : "application/x-xpinstall",
    'zip' : "application/zip",
    'woff': "application/x-font-woff",
    'json': "application/json"
};

},{}],4:[function(require,module,exports){
module.exports = {
    "text/xml" : ['xml','rss'],
    "image/svg+xml" : ['svg','svgz'],
    "application/x-perl" : ['pl','pm'],
    "application/x-pilot" : ['prc','pdb'],
    "application/postscript" : ['ps','eps','ai'],
    "image/tiff" : ['tif','tiff'],
    "audio/ogg" : ['oga','ogg','spx'],
    "audio/mpeg" : ['mpga','mpega','mp2','mp3','m4a'],
    "video/mpeg" : ['mpeg','mpg','mpe'],
    "application/java-archive" : ['jar','war','ear'],
    "image/jpeg" : ['jpeg','jpg'],
    "audio/midi" : ['mid','midi','kar'],
    "application/x-x509-ca-cert" : ['der','pem','crt'],
    "video/3gpp" : ['3gpp','3gp'],
    "video/x-ms-asf" : ['asx','asf'],
    "application/octet-stream" : ['bin','exe','dll','deb','dmg','eot','iso','img','msi','msp','msm','ttf']
};

},{}]},{},[])
;