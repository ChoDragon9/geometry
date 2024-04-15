// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"xbRW":[function(require,module,exports) {
module.exports = {
  getRadian: function getRadian(angle) {
    return angle * (Math.PI / 180);
  },
  getSine: function getSine(num) {
    return Math.sin(this.getRadian(num));
  },
  getCosine: function getCosine(num) {
    return Math.cos(this.getRadian(num));
  },
  pythagoreanTheorem: function pythagoreanTheorem(x1, y1, x2, y2) {
    var xLength = Math.abs(x1 - x2);
    var yLength = Math.abs(y1 - y2);
    /**
     * It is Pythagorean theorem.
     * Math.pow(a, 2) + Math.pow(b, 2) = Math.pow(c, 2)
     */
    var lineLength = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
    return lineLength;
  },
  getAngle: function getAngle(x1, y1, x2, y2) {
    var xLength = x1 - x2;
    var yLength = y1 - y2;
    var angle = Math.atan2(xLength, yLength);
    angle *= 180 / Math.PI;
    angle *= -1;
    return angle;
  },
  getVertextAngle: function getVertextAngle(a, b, c) {
    var ab = [b[0] - a[0], b[1] - a[1]];
    var cb = [b[0] - c[0], b[1] - c[1]];
    var dot = ab[0] * cb[0] + ab[1] * cb[1]; // dot product
    var cross = ab[0] * cb[1] - ab[1] * cb[0]; // cross product
    var alpha = Math.atan2(cross, dot);
    return alpha * 180 / Math.PI;
  },
  checkLineIntersection: function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    var returnVal = true;
    var denominator = (line2EndY - line2StartY) * (line1EndX - line1StartX) - (line2EndX - line2StartX) * (line1EndY - line1StartY);
    if (denominator === 0) {
      return returnVal;
    }
    var a = line1StartY - line2StartY;
    var b = line1StartX - line2StartX;
    var numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
    var numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    /*
    // it is worth noting that this should be the same as:
    x = line2StartX + (b * (line2EndX - line2StartX));
    y = line2StartX + (b * (line2EndY - line2StartY));
    */
    // if line1 is a segment and line2 is infinite, they intersect if:
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (a > 0 && a < 1 && b > 0 && b < 1) {
      returnVal = false;
    }
    return returnVal;
  },
  getLineCenter: function getLineCenter(x1, y1, x2, y2) {
    var longX = 0;
    var shortX = 0;
    var longY = 0;
    var shortY = 0;
    var centerX = 0;
    var centerY = 0;
    if (x1 > x2) {
      longX = x1;
      shortX = x2;
    } else {
      longX = x2;
      shortX = x1;
    }
    if (y1 > y2) {
      longY = y1;
      shortY = y2;
    } else {
      longY = y2;
      shortY = y1;
    }
    centerX = (longX - shortX) / 2 + shortX;
    centerY = (longY - shortY) / 2 + shortY;
    return [centerX, centerY];
  }
};
},{}],"KjOz":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var each = function each(iter) {
  return function (list) {
    for (var i = 0, len = list.length; i < len; i++) {
      iter(list[i], i, list, len);
    }
    return list;
  };
};
var loop = function loop(iter) {
  return function (len) {
    for (var i = 0; i < len; i++) {
      iter(i, len);
    }
    return len;
  };
};
var map = function map(iter) {
  return function (list) {
    var newList = [];
    each(function (item) {
      newList.push(iter(item));
    })(list);
    return newList;
  };
};
var filter = function filter(iter) {
  return function (list) {
    var newList = [];
    each(function (item) {
      if (iter(item)) {
        newList.push(item);
      }
    })(list);
    return newList;
  };
};
var find = function find(iter) {
  return function (list) {
    for (var i = 0, len = list.length; i < len; i++) {
      if (iter(list[i], i, list)) return list[i];
    }
    return null;
  };
};
var findIndex = function findIndex(iter) {
  return function (list) {
    for (var i = 0, len = list.length; i < len; i++) {
      if (iter(list[i], i, list)) return i;
    }
    return -1;
  };
};
var reduce = function reduce(init, iter) {
  return function (list) {
    each(function (item) {
      init = iter(init, item);
    })(list);
    return init;
  };
};
var pipe = function pipe() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function (res) {
    return reduce(res, function (res, fn) {
      return fn(res);
    })(fns);
  };
};
var divEq = function divEq() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }
  return function (val) {
    // Divided Equal
    each(function (fn) {
      return fn(val);
    })(fns);
    return val;
  };
};
var isUndefined = function isUndefined(obj) {
  return typeof obj === 'undefined';
};
var negate = function negate(v) {
  return !v;
};
var clone = function clone(obj) {
  if (_typeof(obj) !== 'object') {
    return obj;
  }
  var copiedObj = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copiedObj[attr] = clone(obj[attr]);
    }
  }
  return copiedObj;
};
var merge = function merge(defaultOptions, _options) {
  var newOptions = clone(_options);
  for (var keyName in defaultOptions) {
    if (isUndefined(newOptions[keyName])) {
      newOptions[keyName] = defaultOptions[keyName];
    }
  }
  return newOptions;
};
module.exports = {
  each: each,
  loop: loop,
  map: map,
  filter: filter,
  find: find,
  findIndex: findIndex,
  reduce: reduce,
  pipe: pipe,
  divEq: divEq,
  isUndefined: isUndefined,
  negate: negate,
  clone: clone,
  merge: merge
};
},{}],"Uh1v":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * DOM 조작 객체
 */
var _ = require('./fp');
module.exports = {
  setAttr: function setAttr(attrName, val, ns) {
    !!ns && (ns = null);
    return function (element) {
      element.setAttributeNS(ns, attrName, val);
      return element;
    };
  },
  getAttr: function getAttr(attrName) {
    return function (element) {
      return element.getAttributeNS(null, attrName);
    };
  },
  setHrefAttr: function setHrefAttr(val) {
    return this.setAttr('href', val, 'http://www.w3.org/1999/xlink');
  },
  removeChild: function removeChild(parentElement, childrenElement) {
    parentElement.removeChild(childrenElement);
  },
  appendChild: function appendChild(parentElement, childrenElement) {
    parentElement.appendChild(childrenElement);
  },
  style: function style(name, value) {
    return function (elem) {
      elem.style[name] = value;
      return elem;
    };
  },
  createSVGElement: function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  },
  createLine: function createLine(strokeWidth) {
    return _.pipe(this.createSVGElement, _.divEq(this.setAttr('stroke-width', strokeWidth), this.setAttr('draggable', false)))('line');
  },
  createCircle: function createCircle(circleRadius) {
    return _.pipe(this.createSVGElement, _.divEq(this.setAttr('r', circleRadius), this.setAttr('draggable', false)))('circle');
  },
  createRect: function createRect(width, height) {
    return _.pipe(this.createSVGElement, _.divEq(this.setAttr('width', width), this.setAttr('height', height), this.setAttr('draggable', false)))('rect');
  },
  createText: function createText(txt) {
    return _.pipe(this.createSVGElement, this.setAttr('draggable', false), function (text) {
      text.textContent = txt;
      return text;
    })('text');
  },
  createGroup: function createGroup() {
    return this.createSVGElement('g');
  },
  createImage: function createImage(imagePath, width, height) {
    var imageContainner = this.createGroup();
    var image = _.pipe(this.createSVGElement, _.divEq(this.setHrefAttr(imagePath), this.setAttr('width', width), this.setAttr('height', height), this.setAttr('draggable', false)))('image');
    imageContainner.appendChild(image);
    return [image, imageContainner];
  },
  createPolygon: function createPolygon() {
    return _.pipe(this.createSVGElement, this.setAttr('draggable', false))('polygon');
  },
  createUse: function createUse() {
    return this.createSVGElement('use');
  },
  getBodyScroll: function getBodyScroll() {
    var scroll = false;
    var body = document.body;
    var html = document.documentElement;
    if (body.scrollTop !== 0 || body.scrollLeft !== 0) {
      // For Chrome, Safari, Opera
      scroll = {
        left: body.scrollLeft,
        top: body.scrollTop
      };
    } else if (html.scrollTop !== 0 || html.scrollLeft !== 0) {
      // Firefox, IE
      scroll = {
        left: html.scrollLeft,
        top: html.scrollTop
      };
    }
    return scroll;
  },
  getSVGOffset: function getSVGOffset(target) {
    return function () {
      var _target$getBoundingCl = target.getBoundingClientRect(),
        top = _target$getBoundingCl.top,
        left = _target$getBoundingCl.left,
        width = _target$getBoundingCl.width,
        height = _target$getBoundingCl.height;
      return {
        top: top,
        left: left,
        width: width,
        height: height
      };
    };
  },
  getPageAxis: function getPageAxis(element, event) {
    var _this = this;
    return _.pipe(this.getSVGOffset(element), function (_ref) {
      var left = _ref.left,
        top = _ref.top;
      return [event.pageX - left, event.pageY - top];
    }, function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        xAxis = _ref3[0],
        yAxis = _ref3[1];
      var scroll = _this.getBodyScroll();
      if (scroll) {
        xAxis -= scroll.left;
        yAxis -= scroll.top;
      }
      return [xAxis, yAxis];
    })();
  },
  getSize: function getSize(element) {
    var width = _.pipe(this.getAttr('width'), function (width) {
      return width || element.clientWidth;
    }, parseInt)(element);
    var height = _.pipe(this.getAttr('height'), function (height) {
      return height || element.clientHeight;
    }, parseInt)(element);
    return {
      width: width,
      height: height
    };
  }
};
},{"./fp":"KjOz"}],"jKlS":[function(require,module,exports) {
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
function DrawModel(draw, rootSVG) {
  var self = this;
  this.points = _.clone(draw.options.points);
  this.isAllSelected = false;
  this.setIsAllSelectedState = function (state) {
    this.isAllSelected = state;
  };
  this.modifyPoints = function (points) {
    this.setPoints(points);
    // Notify
    draw.changeAxis();
  };
  this.getRectangleIndex = function () {
    var indexList = [];
    var isFlip = draw.options.flip;
    var isMirror = draw.options.mirror;
    var isMirrorAndFlip = isFlip && isMirror;
    indexList[0] = isMirrorAndFlip ? 2 : isFlip ? 1 : isMirror ? 3 : 0;
    indexList[1] = isMirrorAndFlip ? 3 : isFlip ? 0 : isMirror ? 2 : 1;
    indexList[2] = isMirrorAndFlip ? 0 : isFlip ? 3 : isMirror ? 1 : 2;
    indexList[3] = isMirrorAndFlip ? 1 : isFlip ? 2 : isMirror ? 0 : 3;
    return indexList;
  };
  this.alignCenter = function () {
    var parentSvgSize = ElementController.getSize(rootSVG);
    var firstPoint = self.getAxis(0);
    var thirdPoint = self.getAxis(2);
    var geometryWidth = thirdPoint[0] - firstPoint[0];
    var geometryHeight = thirdPoint[1] - firstPoint[1];
    var changedX1 = Math.round(parentSvgSize.width / 2 - geometryWidth / 2);
    var changedY1 = Math.round(parentSvgSize.height / 2 - geometryHeight / 2);
    var changedX3 = changedX1 + geometryWidth;
    var changedY3 = changedY1 + geometryHeight;
    self.setAxis(0, changedX1, changedY1);
    self.setAxis(1, changedX1, changedY3);
    self.setAxis(2, changedX3, changedY3);
    self.setAxis(3, changedX3, changedY1);
    draw.changeAxis();
  };
  this.changeMinSizeOption = function (newMinSize) {
    draw.options.minSize = _.clone(newMinSize);
  };
  this.changeMaxSizeOption = function (newMaxSize) {
    draw.options.maxSize = _.clone(newMaxSize);
  };
  this.addAxis = function (xAxis, yAxis, appendIndex) {
    var lastPoint = null;
    var newPoint = null;
    var offset = ElementController.getSVGOffset(rootSVG)();
    var pointsLength = this.getPointsLength();
    if (_.isUndefined(xAxis) && _.isUndefined(yAxis)) {
      lastPoint = this.getAxis(pointsLength - 1);
      newPoint = [lastPoint[0], lastPoint[1]];
      newPoint[0] += draw.options.circleRadius;
      newPoint[1] += draw.options.circleRadius;
      if (newPoint[0] < 0) {
        newPoint[0] = 0;
      }
      if (newPoint[1] < 0) {
        newPoint[1] = 0;
      }
      if (newPoint[0] > offset.width) {
        newPoint[0] = offset.width;
      }
      if (newPoint[1] > offset.height) {
        newPoint[1] = offset.height;
      }
    } else {
      newPoint = [xAxis, yAxis];
    }
    if (_.negate(_.isUndefined(appendIndex))) {
      this.appendAxis(appendIndex, newPoint[0], newPoint[1]);
    } else {
      this.setAxis(pointsLength, newPoint[0], newPoint[1]);
    }
  };
  this.validateAxis = function (xAxis, yAxis) {
    var offset = ElementController.getSVGOffset(rootSVG)();
    var returnVal = true;
    if (xAxis < 0 || yAxis < 0 || xAxis > offset.width || yAxis > offset.height) {
      returnVal = false;
    }
    return returnVal;
  };
  this.validateAllPoint = function (movedXAxis, movedYAxis) {
    var _this = this;
    return !_.find(function (point) {
      return !_this.validateAxis(point[0] + movedXAxis, point[1] + movedYAxis);
    })(this.getPoints());
  };
}
DrawModel.prototype = {
  setPoints: function setPoints(points) {
    this.points = _.clone(points);
  },
  getPoints: function getPoints() {
    return _.clone(this.points);
  },
  getPointsLength: function getPointsLength() {
    return this.points.length;
  },
  setAxis: function setAxis(index, x, y) {
    this.points[index] = [x, y];
  },
  appendAxis: function appendAxis(index, x, y) {
    this.points.splice(index, 0, [x, y]);
  },
  getAxis: function getAxis(index) {
    return this.points[index];
  }
};
module.exports = DrawModel;
},{"../../common/ElementController":"Uh1v","../../common/fp":"KjOz"}],"EG0U":[function(require,module,exports) {
'use strict';

/**
 * Group 태그 Helper
 */
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
module.exports = function GroupHelper(draw, rootSVG) {
  // eslint-disable-line
  var groupTag = null;
  var notUseMoveTopLayer = draw.options.notUseMoveTopLayer;
  this.add = function () {
    groupTag = ElementController.createGroup();
  };
  this.remove = function () {
    ElementController.removeChild(rootSVG, groupTag);
  };
  this.moveTopLayer = function () {
    if (notUseMoveTopLayer === true) {
      return;
    }
    var lastChild = rootSVG.lastChild;
    if (lastChild !== groupTag) {
      rootSVG.insertBefore(groupTag, lastChild.nextSibling);
    }
  };
  this.append = function () {
    ElementController.appendChild(rootSVG, groupTag);
  };
  this.appendChild = function (child) {
    ElementController.appendChild(groupTag, child);
  };
  this.removeChild = function (child) {
    ElementController.removeChild(groupTag, child);
  };
  this.insertBefore = function () {
    groupTag.insertBefore.apply(groupTag, arguments);
  };
};
},{"../../common/ElementController":"Uh1v","../../common/fp":"KjOz"}],"AjX5":[function(require,module,exports) {
/**
 * Wise Face Detection 헬퍼
 */
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
module.exports = function WiseFaceDetectionHelper(draw) {
  // eslint-disable-line
  var wiseFaceDetectionCircle = null;
  var wiseFaceDetection = draw.options.wiseFaceDetection;
  function changeFillColor(fillColor) {
    ElementController.style('color', fillColor)(wiseFaceDetectionCircle);
  }
  function add() {
    wiseFaceDetectionCircle = document.createElement('span');
    wiseFaceDetectionCircle.className = 'tui tui-wn5-smile';
    ElementController.style('position', 'absolute')(wiseFaceDetectionCircle);
    changeFillColor(wiseFaceDetection.fillColor);
  }
  function append() {
    try {
      document.getElementById('sketchbook').appendChild(wiseFaceDetectionCircle);
    } catch (e) {}
  }
  function remove() {
    try {
      document.getElementById('sketchbook').removeChild(wiseFaceDetectionCircle);
    } catch (e) {}
  }
  function updateCircle(xAxis, yAxis, height) {
    var radius = height / 100;
    if ('heightRatio' in wiseFaceDetection) {
      radius *= wiseFaceDetection.heightRatio;
    } else if ('widthRatio' in wiseFaceDetection) {
      radius *= wiseFaceDetection.widthRatio;
    }
    _.divEq(ElementController.style('top', yAxis - radius + 'px'), ElementController.style('left', xAxis - radius + 'px'), ElementController.style('fontSize', radius * 2 + 'px'))(wiseFaceDetectionCircle);
  }
  if (wiseFaceDetection !== false) {
    _.isUndefined(wiseFaceDetection.fillColor) && (wiseFaceDetection.fillColor = '#dd2200');
    _.isUndefined(wiseFaceDetection.heightRatio) && (wiseFaceDetection.heightRatio = 2.2);
    _.isUndefined(wiseFaceDetection.widthRatio) && (wiseFaceDetection.widthRatio = false);
    this.updateCircle = updateCircle;
    this.append = append;
    this.add = add;
    this.remove = remove;
    this.changeFillColor = changeFillColor;
  }
};
},{"../../common/ElementController":"Uh1v","../../common/fp":"KjOz"}],"EMQ7":[function(require,module,exports) {
module.exports = "plus.5e0664fe.svg";
},{}],"wiLd":[function(require,module,exports) {
module.exports = "minus.d81cff20.svg";
},{}],"Jb2g":[function(require,module,exports) {
/**
 * 포인트 추가/삭제 아이콘
 * @example
 var iconHelper = new IconHelper();
  iconHelper.createIcon('+');
  iconHelper.changePosition(10, 10);
  iconHelper.show();

  iconHelper.hide();
  */
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
module.exports = function IconHelper(groupHelper) {
  // eslint-disable-line
  var PLUS_IMAGE = require('../../images/plus.svg');
  var MINUS_IMAGE = require('../../images/minus.svg');
  var iconText = null;
  var icon = null;
  var width = 16;
  var self = this;
  var clickEventHandler = null;
  var leaveEventHandler = null;
  var contextMenuEventHandler = null;

  /**
   * Plus, Minus 아이콘 생성
   * appendDom 시 사용
   *
   * @param {Boolean} iconType true: Plus icon, false: Minus icon
   */
  function createIcon(iconType) {
    var src = iconType ? PLUS_IMAGE : MINUS_IMAGE;
    if (icon === null) {
      icon = ElementController.createRect(width, width);
      iconText = ElementController.createImage(src, width, width)[0];
      ElementController.setAttr('fill', '#000000')(icon);
      _.each(ElementController.style('opacity', 0))([icon, iconText]);
      if (clickEventHandler !== null) {
        _.each(ElementController.style('cursor', 'pointer'))([icon, iconText]);
        icon.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          clickEventHandler(event);
        });
        iconText.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          if (clickEventHandler !== null) {
            clickEventHandler(event);
          }
        });
        iconText.addEventListener('mouseleave', function (event) {
          event.preventDefault();
          event.stopPropagation();
          if (leaveEventHandler !== null) {
            leaveEventHandler(event);
          }
        });
        iconText.addEventListener('contextmenu', function (event) {
          event.preventDefault();
          event.stopPropagation();
          if (contextMenuEventHandler !== null) {
            contextMenuEventHandler(event);
          }
        });
      }
    }
    groupHelper.appendChild(icon);
    groupHelper.appendChild(iconText);
  }
  ;
  function changePosition(x, y) {
    _.divEq(ElementController.setAttr('x', x - width / 2), ElementController.setAttr('y', y - width / 2))(icon);
    _.divEq(ElementController.setAttr('x', x - width / 2), ElementController.setAttr('y', y - width / 2))(iconText);
  }
  ;
  function show() {
    _.each(ElementController.style('opacity', 1))([icon, iconText]);
  }
  ;
  function hide() {
    if (icon === null) {
      return;
    }
    if (icon.style.opacity === '1') {
      _.each(ElementController.style('opacity', 0))([icon, iconText]);
      self.changePosition(0, 0);
    }
  }
  ;
  function onClick(callBack) {
    clickEventHandler = callBack;
  }
  ;
  function onLeave(callBack) {
    leaveEventHandler = callBack;
  }
  ;
  function onContextMenu(callBack) {
    contextMenuEventHandler = callBack;
  }
  ;
  this.createIcon = createIcon;
  this.changePosition = changePosition;
  this.show = show;
  this.hide = hide;
  this.onClick = onClick;
  this.onLeave = onLeave;
  this.onContextMenu = onContextMenu;
};
},{"../../common/ElementController":"Uh1v","../../common/fp":"KjOz","../../images/plus.svg":"EMQ7","../../images/minus.svg":"wiLd"}],"n6AC":[function(require,module,exports) {
exports.MOVED_ATTR = 'is-moved';
exports.ICON_HIDDEN_DELAY = 2000;
exports.CLICK_DETECTION_TIME = 100;
},{}],"nNCE":[function(require,module,exports) {
/**
 * Line 태그 Helper
 */
var IconHelper = require('./icon-helper');
var FunnyMath = require('../../common/FunnyMath');
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
var _require = require('../../modules/constants'),
  ICON_HIDDEN_DELAY = _require.ICON_HIDDEN_DELAY;
module.exports = function LineHelper(draw, rootSVG) {
  // eslint-disable-line
  'use strict';

  var parentSvgMovedAttr = 'is-moved';
  var lines = [];
  var tempArrForDragChecking = [];
  var iconHelper = new IconHelper(draw.groupHelper);
  var hideOpacity = '0.5';
  var hoveredLineIndex = null;
  var iconHelperTimer = null;
  var setDefaultColor = ElementController.setAttr('stroke', draw.options.lineColor);
  var setSelectColor = setDefaultColor;
  iconHelper.onClick(function (event) {
    backupPoints(); // addPointInLine에서 드래그 체크를 하기 때문에 추가
    addPointInLine.call({
      lineIndex: hoveredLineIndex
    }, event);
    iconHelper.hide();
  });
  iconHelper.onLeave(iconHelper.hide);
  function backupPoints() {
    tempArrForDragChecking = draw.drawModel.getPoints();
  }
  function isPointsChanged() {
    var currentPoints = draw.drawModel.getPoints();
    if (tempArrForDragChecking.length !== currentPoints.length) {
      return false;
    }
    return _.pipe(_.findIndex(function (item, index) {
      return item[0] !== currentPoints[index][0] || item[1] !== currentPoints[index][1];
    }), function (index) {
      tempArrForDragChecking = [];
      return index === -1;
    })(tempArrForDragChecking);
  }
  function addLine(useLineEvent, useLineCursor) {
    var newLine = ElementController.createLine(draw.options.lineStrokeWidth);
    newLine.lineIndex = lines.length;
    if (draw.options.useEvent === true && useLineEvent !== false) {
      bindEvent(newLine);
    }
    setDefaultColor(newLine);
    if (useLineCursor !== false) {
      draw.drawView.setCursor(newLine);
    }
    lines.push(newLine);
  }
  function hide(lineElement) {
    if (draw.options.fill === true) {
      ElementController.style('display', 'none')(lineElement);
    } else {
      ElementController.style('opacity', hideOpacity)(lineElement);
    }
  }
  function show(lineElement) {
    if (draw.options.fill === true) {
      ElementController.style('display', 'inline')(lineElement);
    } else {
      ElementController.style('opacity', 1)(lineElement);
    }
  }
  function showPointIcon(event) {
    clearTimeout(iconHelperTimer);
    if (ElementController.getAttr(parentSvgMovedAttr)(rootSVG) === 'true' ||
    // 폴리건 드래그를 하고 있을 때
    draw.selectedLineIndex !== null ||
    // 드래그를 하고 있을 때
    this.style.opacity === hideOpacity ||
    // 선택된 오브젝트가 아닐 때
    draw.drawModel.getPointsLength() >= draw.options.maxPoint) {
      // 최대 포인트일 때
      return;
    }
    var pageAxis = ElementController.getPageAxis(rootSVG, event);
    var xAxis = pageAxis[0];
    var yAxis = pageAxis[1];
    var leftAxis = null;
    var rightAxis = null;
    if (draw.options.minLineLength !== false) {
      leftAxis = draw.drawModel.getAxis(this.lineIndex);
      rightAxis = draw.drawModel.getAxis(this.lineIndex === lines.length - 1 ? 0 : this.lineIndex + 1);
      if (FunnyMath.pythagoreanTheorem(xAxis, yAxis, leftAxis[0], leftAxis[1]) < draw.options.minLineLength || FunnyMath.pythagoreanTheorem(xAxis, yAxis, rightAxis[0], rightAxis[1]) < draw.options.minLineLength) {
        return;
      }
    }
    iconHelper.changePosition(pageAxis[0], pageAxis[1]);
    hoveredLineIndex = this.lineIndex;
    iconHelper.show();
    iconHelperTimer = setTimeout(function () {
      iconHelper.hide();
    }, ICON_HIDDEN_DELAY);
  }
  function mouseUpHandler() {
    setTimeout(function () {
      draw.callCustomEvent('mouseup', draw.getData());
    });
  }
  function contextMenuHandler(event) {
    draw.callCustomEvent('linecontextmenu', event);
  }
  function bindEvent(lineElement) {
    lineElement.addEventListener('contextmenu', contextMenuHandler);
    if (draw.options.useOnlyRectangle === false && draw.options.fixedRatio === false) {
      // Add Point
      lineElement.addEventListener('mousemove', showPointIcon);
      if (draw.options.fill === false) {
        iconHelper.onContextMenu(contextMenuHandler);
        lineElement.addEventListener('mousedown', selectLine);
        lineElement.addEventListener('mouseup', mouseUpHandler);
        lineElement.addEventListener('mouseleave', function () {
          if (this.isSelected === true) {
            mouseUpHandler();
          }
        });
      }
    }
  }
  function addPointInLine(event) {
    var pageAxis = null;
    var xAxis = null;
    var yAxis = null;
    if (isPointsChanged() === false) {
      // console.log("isPointsChanged() === false return");
      return;
    }
    if (draw.drawModel.getPointsLength() >= draw.options.maxPoint) {
      // console.log("pointsLength >= draw.options.maxPoint return");
      return;
    }
    pageAxis = ElementController.getPageAxis(rootSVG, event);
    xAxis = pageAxis[0];
    yAxis = pageAxis[1];
    draw.addPoint(xAxis, yAxis, this.lineIndex + 1);
    mouseUpHandler();
  }
  function appendAll() {
    _.each(function (line) {
      return draw.groupHelper.appendChild(line);
    })(lines);
    iconHelper.createIcon(true);
  }
  function selectLine() {
    setSelectColor(this);
    this.isSelected = true;
    draw.groupHelper.moveTopLayer();
    backupPoints();
  }
  function appendAtLast() {
    var lineLength = lines.length;
    var newLineElement = lines[lineLength - 1];
    var nextElementSibling = lines[lineLength - 2].nextElementSibling;
    draw.groupHelper.insertBefore(newLineElement, nextElementSibling);
  }
  function removeAll() {
    _.each(function (line) {
      return draw.groupHelper.removeChild(line);
    })(lines);
  }
  function getLines() {
    return lines;
  }
  function setLines(_lines) {
    lines = _lines;
  }
  this.addLine = addLine;
  this.setDefaultColor = setDefaultColor;
  this.setSelectColor = setSelectColor;
  this.appendAll = appendAll;
  this.appendAtLast = appendAtLast;
  this.bindEvent = bindEvent;
  this.removeAll = removeAll;
  this.hide = hide;
  this.show = show;
  this.getLines = getLines;
  this.setLines = setLines;
};
},{"./icon-helper":"Jb2g","../../common/FunnyMath":"xbRW","../../common/ElementController":"Uh1v","../../common/fp":"KjOz","../../modules/constants":"n6AC"}],"EDWs":[function(require,module,exports) {
/**
 * Polygon과 Line 꼭지점 Helper
 */
var IconHelper = require('./icon-helper');
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
var _require = require('../../modules/constants'),
  ICON_HIDDEN_DELAY = _require.ICON_HIDDEN_DELAY;
module.exports = function CircleHelper(draw, rootSVG) {
  // eslint-disable-line
  var isLeave = false;
  var iconHelper = new IconHelper(draw.groupHelper);
  var iconHelperTimer = null;
  var hoveredPointIndex = null;
  var circles = [];
  var setDefaultColor = ElementController.setAttr('fill', draw.options.pointColor);
  var setSelectColor = setDefaultColor;
  iconHelper.onClick(function (event) {
    iconHelper.hide();
    removeCircle.call({
      circleIndex: hoveredPointIndex
    }, event);
    update();
  });
  function addCircle(radius, useCircleEvent, useCircleCursor) {
    var newCircle = ElementController.createRect(radius * 2, radius * 2);
    if (draw.options.useResizeRectangle === true || draw.options.useEvent === true && useCircleEvent !== false) {
      bindEvent(newCircle);
    }
    setDefaultColor(newCircle);
    if (useCircleCursor !== false) {
      draw.drawView.setCursor(newCircle);
    }
    newCircle.circleIndex = circles.length;
    circles.push(newCircle);
  }
  function bindEvent(circleElement) {
    circleElement.onmousedown = selectCircle;
    circleElement.onmouseup = function () {
      isLeave = false;
      if (draw.options.customDraw === true) {
        return;
      }
      update();
    };
    circleElement.addEventListener('mouseleave', function () {
      isLeave = true;
    });
    if (draw.options.fixedRatio !== true) {
      circleElement.customContextmenu = removeCircle;
      circleElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      circleElement.addEventListener('mouseover', showDeleteIcon);
      circleElement.addEventListener('mouseout', hideDeleteIconWithDelay);
      circleElement.addEventListener('mousedown', hideDeleteIcon);
    }
  }
  function showDeleteIcon() {
    var pointsLength = draw.drawModel.getPointsLength();
    if (draw.selectedCircleIndex !== null || pointsLength <= draw.options.minPoint) {
      // 최대 포인트일 때
      return;
    }
    hoveredPointIndex = this.circleIndex;
    var xAxis = parseInt(ElementController.getAttr('x')(this));
    var yAxis = parseInt(ElementController.getAttr('y')(this));
    var width = parseInt(ElementController.getAttr('width')(this));
    var height = parseInt(ElementController.getAttr('height')(this));
    if (xAxis - width * 2 < 0) {
      xAxis += width * 2;
    } else {
      xAxis -= width;
    }
    if (yAxis - width * 2 < 0) {
      yAxis += height * 2;
    } else {
      yAxis -= height;
    }
    clearTimeout(iconHelperTimer);
    iconHelper.changePosition(xAxis, yAxis);
    iconHelper.show();
  }
  function hideDeleteIcon() {
    iconHelper.hide();
  }
  function hideDeleteIconWithDelay() {
    clearTimeout(iconHelperTimer);
    iconHelperTimer = setTimeout(function () {
      iconHelper.hide();
    }, ICON_HIDDEN_DELAY);
  }
  function update() {
    setTimeout(function () {
      draw.callCustomEvent('mouseup', draw.getData());
    });
  }
  function isMouseLeave() {
    return isLeave;
  }
  function removeCircle(event) {
    var self = this;
    var points = draw.drawModel.getPoints();
    var pointsLength = points.length;
    event.preventDefault();
    if (pointsLength <= draw.options.minPoint) {
      return;
    }
    if (this.nodeName === 'text') {
      self = circles[pointsLength - 1];
    }
    points.splice(self.circleIndex, 1);
    draw.drawModel.setPoints(points);
    draw.reset();
    draw.init();
    draw.drawView.changeActiveStatus();
  }
  function selectCircle() {
    isLeave = false;
    var self = this;
    var pointsLength = draw.drawModel.getPointsLength();
    if (this.nodeName === 'text') {
      self = circles[pointsLength - 1];
    }
    setSelectColor(self);
    self.isSelected = true;
    draw.drawView.setCursor(rootSVG);
  }
  function appendAll() {
    _.each(function (circle) {
      return draw.groupHelper.appendChild(circle);
    })(circles);
    iconHelper.createIcon(false);
  }
  function changeRadius(index, radius) {
    _.divEq(ElementController.setAttr('width', radius * 2), ElementController.setAttr('height', radius * 2))(circles[index]);
  }
  function appendAtLast() {
    var circleLength = circles.length;
    var newCircleElement = circles[circleLength - 1];
    var nextElementSibling = circles[circleLength - 2].nextElementSibling;
    if (draw.options.textInCircle === null || nextElementSibling === null) {
      draw.groupHelper.appendChild(newCircleElement);
    } else {
      draw.groupHelper.insertBefore(newCircleElement, nextElementSibling);
    }
  }
  function removeAll() {
    _.each(function (circle) {
      draw.groupHelper.removeChild(circle);
    })(circles);
  }
  function getCircles() {
    return circles;
  }
  function setCircles(_circles) {
    circles = _circles;
  }
  this.addCircle = addCircle;
  this.bindEvent = bindEvent;
  this.selectCircle = selectCircle;
  this.setDefaultColor = setDefaultColor;
  this.setSelectColor = setSelectColor;
  this.appendAll = appendAll;
  this.changeRadius = changeRadius;
  this.appendAtLast = appendAtLast;
  this.removeAll = removeAll;
  this.update = update;
  this.isMouseLeave = isMouseLeave;
  this.hide = ElementController.style('display', 'none');
  this.show = ElementController.style('display', 'inline');
  this.getCircles = getCircles;
  this.setCircles = setCircles;
};
},{"./icon-helper":"Jb2g","../../common/ElementController":"Uh1v","../../common/fp":"KjOz","../../modules/constants":"n6AC"}],"oslI":[function(require,module,exports) {
/**
 * Text 태그 헬퍼
 */
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
module.exports = function TextTagHelper(draw, rootSVG) {
  // eslint-disable-line
  var textTag = null;
  function addText() {
    if (draw.options.textInCircle !== null) {
      textTag = _.pipe(ElementController.createText, _.divEq(ElementController.style('fontSize', '12px'), draw.drawView.setCursor))(draw.options.textInCircle);
      bindEvent();
    }
  }
  function bindEvent() {
    var circles = draw.circleHelper.getCircles();
    var pointsLength = draw.drawModel.getPointsLength();
    var lastCircle = circles[pointsLength - 1];
    textTag.onmousedown = lastCircle.onmousedown;
    textTag.onmouseup = lastCircle.onmouseup;
    if (draw.options.fixedRatio !== true) {
      textTag.addEventListener('contextmenu', lastCircle.customContextmenu);
    }
  }
  function append() {
    if (draw.options.textInCircle !== null) {
      draw.groupHelper.appendChild(textTag);
    }
  }
  function remove() {
    if (draw.options.textInCircle !== null) {
      draw.groupHelper.removeChild(textTag);
    }
  }
  function show() {
    if (draw.options.textInCircle !== null) {
      ElementController.style('display', 'inline')(textTag);
    }
  }
  function hide() {
    if (draw.options.textInCircle !== null) {
      ElementController.style('display', 'none')(textTag);
    }
  }
  function getTextTag() {
    return textTag;
  }
  function setTextTag(_textTag) {
    textTag = _textTag;
  }
  this.addText = addText;
  this.append = append;
  this.remove = remove;
  this.show = show;
  this.hide = hide;
  this.getTextTag = getTextTag;
  this.setTextTag = setTextTag;
};
},{"../../common/ElementController":"Uh1v","../../common/fp":"KjOz"}],"xwqZ":[function(require,module,exports) {
/**
 * Polygon 태그 헬퍼
 */
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
module.exports = function PolygonHelper(draw, rootSVG) {
  // eslint-disable-line
  'use strict';

  var polygon = null;
  function addPolygon() {
    polygon = ElementController.createPolygon();
    if (draw.options.useEvent === true) {
      bindEvent(polygon);
    }
    draw.drawView.setCursor(polygon);
  }
  function append() {
    if (draw.options.fill === true) {
      draw.groupHelper.appendChild(polygon);
    }
  }
  function selectPolygon() {
    setSelectColor();
    polygon.isSelected = true;
    draw.groupHelper.moveTopLayer();
  }
  function bindEvent() {
    polygon.onmousedown = selectPolygon;
    /*
    @date: 2016-09-19
    oncontextmenu로 하면 IE에서 정상 동작을 하지 않기 때문에 삭제됨.
    polygon.oncontextmenu = function(event){
      draw.callCustomEvent("polygoncontextmenu", event);
    };
    */
    polygon.onmouseup = function () {
      if (draw.options.customDraw === true) {
        return;
      }
      update();
    };
    polygon.addEventListener('mouseleave', function () {
      if (polygon.isSelected === true) {
        update();
      }
    });
    polygon.addEventListener('contextmenu', function (event) {
      draw.callCustomEvent('polygoncontextmenu', event);
    });
  }
  function remove() {
    if (draw.options.fill === true) {
      draw.groupHelper.removeChild(polygon);
    }
  }
  function setDefaultColor() {
    if (draw.options.fill === true) {
      _.divEq(ElementController.style('fill', draw.options.fillColor), ElementController.style('opacity', draw.options.fillOpacity))(polygon);
    }
  }
  function setSelectColor() {
    if (polygon === null) {
      return;
    }
    var opacity = draw.options.fillOpacity;
    if (opacity > 0) {
      opacity = opacity + opacity * 0.5;
    }
    ElementController.style('opacity', opacity);
  }
  function update() {
    setTimeout(function () {
      draw.callCustomEvent('mouseup', draw.getData());
    });
  }
  function getPolygon() {
    return polygon;
  }
  function setPolygon(_polygon) {
    polygon = _polygon;
  }
  this.addPolygon = addPolygon;
  this.append = append;
  this.bindEvent = bindEvent;
  this.selectPolygon = selectPolygon;
  this.remove = remove;
  this.setDefaultColor = setDefaultColor;
  this.setSelectColor = setSelectColor;
  this.getPolygon = getPolygon;
  this.setPolygon = setPolygon;
};
},{"../../common/ElementController":"Uh1v","../../common/fp":"KjOz"}],"UKN0":[function(require,module,exports) {
module.exports = "btn_in-out_normal.fdb8c67a.png";
},{}],"OVyW":[function(require,module,exports) {
module.exports = "btn_in-out_press.dffd9e67.png";
},{}],"jXEY":[function(require,module,exports) {
module.exports = "btn_all_normal.ebffad16.png";
},{}],"aWwW":[function(require,module,exports) {
module.exports = "btn_all_press.815fb70d.png";
},{}],"xUQg":[function(require,module,exports) {
/**
 * 화살표 이미지 Helper
 */
var ElementController = require('../../common/ElementController');
var FunnyMath = require('../../common/FunnyMath');
var _ = require('../../common/fp');
module.exports = function ArrowImageHelper(draw, rootSVG) {
  // eslint-disable-line
  'use strict';

  var IMAGE_WIDTH = 25;
  var IMAGE_HEIGHT = 33;
  var NORMAL_IMAGE = require('../../images/btn_in-out_normal.png');
  var PRESS_IMAGE = require('../../images/btn_in-out_press.png');
  var NORMAL_ALL_IMAGE = require('../../images/btn_all_normal.png');
  var PRESS_ALL_IMAGE = require('../../images/btn_all_press.png');
  var arrowImageContainner = null;
  var arrowImage = null;
  var halfArrowWidth = IMAGE_WIDTH / 2;
  var halfArrowHeight = IMAGE_HEIGHT / 2;
  var arrowTextContainner = null;
  var arrowText = [];
  var arrowQueue = ['L', 'R', 'LR'];
  var arrowQueueLength = arrowQueue.length;
  var arrowScope = [];
  var currentArrow = null;

  // set Scope of Arrow
  // @ArrowImageView
  function setArrowScope() {
    var startIndex = _.findIndex(function (arrow) {
      return arrow === draw.options.arrow.min;
    })(arrowQueue);
    var endIndex = _.findIndex(function (arrow) {
      return arrow === draw.options.arrow.max;
    })(arrowQueue);
    for (var i = startIndex; i <= endIndex; i++) {
      arrowScope.push(arrowQueue[i]);
    }
  }

  // @ArrowImageView
  function getNextArrow(arrow) {
    var nextIndex = _.findIndex(function (item, index, list) {
      return item === arrow && list.length - 1 !== index;
    })(arrowScope) + 1;
    return arrowQueue[nextIndex];
  }

  // @ArrowImageView
  function addArrowGuideText() {
    if (draw.options.arrow === null) {
      return;
    }
    if (_.negate(_.isUndefined(draw.options.arrow.text)) && draw.options.arrow.text === true) {
      arrowTextContainner = ElementController.createGroup();
      arrowText[0] = ElementController.createText('A');
      arrowText[1] = ElementController.createText('B');
      ElementController.appendChild(arrowTextContainner, arrowText[0]);
      ElementController.appendChild(arrowTextContainner, arrowText[1]);
    }
  }
  function show() {
    _.each(ElementController.style('display', 'inline'))([arrowImage, arrowTextContainner]);
  }
  function hide() {
    _.each(ElementController.style('display', 'none'))([arrowImage, arrowTextContainner]);
  }
  function changeArrowGuideText(xAxis, yAxis, angle) {
    var radius = halfArrowWidth + 20;
    var textHalfWidth = 4;
    var textHalfHeight = 6;
    var getXAxisOfText = function getXAxisOfText(angle) {
      return FunnyMath.getCosine(angle) * radius - textHalfWidth;
    };
    var getYAxisOfText = function getYAxisOfText(angle) {
      return FunnyMath.getSine(angle) * radius + textHalfHeight;
    };
    var axis = [{
      x: getXAxisOfText(angle + 180),
      y: getYAxisOfText(angle + 180)
    }, {
      x: getXAxisOfText(angle),
      y: getYAxisOfText(angle)
    }];
    if (arrowTextContainner !== null) {
      _.divEq(ElementController.setAttr('x', xAxis + axis[0].x), ElementController.setAttr('y', yAxis + axis[0].y))(arrowText[0]);
      _.divEq(ElementController.setAttr('x', xAxis + axis[1].x), ElementController.setAttr('y', yAxis + axis[1].y))(arrowText[1]);
    }
  }
  function addImage() {
    if (draw.useArrow === true) {
      var imagePath = draw.options.arrow.mode === arrowQueue[arrowQueueLength - 1] ? NORMAL_ALL_IMAGE : NORMAL_IMAGE;
      var createdImage = ElementController.createImage(imagePath, IMAGE_WIDTH, IMAGE_HEIGHT, true);
      arrowImage = createdImage[0];
      arrowImageContainner = createdImage[1];
      addArrowGuideText();
      draw.drawView.setCursor(arrowImage);
      bindEvent();
      changeArrow(draw.options.arrow.mode);
    }
  }
  function changeArrow(arrow) {
    currentArrow = arrow;
    changeArrowImage();
    changeArrowImagePath();
  }
  function getArrow() {
    return currentArrow;
  }
  function changeArrowImage() {
    var startAxis = draw.drawModel.getAxis(0);
    var endAxis = draw.drawModel.getAxis(1);
    var angle = FunnyMath.getAngle(startAxis[0], startAxis[1], endAxis[0], endAxis[1]);
    var textAngle = angle;
    var degree = currentArrow === arrowQueue[1] ? 90 : 270;
    var lineCenter = FunnyMath.getLineCenter(startAxis[0], startAxis[1], endAxis[0], endAxis[1]);
    var xAxis = lineCenter[0];
    var yAxis = lineCenter[1];
    _.divEq(ElementController.setAttr('x', xAxis), ElementController.setAttr('y', yAxis))(arrowImage);
    if (draw.options.notUseAutoChangeOfArrow !== true) {
      if (Math.abs(angle) > 90) {
        degree = degree === 90 ? 270 : 90;
        textAngle -= 180;
      }
    }
    changeArrowGuideText(xAxis, yAxis, textAngle);
    angle += degree;
    ElementController.setAttr('transform', "rotate(".concat(angle, " ").concat(xAxis, " ").concat(yAxis, ") translate(").concat(halfArrowWidth * -1, ",").concat(halfArrowHeight * -1, ")"))(arrowImageContainner);
  }
  function changeArrowImagePath() {
    var imagePath = currentArrow === arrowQueue[arrowQueueLength - 1] ? NORMAL_ALL_IMAGE : NORMAL_IMAGE;
    ElementController.setHrefAttr(imagePath)(arrowImage);
  }
  function bindEvent() {
    if (draw.options.useEvent === true) {
      arrowImage.onclick = function (event) {
        event.stopPropagation();
      };
      arrowImage.onmousedown = function (event) {
        event.stopPropagation();
        var imagePath = currentArrow === arrowQueue[arrowQueueLength - 1] ? PRESS_ALL_IMAGE : PRESS_IMAGE;
        arrowImage.isSelected = true;
        ElementController.setHrefAttr(imagePath)(arrowImage);
      };
      arrowImage.onmouseup = function (event) {
        event.stopPropagation();
        if (arrowImage.isSelected === true) {
          var arrow = getNextArrow(currentArrow);
          arrowImage.isSelected = false;
          changeArrow(arrow);
          draw.callCustomEvent('mouseup', draw.getData());
        }
      };
      arrowImage.onmouseleave = function (event) {
        event.stopPropagation();
        if (arrowImage.isSelected === true) {
          arrowImage.onmouseup(event);
        }
      };
    }
  }
  function remove() {
    if (draw.useArrow === true) {
      arrowImageContainner.removeChild(arrowImage);
      draw.groupHelper.removeChild(arrowImageContainner);
      if (arrowTextContainner !== null) {
        arrowTextContainner.removeChild(arrowText[0]);
        arrowTextContainner.removeChild(arrowText[1]);
        draw.groupHelper.removeChild(arrowTextContainner);
      }
    }
  }
  function append() {
    if (arrowImageContainner !== null) {
      arrowImageContainner.appendChild(arrowImage);
      draw.groupHelper.appendChild(arrowImageContainner);
    }
    if (arrowTextContainner !== null) {
      arrowTextContainner.appendChild(arrowText[0]);
      arrowTextContainner.appendChild(arrowText[1]);
      draw.groupHelper.appendChild(arrowTextContainner);
    }
  }
  if (draw.useArrow === true) {
    setArrowScope();
  }
  function resetData() {
    arrowImageContainner = null;
    arrowImage = null;
    arrowTextContainner = null;
    arrowText = [];
  }
  this.addImage = addImage;
  this.append = append;
  this.remove = remove;
  this.getArrow = getArrow;
  this.changeArrowImage = changeArrowImage;
  this.changeArrow = changeArrow;
  this.show = show;
  this.hide = hide;
  this.resetData = resetData;
};
},{"../../common/ElementController":"Uh1v","../../common/FunnyMath":"xbRW","../../common/fp":"KjOz","../../images/btn_in-out_normal.png":"UKN0","../../images/btn_in-out_press.png":"OVyW","../../images/btn_all_normal.png":"jXEY","../../images/btn_all_press.png":"aWwW"}],"XfI7":[function(require,module,exports) {
/**
 * 이벤트 조작 객체
 */
module.exports = {
  bindEvent: function bindEvent(name, callback) {
    return function (element) {
      element.addEventListener(name, callback);
      return element;
    };
  },
  unbindEvent: function unbindEvent(name, callback) {
    return function (element) {
      element.removeEventListener(name, callback);
      return element;
    };
  },
  bindBodyEvent: function bindBodyEvent(name, callback) {
    return this.bindEvent(name, callback)(document.body);
  },
  unbindBodyEvent: function unbindBodyEvent(name, callback) {
    return this.unbindEvent(name, callback)(document.body);
  }
};
},{}],"ybtO":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var GroupHelper = require('./group-helper');
var WiseFaceDetectionHelper = require('./wise-facedetection-helper');
var LineHelper = require('./line-helper');
var CircleHelper = require('./circle-helper');
var TextTagHelper = require('./text-helper');
var PolygonHelper = require('./polygon-helper');
var ArrowImageHelper = require('./arrow-image-helper');
var ElementController = require('../../common/ElementController');
var FunnyMath = require('../../common/FunnyMath');
var EventController = require('../../common/EventController');
var _ = require('../../common/fp');
var _require = require('../../modules/constants'),
  MOVED_ATTR = _require.MOVED_ATTR;
module.exports = function DrawView(draw, rootSVG) {
  // eslint-disable-line
  var TEXT_POINT_RADIUS = 1.5;
  var parentSvgRatio = [];
  var parentSvgStartAxis = null;
  var selectedPolygon = null;
  var drawView = this;
  draw.selectedCircleIndex = null;
  draw.selectedLineIndex = null;
  draw.groupHelper = new GroupHelper(draw, rootSVG);
  draw.wiseFaceDetectionHelper = new WiseFaceDetectionHelper(draw, rootSVG);
  draw.lineHelper = new LineHelper(draw, rootSVG);
  draw.circleHelper = new CircleHelper(draw, rootSVG);
  draw.textTagHelper = new TextTagHelper(draw, rootSVG);
  draw.polygonHelper = new PolygonHelper(draw, rootSVG);
  draw.arrowImageHelper = new ArrowImageHelper(draw, rootSVG);
  this.getArrow = draw.arrowImageHelper.getArrow;
  this.changeArrow = draw.arrowImageHelper.changeArrow;
  this.moveTopLayer = draw.groupHelper.moveTopLayer;
  this.changeFillColor = draw.wiseFaceDetectionHelper.changeFillColor;
  this.changeAxis = function () {
    var polygonPoint = '';
    var height = 0;
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    var textTag = draw.textTagHelper.getTextTag();
    var polygon = draw.polygonHelper.getPolygon();
    var points = draw.drawModel.getPoints();
    _.each(function (line, index, lines, len) {
      var endAxisIndex = draw.options.fill === true && index === len - 1 ? 0 : index + 1;
      var _points$index = _slicedToArray(points[index], 2),
        x1 = _points$index[0],
        y1 = _points$index[1];
      var _points$endAxisIndex = _slicedToArray(points[endAxisIndex], 2),
        x2 = _points$endAxisIndex[0],
        y2 = _points$endAxisIndex[1];
      _.divEq(ElementController.setAttr('x1', x1), ElementController.setAttr('y1', y1), ElementController.setAttr('x2', x2), ElementController.setAttr('y2', y2))(line);
    })(lines);
    _.each(function (circle, index, _, len) {
      var pointAxis = points[index];
      var circleXAxis = pointAxis[0];
      var circleYAxis = pointAxis[1];
      var width = parseInt(ElementController.getAttr('width')(circle));
      var height = parseInt(ElementController.getAttr('height')(circle));

      /**
       * 고정비 사각형일 때, 부모의 영역를 넘어갈 경우 Safari에서
       * 정상적으로 Cursor가 지정이 안되므로 2px 이동 시킨다.
       */
      if (draw.options.fixedRatio === false && draw.options.useOnlyRectangle === false) {
        circleXAxis -= width / 2;
        circleYAxis -= height / 2;
      } else if (draw.options.fixedRatio === true) {
        switch (index) {
          case draw.rectangleIndex[0]:
            circleXAxis -= width - draw.options.lineStrokeWidth / 2;
            circleYAxis -= height - draw.options.lineStrokeWidth / 2;
            break;
          case draw.rectangleIndex[1]:
            circleXAxis -= draw.options.lineStrokeWidth / 2;
            circleYAxis -= height - draw.options.lineStrokeWidth / 2;
            break;
          case draw.rectangleIndex[2]:
            circleXAxis -= width - draw.options.lineStrokeWidth / 2;
            circleYAxis -= height - draw.options.lineStrokeWidth / 2;
            break;
          case draw.rectangleIndex[3]:
            circleXAxis -= width - draw.options.lineStrokeWidth / 2;
            circleYAxis -= draw.options.lineStrokeWidth / 2;
            break;
        }
      }
      circle.setAttributeNS(null, 'x', circleXAxis);
      circle.setAttributeNS(null, 'y', circleYAxis);
      if (index === len - 1 && draw.options.textInCircle !== null) {
        textTag.setAttributeNS(null, 'x', pointAxis[0] - 3);
        textTag.setAttributeNS(null, 'y', pointAxis[1] + 4);
      }
      if (draw.options.fill === true) {
        polygonPoint += pointAxis[0] + ',' + pointAxis[1] + ' ';
      }
    })(circles);
    if (draw.options.fill === true) {
      polygon.setAttributeNS(null, 'points', polygonPoint.replace(/[\s]{1}$/, ''));
    }
    if (draw.useArrow === true) {
      draw.arrowImageHelper.changeArrowImage();
    }
    if (draw.options.wiseFaceDetection !== false) {
      var firstPoint = points[0];
      var secondPoint = points[1];
      var thridPoint = points[2];
      var xAxis = FunnyMath.getLineCenter(secondPoint[0], secondPoint[1], thridPoint[0], thridPoint[1])[0];
      var yAxis = FunnyMath.getLineCenter(firstPoint[0], firstPoint[1], secondPoint[0], secondPoint[1])[1];
      height = 0;
      if ('heightRatio' in draw.options.wiseFaceDetection) {
        height = firstPoint[1] - secondPoint[1];
      } else if ('widthRatio' in draw.options.wiseFaceDetection) {
        height = firstPoint[0] - secondPoint[0];
      }
      height = Math.abs(height);
      draw.wiseFaceDetectionHelper.updateCircle(xAxis, yAxis, height);
    }
  };
  this.resetAllColor = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    _.each(function (line) {
      return draw.lineHelper.setDefaultColor(line);
    })(lines);
    _.each(function (circle) {
      return draw.lineHelper.setDefaultColor(circle);
    })(circles);
    draw.polygonHelper.setDefaultColor();
  };
  this.setAllColor = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    _.each(function (line) {
      return draw.lineHelper.setSelectColor(line);
    })(lines);
    _.each(function (circle) {
      return draw.lineHelper.setSelectColor(circle);
    })(circles);
    draw.polygonHelper.setSelectColor();
  };
  this.setCursor = function (element) {
    ElementController.style('cursor', draw.options.useCursor ? 'pointer' : 'default')(element);
  };
  this.resetCursor = function (element) {
    ElementController.style('cursor', 'default')(element);
  };
  this.createSVGElement = function () {
    var radius = draw.options.circleRadius;
    var pointsLength = draw.drawModel.getPointsLength();
    var addLine = function addLine() {
      if (draw.options.fixedRatio === true) {
        draw.lineHelper.addLine(false, false);
      } else {
        draw.lineHelper.addLine();
      }
    };
    _.loop(function (i, len) {
      if (i < len - 1) {
        addLine();
      } else {
        if (draw.options.textInCircle !== null) {
          radius *= TEXT_POINT_RADIUS;
        }
        if (draw.options.fill === true) {
          addLine();
          draw.polygonHelper.addPolygon();
        }
      }
      if (draw.options.fixedRatio === true) {
        if (i === draw.rectangleIndex[2]) {
          draw.circleHelper.addCircle(radius);
        } else {
          // Circle을 작게 그려서 안보이게 함.
          draw.circleHelper.addCircle(0, false, false);
        }
      } else {
        draw.circleHelper.addCircle(radius);
      }
    })(pointsLength);
    draw.textTagHelper.addText();
    draw.arrowImageHelper.addImage();
    draw.groupHelper.add();
    if (draw.options.wiseFaceDetection !== false) {
      draw.wiseFaceDetectionHelper.add();
    }
  };
  this.appendDom = function () {
    // appending sequense is important.
    // Group -> Polygon -> Line -> Circle -> Text
    draw.groupHelper.append();
    draw.polygonHelper.append();
    draw.lineHelper.appendAll();
    draw.circleHelper.appendAll();
    draw.textTagHelper.append();
    draw.arrowImageHelper.append();
    if (draw.options.wiseFaceDetection !== false) {
      draw.wiseFaceDetectionHelper.append();
    }
  };
  this.resetParentSvgAttr = function () {
    window.setTimeout(function () {
      ElementController.setAttr(MOVED_ATTR, false)(rootSVG);
    }, 100);
  };
  this.removeAllElement = function () {
    try {
      draw.lineHelper.removeAll();
      draw.circleHelper.removeAll();
      draw.polygonHelper.remove();
      draw.textTagHelper.remove();
      draw.arrowImageHelper.remove();
      if (draw.options.wiseFaceDetection !== false) {
        draw.wiseFaceDetectionHelper.remove();
      }
      draw.groupHelper.remove();
    } catch (e) {
      /**
       * hide 후 destroy를 하면 에러가 발생을 하는 데,
       * 현재 태그들이 삭제되었는 지 확인 하는 로직대신
       * 예외 처리가 간단하므로 예외처리를 한다.
       */
    }
  };
  this.addPoint = function (xAxis, yAxis, appendIndex) {
    var newCircleRadius = draw.options.circleRadius;
    var pointsLength = draw.drawModel.getPointsLength();
    // Set Axis
    if (_.negate(_.isUndefined(appendIndex))) {
      draw.drawModel.addAxis(xAxis, yAxis, appendIndex);
    } else {
      draw.drawModel.addAxis(xAxis, yAxis);
    }
    draw.lineHelper.addLine();
    draw.lineHelper.appendAtLast();
    if (draw.options.textInCircle !== null) {
      newCircleRadius *= TEXT_POINT_RADIUS;
    }
    draw.circleHelper.addCircle(newCircleRadius);
    draw.circleHelper.changeRadius(pointsLength - 1, draw.options.circleRadius);
    draw.circleHelper.appendAtLast();
    draw.changeAxis();
    if (draw.drawModel.isAllSelected) {
      draw.setAllColor();
    }
  };
  this.callCustomEvent = function (eventName, arg) {
    var method = '';
    if ((draw.options.useResizeRectangle === true || draw.options.useEvent === true) && draw.options.event !== null && draw.options.customDraw === false) {
      if (eventName in draw.options.event) {
        method = Array.isArray(arg) === true ? 'apply' : 'call';
        draw.options.event[eventName][method](draw, arg);
      }
    }
  };
  this.createArrow = function (arrowOptions) {
    draw.useArrow = true;
    draw.options.arrow = _.clone(arrowOptions);
    draw.arrowImageHelper.addImage();
    draw.changeAxis();
    draw.arrowImageHelper.append();
  };
  this.toggleDraggingStatus = function (statusType) {
    var method = statusType === true ? 'add' : 'remove';
    var className = 'svg-geometry';
    document.body.classList[method](className);
  };
  this.resetElementStatus = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    var polygon = draw.polygonHelper.getPolygon();
    if (draw.selectedLineIndex !== null) {
      lines[draw.selectedLineIndex].isSelected = false;
      draw.selectedLineIndex = null;
    }
    if (draw.selectedCircleIndex !== null) {
      circles.forEach(function (circle) {
        if (circle.isSelected === true) {
          circle.isSelected = false;
        }
      });
      draw.selectedCircleIndex = null;
    }
    if (draw.options.fill === true) {
      polygon.isSelected = false;
      selectedPolygon = null;
    }
    if (draw.drawModel.isAllSelected === false) {
      draw.resetAllColor();
    }
    drawView.resetCursor(rootSVG);
    if (draw.options.fixedRatio === true) {
      parentSvgRatio = [];
    }
    parentSvgStartAxis = null;
  };
  this.parentSVGMouseUpHandle = function () {
    drawView.toggleDraggingStatus(false);
    if (draw.selectedCircleIndex !== null && draw.circleHelper.isMouseLeave()) {
      draw.circleHelper.update();
    }
    if (draw.selectedLineIndex !== null) {
      drawView.callCustomEvent('mouseup', draw.getData());
    }
    drawView.resetElementStatus();
    drawView.resetParentSvgAttr();
  };
  this.parentSVGMouseDownHandle = function (event) {
    var idx = 0;
    var len = 0;
    var circles = draw.circleHelper.getCircles();
    var lines = draw.lineHelper.getLines();
    var polygon = draw.polygonHelper.getPolygon();
    var isSelected = function isSelected(item) {
      return item.isSelected;
    };
    parentSvgStartAxis = ElementController.getPageAxis(rootSVG, event);
    _.pipe(_.findIndex(isSelected), function (index) {
      index > -1 && (draw.selectedCircleIndex = index);
    })(circles);

    // Check selected Line
    if (draw.selectedCircleIndex === null && draw.options.fixedRatio === false) {
      _.pipe(_.findIndex(isSelected), function (index) {
        index > -1 && (draw.selectedLineIndex = index);
      });
    }
    if (draw.options.fixedRatio === true && draw.options.ratio !== false) {
      parentSvgRatio = draw.options.ratio;
    } else if (draw.selectedCircleIndex !== null && draw.options.fixedRatio === true) {
      // 최대 공약수를 구해서 메모리 최적화 필요
      parentSvgRatio = [draw.options.points[2][0] - draw.options.points[0][0], draw.options.points[2][1] - draw.options.points[0][1]];
    }
    if (draw.options.fill === true) {
      if (polygon.isSelected === true) {
        selectedPolygon = true;
      }
    }
    if (draw.options.customDraw === true) {
      draw.selectedCircleIndex = draw.options.useOnlyRectangle === true || draw.options.useRectangleForCustomDraw === true ? 2 : circles.length - 1;
      drawView.toggleDraggingStatus(true);
    } else if (draw.selectedCircleIndex !== null || draw.selectedLineIndex !== null || selectedPolygon !== null) {
      ElementController.setAttr(MOVED_ATTR, true)(rootSVG);
      drawView.toggleDraggingStatus(true);
    }
  };
  var moveRectangle = function moveRectangle(event) {
    var _draw$drawModel$getAx = draw.drawModel.getAxis(draw.rectangleIndex[0]),
      _draw$drawModel$getAx2 = _slicedToArray(_draw$drawModel$getAx, 2),
      changedX1 = _draw$drawModel$getAx2[0],
      changedY1 = _draw$drawModel$getAx2[1];
    var _ElementController$ge = ElementController.getPageAxis(rootSVG, event),
      _ElementController$ge2 = _slicedToArray(_ElementController$ge, 2),
      changedX2 = _ElementController$ge2[0],
      changedY2 = _ElementController$ge2[1];
    var thirdPoint = draw.drawModel.getAxis(draw.rectangleIndex[2]);

    // 가로 Min, Max Validation
    if (!drawView.validateGeometrySize(Math.abs(changedX1 - changedX2), Math.abs(changedY1 - thirdPoint[1]))) {
      changedX2 = thirdPoint[0];
    }

    // 세로 Min, Max Validation
    if (!drawView.validateGeometrySize(Math.abs(changedX1 - thirdPoint[0]), Math.abs(changedY1 - changedY2))) {
      changedY2 = thirdPoint[1];
    }
    return [changedX1, changedY1, changedX2, changedY2];
  };
  var moveFixedRect = function moveFixedRect(event) {
    var pageAxis = ElementController.getPageAxis(rootSVG, event);
    var xAxis = pageAxis[0];
    var yAxis = pageAxis[1];
    var firstPoint = draw.drawModel.getAxis(draw.rectangleIndex[0]);
    var movedXAxis = xAxis - parentSvgStartAxis[0];
    var movedYAxis = yAxis - parentSvgStartAxis[1];
    var totalMovement = Math.abs(movedXAxis) + Math.abs(movedYAxis);
    var incrementXAxis = parentSvgRatio[0] / (parentSvgRatio[1] + parentSvgRatio[0]) * totalMovement;
    if (movedXAxis < 0 || movedYAxis < 0) {
      incrementXAxis *= -1;
    }
    var changedX1 = firstPoint[0];
    var changedX2 = xAxis + incrementXAxis;
    var changedY1 = firstPoint[1];
    var changedY2 = changedY1 + (changedX2 - changedX1) * parentSvgRatio[1] / parentSvgRatio[0];

    // 변경된좌표 체크
    if (draw.drawModel.validateAxis(changedX2, changedY2) === false) {
      /**
       * @date 2017-04-24
       * maxSize로 적용한 것은 최대 사이즈로 정상 적용을 위해서 이다.
       * 두번재 (x,y)가 0 보다 작을 때는 최소 사이즈보다 작을 때 이므로,
       * 분기를 추가 한다.
       */
      if (changedX1 === 0 && changedY1 === 0 && changedX2 > 0 && changedY2 > 0) {
        changedX2 = draw.options.maxSize.width;
        changedY2 = draw.options.maxSize.height;
      } else {
        return;
      }
    }

    // Min, Max Validation
    if (!drawView.validateGeometrySize(Math.abs(changedX1 - changedX2), Math.abs(changedY1 - changedY2))) {
      return;
    }
    return [changedX1, changedY1, changedX2, changedY2];
  };
  this.parentSVGMouseMoveHandle = function (event) {
    if (draw.options.customDraw === true && draw.selectedCircleIndex === null) {
      drawView.parentSVGMouseDownHandle(event);
    }
    if (draw.selectedCircleIndex === null && draw.selectedLineIndex === null && selectedPolygon === null && draw.options.customDraw === false) {
      return;
    }
    var pageAxis = ElementController.getPageAxis(rootSVG, event);
    var xAxis = pageAxis[0];
    var yAxis = pageAxis[1];
    var movedXAxis = xAxis - parentSvgStartAxis[0];
    var movedYAxis = yAxis - parentSvgStartAxis[1];
    var offsetWidth = ElementController.getSVGOffset(rootSVG)().width;
    var offsetHeight = ElementController.getSVGOffset(rootSVG)().height;
    var firstPoint = draw.drawModel.getAxis(draw.rectangleIndex[0]);
    var thirdPoint = draw.drawModel.getAxis(draw.rectangleIndex[2]);
    var prevPoints = [];
    var pointsLength = draw.drawModel.getPointsLength();
    var changedX1 = 0;
    var changedX2 = 0;
    var changedY1 = 0;
    var changedY2 = 0;
    var self = null;
    var circles = [];
    var lines = [];
    var polygon = null;

    // 포인트를 선택하여 영역을 이동 시킬 때
    if (draw.selectedCircleIndex !== null) {
      /*
      Point 이동 시 좌표 유효성 체크
      움직였을 때의 거리를 계산하여 유효성을 체크한다.
      */
      if (xAxis < 0) {
        xAxis = 0;
      } else if (xAxis > offsetWidth) {
        xAxis = offsetWidth;
      }
      if (yAxis < 0) {
        yAxis = 0;
      } else if (yAxis > offsetHeight) {
        yAxis = offsetHeight;
      }

      // 사각형 리사이징
      if (draw.options.fixedRatio === true || draw.options.useRectangleForCustomDraw === true) {
        // 사각형
        var axis = [];
        if (draw.options.useOnlyRectangle === true || draw.options.useRectangleForCustomDraw === true) {
          axis = moveRectangle(event);
        } else {
          // 고정비 확대
          axis = moveFixedRect(event);
        }

        // 뒤집어지는 것을 방지 하기 위해 세번째 포인트가 첫번째 포인트 보다 적을 때 return
        if (_.isUndefined(axis) || draw.options.useRectangleForCustomDraw === false && (firstPoint[0] > axis[2] || firstPoint[1] > axis[3])) {
          return;
        }
        drawView.changeRectangle.apply(drawView, _toConsumableArray(axis));

        // 라인과 폴리곤 사각형의 Circle
      } else {
        var validateAxis = [];
        var leftAxisIndex = 0;
        var rightAxisIndex = 0;
        /**
         * Custom Drawing 중일 때는 Line 제한을 하지 않고,
         * custom 함수에서 클릭시 제한을 한다.
         */
        if (draw.options.customDraw === false && draw.options.minLineLength !== false) {
          circles = draw.circleHelper.getCircles();
          if (!(draw.options.fill === false && draw.selectedCircleIndex === 0)) {
            leftAxisIndex = draw.selectedCircleIndex === 0 ? circles.length - 1 : draw.selectedCircleIndex - 1;
            validateAxis.push(draw.drawModel.getAxis(leftAxisIndex));
          }
          if (!(draw.options.fill === false && draw.selectedCircleIndex === circles.length - 1)) {
            rightAxisIndex = draw.selectedCircleIndex === circles.length - 1 ? 0 : draw.selectedCircleIndex + 1;
            validateAxis.push(draw.drawModel.getAxis(rightAxisIndex));
          }
          for (var i = 0, ii = validateAxis.length; i < ii; i++) {
            self = validateAxis[i];
            if (FunnyMath.pythagoreanTheorem(xAxis, yAxis, self[0], self[1]) < draw.options.minLineLength) {
              return;
            }
          }
        }
        prevPoints = draw.drawModel.getPoints();
        prevPoints[draw.selectedCircleIndex] = [xAxis, yAxis];
        if (draw.validateStabilization(prevPoints) === false) {
          return;
        }
        draw.drawModel.setAxis(draw.selectedCircleIndex, xAxis, yAxis);
      }
      // 라인을 선택하여 이동할 때
    } else if (draw.options.fill === true && draw.selectedLineIndex !== null) {
      lines = draw.lineHelper.getLines();
      var startAxis = draw.drawModel.getAxis(draw.selectedLineIndex);
      var endAxisIndex = draw.options.fill === true && draw.selectedLineIndex === lines.length - 1 ? 0 : draw.selectedLineIndex + 1;
      var endAxis = draw.drawModel.getAxis(endAxisIndex);
      changedX1 = startAxis[0] + movedXAxis;
      changedY1 = startAxis[1] + movedYAxis;
      changedX2 = endAxis[0] + movedXAxis;
      changedY2 = endAxis[1] + movedYAxis;

      /*
       * 라인 이동 시, 양쪽 끝의 유효성 체크하여
       * 변경이 불가능하면 기존 좌표로 한다.
       */
      if (draw.drawModel.validateAxis(changedX1, changedY1) === false || draw.drawModel.validateAxis(changedX2, changedY2) === false) {
        changedX1 = startAxis[0];
        changedY1 = startAxis[1];
        changedX2 = endAxis[0];
        changedY2 = endAxis[1];
      }
      prevPoints = draw.drawModel.getPoints();
      prevPoints[draw.selectedLineIndex] = [changedX1, changedY1];
      prevPoints[endAxisIndex] = [changedX2, changedY2];
      if (draw.validateStabilization(prevPoints) === false) {
        return;
      }
      draw.drawModel.setAxis(draw.selectedLineIndex, changedX1, changedY1);
      draw.drawModel.setAxis(endAxisIndex, changedX2, changedY2);
      // 영역을 선택하여 이동할 때
    } else if (draw.options.fill === true || draw.selectedLineIndex !== null) {
      var isMoveOk = false;
      polygon = draw.polygonHelper.getPolygon();
      if (polygon !== null) {
        isMoveOk = polygon.isSelected === true;
      } else {
        isMoveOk = draw.selectedLineIndex !== null;
      }

      /*
      Polygon 이동 시 좌표 유효성 체크
      Polygon은 도형 전체가 움직이므로 모든 Point의 좌표를 체크한다.
      */
      if (draw.options.useOnlyRectangle === true || draw.options.fixedRatio === true) {
        if (firstPoint[0] + movedXAxis < 0 || thirdPoint[0] + movedXAxis > offsetWidth) {
          movedXAxis = 0;
        }
        if (firstPoint[1] + movedYAxis < 0 || thirdPoint[1] + movedYAxis > offsetHeight) {
          movedYAxis = 0;
        }
      }
      if (draw.drawModel.validateAllPoint(movedXAxis, 0) === false) {
        movedXAxis = 0;
      }
      if (draw.drawModel.validateAllPoint(0, movedYAxis) === false) {
        movedYAxis = 0;
      }
      if (isMoveOk) {
        _.loop(function (index) {
          var self = draw.drawModel.getAxis(index);
          draw.drawModel.setAxis(index, self[0] + movedXAxis, self[1] + movedYAxis);
        })(pointsLength);
      }
    }
    parentSvgStartAxis = [xAxis, yAxis];

    // Update
    draw.changeAxis();
  };
  this.bindEvent = function () {
    if (draw.options.useResizeRectangle === true || draw.options.useEvent === true || draw.options.customDraw === true) {
      parentSvgStartAxis = null;
      EventController.bindBodyEvent('mousedown', drawView.parentSVGMouseDownHandle);
      EventController.bindBodyEvent('mousemove', drawView.parentSVGMouseMoveHandle);
      EventController.bindBodyEvent('mouseup', drawView.parentSVGMouseUpHandle);
      EventController.bindBodyEvent('mouseleave', drawView.parentSVGMouseUpHandle);
    }
  };
  this.init = function () {
    drawView.createSVGElement();
    if (draw.options.initCenter === true) {
      draw.drawModel.alignCenter();
    }
    draw.changeAxis();
    draw.resetAllColor();
    drawView.bindEvent();
    drawView.appendDom();
  };
  this.reset = function () {
    drawView.removeAllElement();
    drawView.unbindEvent();
    draw.lineHelper.setLines([]);
    draw.circleHelper.setCircles([]);
    draw.polygonHelper.setPolygon(null);
    draw.textTagHelper.setTextTag(null);
    draw.arrowImageHelper.resetData();
  };
  this.unbindEvent = function () {
    EventController.unbindBodyEvent('mousedown', drawView.parentSVGMouseDownHandle);
    EventController.unbindBodyEvent('mousemove', drawView.parentSVGMouseMoveHandle);
    EventController.unbindBodyEvent('mouseup', drawView.parentSVGMouseUpHandle);
    EventController.unbindBodyEvent('mouseleave', drawView.parentSVGMouseUpHandle);
    // document.documentElement.removeEventListener('mouseup', documentElementMouseMoveHandle);
  };
  this.endDraw = function () {
    draw.options.customDraw = false;
    draw.options.useRectangleForCustomDraw = false;
    drawView.resetElementStatus();
    drawView.resetParentSvgAttr();
  };
  this.changeRectangleToSize = function (width, height) {
    if (draw.options.useOnlyRectangle !== true && draw.options.fixedRatio !== true) {
      return;
    }
    var firstPoint = draw.drawModel.getAxis(0);
    var thirdPoint = draw.drawModel.getAxis(2);
    var offset = ElementController.getSVGOffset(rootSVG)();
    var changedX1 = 0;
    var changedX3 = 0;
    var changedY1 = 0;
    var changedY3 = 0;

    /*
     * 세번째 좌표가 오른쪽 하단 끝에 있을 경우
     * 세번째 좌표를 기준으로 변경을 하고,
     * 그렇지 않을 경우 첫번째 좌표를 기준으로 한다.
     */
    if (thirdPoint[0] >= offset.width) {
      changedX1 = thirdPoint[0] - width;
      changedX3 = thirdPoint[0];
    } else {
      changedX1 = firstPoint[0];
      changedX3 = firstPoint[0] + width;
    }
    if (thirdPoint[1] >= offset.height) {
      changedY1 = thirdPoint[1] - height;
      changedY3 = thirdPoint[1];
    } else {
      changedY1 = firstPoint[1];
      changedY3 = firstPoint[1] + height;
    }
    drawView.changeRectangle(changedX1, changedY1, changedX3, changedY3, true);
    draw.changeAxis();
  };
  this.changeRectangle = function (x1, y1, x2, y2, flagForchangeFirstAxis) {
    if (flagForchangeFirstAxis === true) {
      draw.drawModel.setAxis(0, x1, y1);
    }
    draw.drawModel.setAxis(draw.rectangleIndex[1], x1, y2);
    draw.drawModel.setAxis(draw.rectangleIndex[2], x2, y2);
    draw.drawModel.setAxis(draw.rectangleIndex[3], x2, y1);
  };
  this.changeNormalStatus = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    lines.forEach(function (line) {
      draw.lineHelper.hide(line);
    });
    circles.forEach(function (circle) {
      draw.circleHelper.hide(circle);
    });
    if (draw.useArrow === true) {
      draw.arrowImageHelper.hide();
    }
    draw.textTagHelper.hide();
    draw.resetAllColor();
  };
  this.changeActiveStatus = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    lines.forEach(function (line) {
      draw.lineHelper.show(line);
    });
    circles.forEach(function (circle) {
      draw.circleHelper.show(circle);
    });
    if (draw.useArrow === true) {
      draw.arrowImageHelper.show();
    }
    draw.textTagHelper.show();
    draw.setAllColor();
  };
  this.validateGeometrySize = function (geometryWidth, geometryHeight) {
    if (_.negate(_.isUndefined(draw.options.minSize))) {
      if (geometryWidth < draw.options.minSize.width || geometryHeight < draw.options.minSize.height) {
        return false;
      }
    }
    if (_.negate(_.isUndefined(draw.options.maxSize))) {
      if (geometryWidth > draw.options.maxSize.width || geometryHeight > draw.options.maxSize.height) {
        return false;
      }
    }
    return true;
  };
};
},{"./group-helper":"EG0U","./wise-facedetection-helper":"AjX5","./line-helper":"nNCE","./circle-helper":"EDWs","./text-helper":"oslI","./polygon-helper":"xwqZ","./arrow-image-helper":"xUQg","../../common/ElementController":"Uh1v","../../common/FunnyMath":"xbRW","../../common/EventController":"XfI7","../../common/fp":"KjOz","../../modules/constants":"n6AC"}],"IolE":[function(require,module,exports) {
'use strict';

/**
 * SVG 태그에 옵션에 맞게 Polygon, Line을 추가한다.
 *
 * @example
svgGeometry.draw({
  color: '#ff9832',
  selectedColor: '#ff5732',
  lineStrokeWidth: 5,
  circleRadius: 8,
  fill: true,
  fillOpacity: 0,
  useEvent: true,
  points: [
    [303,469],
    [437,461],
    [475,374],
    [423,248],
    [291,270],
    [224,388],
    [219,472]
  ]
});
 */
/**
 * DrawModel
 *
 * DrawView - DrawController
 * ArrowImageView - ArrowImageController
 * CircleView - CircleController
 * GroupView - GroupController
 * IconView - IconController
 * LineView - LineController
 * PolygonView - PolygonController
 * TextView - TextController
 * WiseFaceDetectionView - WiseFaceDetectionController
 */
var FunnyMath = require('../../common/FunnyMath');
var DrawModel = require('./DrawModel');
var DrawView = require('./DrawView');
var _ = require('../../common/fp');
module.exports = function Draw(rootSVG, options) {
  var draw = this;
  var MINIMUM_ANGLE = 1;
  draw.options = _.merge({
    fillColor: '#cccccc',
    lineColor: '#cccccc',
    pointColor: '#cccccc',
    points: [[0, 0], [100, 100]],
    lineStrokeWidth: 3,
    circleRadius: 5,
    minLineLength: 30,
    textInCircle: null,
    arrow: null,
    useEvent: false,
    useResizeRectangle: false,
    notUseMoveTopLayer: false,
    useCursor: false,
    useOnlyRectangle: false,
    useRectangleForCustomDraw: false,
    fill: false,
    fillOpacity: 0.5,
    fixedRatio: false,
    ratio: false,
    event: {},
    customDraw: false,
    minSize: {
      width: 30,
      height: 30
    },
    maxSize: false,
    minPoint: 4,
    maxPoint: 8,
    initCenter: false,
    mirror: false,
    flip: false,
    notUseAutoChangeOfArrow: false,
    wiseFaceDetection: false
  }, options);
  draw.useArrow = true;
  if (draw.options.arrow === null) {
    draw.useArrow = false;
  } else if (draw.options.arrow.mode === '') {
    draw.useArrow = false;
  }
  if (draw.options.useOnlyRectangle === true) {
    draw.options.fixedRatio = true;
  }
  draw.drawModel = new DrawModel(draw, rootSVG);
  draw.drawView = new DrawView(draw, rootSVG);
  draw.rectangleIndex = draw.drawModel.getRectangleIndex();
  draw.callCustomEvent = draw.drawView.callCustomEvent;
  draw.init = draw.drawView.init;
  draw.addPoint = draw.drawView.addPoint;
  draw.hide = draw.drawView.removeAllElement;
  draw.show = draw.drawView.appendDom;
  draw.active = draw.drawView.changeActiveStatus;
  draw.normal = draw.drawView.changeNormalStatus;
  draw.getData = function () {
    return {
      points: draw.drawModel.getPoints(),
      arrow: draw.drawView.getArrow()
    };
  };
  draw.reset = draw.drawView.reset;
  draw.destroy = draw.drawView.reset;
  draw.endDraw = draw.drawView.endDraw;
  draw.createArrow = draw.drawView.createArrow;
  draw.changeArrow = draw.drawView.changeArrow;
  draw.changeMinSizeOption = draw.drawModel.changeMinSizeOption;
  draw.changeMaxSizeOption = draw.drawModel.changeMaxSizeOption;
  draw.changeRectangleToSize = draw.drawView.changeRectangleToSize;
  draw.modifyPoints = draw.drawModel.modifyPoints;
  draw.alignCenter = draw.drawModel.alignCenter;
  draw.validateAxis = draw.drawModel.validateAxis;
  draw.stopEvent = draw.drawView.unbindEvent;
  draw.startEvent = draw.drawView.bindEvent;
  draw.moveTopLayer = draw.drawView.moveTopLayer;
  draw.changeWFDFillColor = draw.drawView.changeFillColor;
  draw.changeAxis = draw.drawView.changeAxis;
  draw.resetAllColor = function () {
    draw.drawView.resetAllColor();
    draw.drawModel.setIsAllSelectedState(false);
  };
  draw.setAllColor = function () {
    draw.drawView.setAllColor();
    draw.drawModel.setIsAllSelectedState(true);
  };
  draw.validateStabilization = validateStabilization;
  draw.validateIntersection = validateIntersection;
  draw.validateMinimumAngle = validateMinimumAngle;
  draw.drawView.init();

  // @DrawUtil
  function validateMinimumAngle(prevPoints) {
    var points = [];
    var pointsLength = 0;
    try {
      points = _.isUndefined(prevPoints) ? _.clone(draw.drawModel.getPoints()) : _.clone(prevPoints);
      pointsLength = points.length;

      /**
       * 삼각형부터 체크
       */
      if (pointsLength >= 3 && draw.options.fill === true) {
        var vertextAngle = Math.abs(FunnyMath.getVertextAngle(points[0], points[1], points[2]));
        if (vertextAngle < MINIMUM_ANGLE) {
          return false;
        }
        _.loop(function () {
          points.push(points.shift());
        })(pointsLength);
      }
    } catch (e) {
      console.warn(e);
    }
    return true;
  }

  // @DrawUtil
  function validateIntersection(prevPoints) {
    var returnVal = true;
    var points = 0;
    var pointsLength = 0;

    // 고정비 사각형, 직각사각형, 라인은 교차 체크를 하지 않음.
    if (draw.options.fill === false || draw.options.fixedRatio === true) {
      return;
    }
    try {
      points = _.isUndefined(prevPoints) ? _.clone(draw.drawModel.getPoints()) : _.clone(prevPoints);
      pointsLength = points.length;
      for (var i = 0; i < pointsLength - 1; i++) {
        var firstLineFirstPoint = points[i];
        var firstLineSecondPoint = points[i + 1];
        for (var j = i + 1; j < pointsLength; j++) {
          var secondLineFirstPoint = points[j];
          var secondLineSecondPointIndex = j + 1 === pointsLength ? 0 : j + 1;
          var secondLineSecondPoint = points[secondLineSecondPointIndex];
          if (FunnyMath.checkLineIntersection(firstLineFirstPoint[0], firstLineFirstPoint[1], firstLineSecondPoint[0], firstLineSecondPoint[1], secondLineFirstPoint[0], secondLineFirstPoint[1], secondLineSecondPoint[0], secondLineSecondPoint[1]) === false) {
            returnVal = false;
            break;
          }
        }
      }
    } catch (e) {
      console.info(e);
    }
    return returnVal;
  }

  // @DrawUtil
  function validateStabilization(prevPoints) {
    var points = _.isUndefined(prevPoints) ? _.clone(draw.drawModel.getPoints()) : _.clone(prevPoints);
    var returnVal = true;
    if (validateMinimumAngle(points) === false || validateIntersection(points) === false) {
      returnVal = false;
    }
    return returnVal;
  }
};
},{"../../common/FunnyMath":"xbRW","./DrawModel":"jKlS","./DrawView":"ybtO","../../common/fp":"KjOz"}],"BU8R":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Draw = require('../draw');
var _convertRectanglePoints = function convertRectanglePoints(x1, y1, x2, y2) {
  return [[x1, y1], [x1, y2], [x2, y2], [x2, y1]];
};
var callStartEvent = function callStartEvent(options, obj) {
  if ('start' in options.event) {
    options.event.start(obj);
  }
};
var callEndEvent = function callEndEvent(options, obj) {
  if ('end' in options.event) {
    options.event.end(obj);
  }
};
var init = function init() {
  return {
    obj: null,
    currentPoint: 0,
    options: null
  };
};
var _start = function start(rootSVG, options, axis, currentPoint) {
  var obj = new Draw(rootSVG, options);
  callStartEvent(options, obj);
  currentPoint++;
  return {
    obj: obj,
    currentPoint: currentPoint
  };
};
var _end = function end(obj, options) {
  obj.endDraw();
  callEndEvent(options, obj);
  return init();
};
var _destroy = function destroy(obj) {
  obj.destory();
  return init();
};
var _isFirst = function isFirst(currentPoint) {
  return currentPoint === 0;
};

/**
 * @todo
 * State 상속으로 사용했던 부분 함수로 교체
 */
var State = /*#__PURE__*/function () {
  function State(rootSVG) {
    _classCallCheck(this, State);
    var _init = init(),
      obj = _init.obj,
      currentPoint = _init.currentPoint,
      options = _init.options;
    this._rootSVG = rootSVG;
    this._obj = obj;
    this._currentPoint = currentPoint;
    this._options = options;
  }
  return _createClass(State, [{
    key: "start",
    value: function start(options, axis) {
      this._options = options;
      var _start2 = _start(this._rootSVG, options, axis, this._currentPoint),
        obj = _start2.obj,
        currentPoint = _start2.currentPoint;
      this._obj = obj;
      this._currentPoint = currentPoint;
    }
  }, {
    key: "end",
    value: function end() {
      var _end2 = _end(this._obj, this._options),
        obj = _end2.obj,
        currentPoint = _end2.currentPoint,
        options = _end2.options;
      this._obj = obj;
      this._currentPoint = currentPoint;
      this._options = options;
    }
  }, {
    key: "add",
    value: function add() {}
  }, {
    key: "isLast",
    value: function isLast() {}
  }, {
    key: "isFirst",
    value: function isFirst() {
      return _isFirst(this._currentPoint);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _destroy2 = _destroy(this._obj),
        obj = _destroy2.obj,
        currentPoint = _destroy2.currentPoint,
        options = _destroy2.options;
      this._obj = obj;
      this._currentPoint = currentPoint;
      this._options = options;
    }
  }, {
    key: "convertRectanglePoints",
    value: function convertRectanglePoints() {
      return _convertRectanglePoints.apply(void 0, arguments);
    }
  }]);
}();
module.exports = State;
},{"../draw":"IolE"}],"tB5R":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var State = require('./state');
var FixedRatioState = /*#__PURE__*/function (_State) {
  function FixedRatioState(rootSVG) {
    _classCallCheck(this, FixedRatioState);
    return _callSuper(this, FixedRatioState, [rootSVG]);
  }
  _inherits(FixedRatioState, _State);
  return _createClass(FixedRatioState, [{
    key: "start",
    value: function start(options, axis) {
      var points = [];
      if (options.minSize === false) {
        points = this.convertRectanglePoints(axis[0], axis[1], axis[0] + options.ratio[0], axis[1] + options.ratio[1]);
      } else {
        points = this.convertRectanglePoints(axis[0], axis[1], axis[0] + options.minSize.width, axis[1] + options.minSize.height);
      }
      options.points = points;
      _get(_getPrototypeOf(FixedRatioState.prototype), "start", this).call(this, options, axis);
    }
  }, {
    key: "end",
    value: function end() {
      _get(_getPrototypeOf(FixedRatioState.prototype), "end", this).call(this);
    }
  }, {
    key: "isLast",
    value: function isLast() {
      return this._currentPoint !== 0;
    }
  }]);
}(State);
module.exports = FixedRatioState;
},{"./state":"BU8R"}],"Dn5L":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var State = require('./state');
var RectangleState = /*#__PURE__*/function (_State) {
  function RectangleState(rootSVG) {
    _classCallCheck(this, RectangleState);
    return _callSuper(this, RectangleState, [rootSVG]);
  }
  _inherits(RectangleState, _State);
  return _createClass(RectangleState, [{
    key: "start",
    value: function start(options, axis) {
      options.points = this.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1]);
      _get(_getPrototypeOf(RectangleState.prototype), "start", this).call(this, options, axis);
    }
  }, {
    key: "end",
    value: function end() {
      _get(_getPrototypeOf(RectangleState.prototype), "end", this).call(this);
    }
  }, {
    key: "isLast",
    value: function isLast() {
      return this._currentPoint !== 0;
    }
  }]);
}(State);
module.exports = RectangleState;
},{"./state":"BU8R"}],"pnh9":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var State = require('./state');
var FunnyMath = require('../../common/FunnyMath');
var _ = require('../../common/fp');
var LineState = /*#__PURE__*/function (_State) {
  function LineState(rootSVG) {
    _classCallCheck(this, LineState);
    return _callSuper(this, LineState, [rootSVG]);
  }
  _inherits(LineState, _State);
  return _createClass(LineState, [{
    key: "start",
    value: function start(options, axis) {
      options.points = [axis, axis];
      _get(_getPrototypeOf(LineState.prototype), "start", this).call(this, options, axis);
      this._currentPoint = 2;
    }
  }, {
    key: "end",
    value: function end() {
      _get(_getPrototypeOf(LineState.prototype), "end", this).call(this);
    }
  }, {
    key: "add",
    value: function add(axis) {
      if (this.validateAllAxis(this._options.minLineLength) === false) {
        return;
      }
      if (this._currentPoint > 2) {
        if (this._obj.validateStabilization() === false) {
          return;
        }
      }
      this._obj.addPoint(axis[0], axis[1]);
      this._currentPoint++;
    }
  }, {
    key: "isLast",
    value: function isLast() {
      if (this._currentPoint === this._options.minPoint) {
        if (this.validateAllAxis(this._options.minLineLength) === false || this._obj.validateStabilization() === false) {
          return false;
        }
        return true;
      }
      return false;
    }
  }, {
    key: "validateAllAxis",
    value: function validateAllAxis() {
      var _this = this;
      var points = this._obj.getData().points;
      var pythagoreanTheorem = FunnyMath.pythagoreanTheorem;
      return !_.find(function (startAxis, index, points) {
        var endAxis = index === points.length - 1 ? points[0] : points[index + 1];
        if (pythagoreanTheorem(startAxis[0], startAxis[1], endAxis[0], endAxis[1]) < _this._options.minLineLength) {
          return true;
        }
      })(points);
    }
  }]);
}(State);
module.exports = LineState;
},{"./state":"BU8R","../../common/FunnyMath":"xbRW","../../common/fp":"KjOz"}],"WbEv":[function(require,module,exports) {
'use strict';

var EventController = require('../../common/EventController');
var ElementController = require('../../common/ElementController');
var _ = require('../../common/fp');
var FixedRatioState = require('./fixed_ratio_state');
var RectangleState = require('./ractangle_state');
var LineState = require('./line_state');
var _require = require('../../modules/constants'),
  MOVED_ATTR = _require.MOVED_ATTR;

/**
 * 하고 싶은 것
 * OOP -> FP
 * 1. 모두 순수 함수로 변경
 * 2. 클로저 사용으로 변경
 * 
 * 함수 실행 => 역할부여
 * 1. create instance
 * 2. bindevent
 * 3. trigger click
 * 4. bind cancel event
 * 5. trigger click
 * 6. unbind cancel event
 */

var getState = function getState(options) {
  if (options.useOnlyRectangle === true) {
    if (options.fixedRatio === true) {
      return FixedRatioState;
    }
    return RectangleState;
  }
  return LineState;
};
var calibrateOptions = function calibrateOptions(options) {
  var newOptions = _.merge({
    minPoint: 4,
    event: {},
    fixedRatio: false,
    useOnlyRectangle: false,
    ratio: false,
    minLineLength: 20,
    minSize: false
  }, options);
  newOptions.fixedRatio && (newOptions.useOnlyRectangle = true);
  newOptions.customDraw = true;
  return newOptions;
};
var addEventListener = function addEventListener(element, eventName, eventListener) {
  EventController.bindEvent(eventName, eventListener)(element);
  return function () {
    EventController.unbindEvent(eventName, eventListener)(element);
  };
};
var bindEvent = function bindEvent(rootSVG, state, options) {
  var unbindContextMenu;
  var unbindESCkeyEvent;
  var bindContextMenu = function bindContextMenu() {
    return addEventListener(rootSVG, 'contextmenu', stopDrawing);
  };
  var bindESCkeyEvent = function bindESCkeyEvent() {
    return addEventListener(document, 'keyup', function (_ref) {
      var keyCode = _ref.keyCode;
      keyCode === 27 && stopDrawing();
    });
  };
  var stopDrawing = function stopDrawing() {
    if (state.isFirst() === false) {
      state.destroy();
      endDraw();
    }
  };
  var startDraw = function startDraw() {
    unbindContextMenu = bindContextMenu();
    unbindESCkeyEvent = bindESCkeyEvent();
  };
  var endDraw = function endDraw() {
    unbindContextMenu();
    unbindESCkeyEvent();
  };
  return addEventListener(rootSVG, 'click', function (event) {
    if (ElementController.getAttr(MOVED_ATTR)(rootSVG) === 'true') {
      return;
    }
    var axis = ElementController.getPageAxis(rootSVG, event);
    if (state.isFirst()) {
      startDraw();
      state.start(options, axis);
    } else if (state.isLast()) {
      endDraw();
      state.end();
    } else {
      state.add(axis);
    }
  });
};
module.exports = function (rootSVG, _options) {
  var options = calibrateOptions(_options);
  var StateConstructor = getState(options);
  var state = new StateConstructor(rootSVG);
  var unbindEvent = bindEvent(rootSVG, state, options);
  return {
    destroy: unbindEvent
  };
};
},{"../../common/EventController":"XfI7","../../common/ElementController":"Uh1v","../../common/fp":"KjOz","./fixed_ratio_state":"tB5R","./ractangle_state":"Dn5L","./line_state":"pnh9","../../modules/constants":"n6AC"}],"UH7W":[function(require,module,exports) {
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var CustomEditor = require('./customeditor');
var Draw = require('./draw');
var EventController = require('../common/EventController');
var ElementController = require('../common/ElementController');
var _ = require('../common/fp');
var _require = require('../modules/constants'),
  MOVED_ATTR = _require.MOVED_ATTR,
  CLICK_DETECTION_TIME = _require.CLICK_DETECTION_TIME;
var CustomEditorV2 = /*#__PURE__*/function (_CustomEditor) {
  function CustomEditorV2(rootSVG, options) {
    var _this;
    _classCallCheck(this, CustomEditorV2);
    _this = _callSuper(this, CustomEditorV2, [rootSVG, options]);
    _this._mouseDownTimer = null;
    _this._svgObj = null;
    return _this;
  }
  _inherits(CustomEditorV2, _CustomEditor);
  return _createClass(CustomEditorV2, [{
    key: "unbindEvent",
    value: function unbindEvent() {
      _.divEq(EventController.unbindEvent('click', this.parentSVGClickHandle), EventController.unbindEvent('mousedown', this.parentSVGMouseDownHandle), EventController.unbindEvent('mouseup', this.parentSVGMouseUpHandle))(this._rootSVG);
    }
  }, {
    key: "createParentSVGClickHandle",
    value: function createParentSVGClickHandle() {
      var _this2 = this;
      var fn = _get(_getPrototypeOf(CustomEditorV2.prototype), "createParentSVGClickHandle", this).call(this);
      return function (event) {
        _this2._options.useRectangleForCustomDraw = false;
        fn(event);
      };
    }
  }, {
    key: "bindEvent",
    value: function bindEvent() {
      this.parentSVGMouseDownHandle = this.createParentSVGMouseDownHandle();
      this.parentSVGMouseUpHandle = this.createParentSVGMouseUpHandle();
      this.parentSVGClickHandle = this.createParentSVGClickHandle();
      _.divEq(EventController.bindEvent('mousedown', this.parentSVGMouseDownHandle), EventController.bindEvent('mouseup', this.parentSVGMouseUpHandle))(this._rootSVG);
    }
  }, {
    key: "bindCancelEvent",
    value: function bindCancelEvent() {
      this.bindContextMenu();
      document.addEventListener('keyup', this.handleESCKey);
    }
  }, {
    key: "unbindCancelEvent",
    value: function unbindCancelEvent() {
      this.unbindContextMenu();
      document.removeEventListener('keyup', this.handleESCKey);
    }
  }, {
    key: "removeDrawingGeometry",
    value: function removeDrawingGeometry() {
      _get(_getPrototypeOf(CustomEditorV2.prototype), "removeDrawingGeometry", this).call(this);
      if (this._state.isFirst() === false) {
        this.restartDrawing();
      }
    }
  }, {
    key: "restartDrawing",
    value: function restartDrawing() {
      this.unbindCancelEvent();
      this.unbindEvent();
      this.bindEvent();
    }
  }, {
    key: "endDraw",
    value: function endDraw() {
      _get(_getPrototypeOf(CustomEditorV2.prototype), "endDraw", this).call(this);
      this.restartDrawing();
    }
  }, {
    key: "endDragEvent",
    value: function endDragEvent() {
      this._svgObj.endDraw();
      this.unbindCancelEvent();
      this.restartDrawing();
      this._svgObj = null;
    }
  }, {
    key: "createParentSVGMouseUpHandle",
    value: function createParentSVGMouseUpHandle() {
      var _this3 = this;
      return function (event) {
        var isCheckingDragEvent = _this3._mouseDownTimer !== null;
        if (isCheckingDragEvent) {
          _this3.abortCheckingDragEvent(event);
          return;
        }
        var isRightMouseBtn = event.buttons === 2;
        var isUsingParent = ElementController.getAttr(MOVED_ATTR)(_this3._rootSVG) === 'true';
        if (isRightMouseBtn || isUsingParent || _this3._svgObj === null) {
          return;
        }
        _this3.endDragEvent();
      };
    }
  }, {
    key: "abortCheckingDragEvent",
    value: function abortCheckingDragEvent(event) {
      window.clearTimeout(this._mouseDownTimer);
      this._mouseDownTimer = null;
      this.parentSVGClickHandle(event);
      _.divEq(EventController.unbindEvent('mousedown', this.parentSVGMouseDownHandle), EventController.unbindEvent('mouseup', this.parentSVGMouseUpHandle), EventController.bindEvent('click', this.parentSVGClickHandle))(this._rootSVG);
    }
  }, {
    key: "createParentSVGMouseDownHandle",
    value: function createParentSVGMouseDownHandle() {
      var _this4 = this;
      return function (event) {
        var isRightMouseBtn = event.buttons === 2;
        var isNotCurrentTarget = event.currentTarget !== event.target;
        var isUsingParent = ElementController.getAttr(MOVED_ATTR)(_this4._rootSVG) === 'true';
        if (isRightMouseBtn || isNotCurrentTarget || isUsingParent) {
          return;
        }
        _this4.startCheckingDragEvent(event);
      };
    }
  }, {
    key: "startCheckingDragEvent",
    value: function startCheckingDragEvent(event) {
      var _this5 = this;
      window.clearTimeout(this._mouseDownTimer);
      this._mouseDownTimer = window.setTimeout(function (axis) {
        return _this5.startDragEvent(axis);
      }, CLICK_DETECTION_TIME, ElementController.getPageAxis(this._rootSVG, event));
    }
  }, {
    key: "startDragEvent",
    value: function startDragEvent(axis) {
      var DEFAULT_OBJECT_SIZE = 30;
      this._mouseDownTimer = null;
      this._options.points = [axis, [axis[0], axis[1] + DEFAULT_OBJECT_SIZE], [axis[0] + DEFAULT_OBJECT_SIZE, axis[1] + DEFAULT_OBJECT_SIZE], [axis[0] + DEFAULT_OBJECT_SIZE, axis[1]]];
      this._options.useRectangleForCustomDraw = true;
      this._svgObj = new Draw(this._rootSVG, this._options);
      this.bindCancelEvent();
    }
  }]);
}(CustomEditor);
module.exports = CustomEditorV2;
},{"./customeditor":"WbEv","./draw":"IolE","../common/EventController":"XfI7","../common/ElementController":"Uh1v","../common/fp":"KjOz","../modules/constants":"n6AC"}],"DyCu":[function(require,module,exports) {
'use strict';

/**
 * SVG를 사용한 Drawing 툴 모듈이다.
 * Plugin 중 'draw'를 통해서 영역을 조작한다.
 *
 * @class
 * @param {Object} rootSVG svg tag
 * @example
<caption>HTML Resource</caption>
<script src="./svg_drawing/modules/svg_geometry_product.js"></script>
<script src="./svg_drawing/modules/svg_geometry.js"></script>

<script src="./svg_drawing/plugins/draw/arrow-image-helper.js"></script>
<script src="./svg_drawing/plugins/draw/circle-helper.js"></script>
<script src="./svg_drawing/plugins/draw/group-helper.js"></script>
<script src="./svg_drawing/plugins/draw/icon-helper.js"></script>
<script src="./svg_drawing/plugins/draw/line-helper.js"></script>
<script src="./svg_drawing/plugins/draw/polygon-helper.js"></script>
<script src="./svg_drawing/plugins/draw/text-helper.js"></script>
<script src="./svg_drawing/plugins/draw/wise-facedetection-helper.js"></script>
<script src="./svg_drawing/plugins/draw/index.js"></script>

* @example
<caption>HTML</caption>
<svg
  width="500"
  height="500"
  id="svg_polygon"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
</svg>

 * @example
<caption>Javascript</caption>
var rootSVG = document.getElementById("svg_polygon");
var svgGeometry = new SVGGeometry(rootSVG);
svgGeometry.draw({
  color: '#ff9832',
  selectedColor: '#ff5732',
  lineStrokeWidth: 5,
  circleRadius: 8,
  fill: true,
  fillOpacity: 0,
  useEvent: true,
  points: [
    [303,469],
    [437,461],
    [475,374],
    [423,248],
    [291,270],
    [224,388],
    [219,472]
  ]
});
 */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Draw = require('../plugins/draw');
var _customEditor = require('../plugins/customeditor');
var CustomEditorV2 = require('../plugins/svg_geometry_plugin_customeditor_v2');
var ElementController = require('../common/ElementController');
var _ = require('../common/fp');
var SVGGeometry = /*#__PURE__*/function () {
  function SVGGeometry(rootSVG) {
    _classCallCheck(this, SVGGeometry);
    _.divEq(ElementController.setAttr('draggable', false), ElementController.style('cursor', 'normal'), ElementController.style('userSelect', 'none'), ElementController.style('mozUserSelect', 'none'), ElementController.style('webkitUserSelect', 'none'), ElementController.style('msUserSelect', 'none'))(rootSVG);
    this._rootSVG = rootSVG;
  }
  return _createClass(SVGGeometry, [{
    key: "draw",
    value: function draw(options) {
      return new Draw(this._rootSVG, options);
    }
  }, {
    key: "customEditor",
    value: function customEditor(options) {
      return _customEditor(this._rootSVG, options);
    }
  }, {
    key: "customEditorV2",
    value: function customEditorV2(options) {
      return this.customEditor(options);
      // return new CustomEditorV2(this._rootSVG, options)
    }
  }]);
}();
module.exports = SVGGeometry;
},{"../plugins/draw":"IolE","../plugins/customeditor":"WbEv","../plugins/svg_geometry_plugin_customeditor_v2":"UH7W","../common/ElementController":"Uh1v","../common/fp":"KjOz"}],"k3zf":[function(require,module,exports) {
var SVGGeometry = require('../src/modules/svg_geometry');
module.exports = function Polygon() {
  var svgTag = document.getElementById('svg_polygon');
  var svgGeometry = new SVGGeometry(svgTag);
  var polygonObject = null;
  var draw = function draw() {
    polygonObject = svgGeometry.draw({
      fillColor: '#ff6633',
      lineColor: '#ff6633',
      pointColor: '#ff6633',
      lineStrokeWidth: 5,
      circleRadius: 6,
      fill: true,
      points: [[156.5, 370], [239.5, 304], [321.5, 366], [286.5, 271], [370.5, 220], [271.5, 221], [238.5, 125], [210.5, 222], [114.5, 225], [197.5, 272]],
      minPoint: 2,
      maxPoint: 10,
      useEvent: true,
      useCursor: true,
      event: {
        mouseup: getPoints,
        polygoncontextmenu: function polygoncontextmenu() {
          alert('polygoncontextmenu');
        }
      }
    });
  };
  var addPoint = function addPoint() {
    polygonObject.addPoint();
  };
  function getPoints() {
    var data = polygonObject.getData();
    var log = document.getElementById('svg_polygon_log');
    log.innerHTML = '';
    for (var i = 0, len = data.points.length; i < len; i++) {
      var self = data.points[i];
      log.innerHTML += '[' + self[0] + ',' + self[1] + ']';
      if (i < len - 1) {
        log.innerHTML += ',';
      }
    }
  }
  return {
    draw: draw,
    addPoint: addPoint,
    getPoints: getPoints
  };
};
},{"../src/modules/svg_geometry":"DyCu"}],"HlDc":[function(require,module,exports) {
var SVGGeometry = require('../src/modules/svg_geometry');
module.exports = function Line() {
  var svgTag = document.getElementById('svg_line');
  var svgGeometry = new SVGGeometry(svgTag);
  var lineObject = [];
  var draw = function draw() {
    lineObject.push(svgGeometry.draw({
      lineColor: '#ff6633',
      pointColor: '#ff6633',
      lineStrokeWidth: 4,
      circleRadius: 6,
      minPoint: 2,
      maxPoint: 8,
      points: [[70, 242], [362, 380]],
      useEvent: true
    }));
    lineObject.push(svgGeometry.draw({
      lineColor: '#ff6633',
      pointColor: '#ff6633',
      lineStrokeWidth: 4,
      circleRadius: 6,
      minPoint: 2,
      maxPoint: 8,
      points: [[70, 270], [380, 270]],
      useEvent: true
    }));
    svgGeometry.customEditor({
      lineColor: '#ff6633',
      pointColor: '#ff6633',
      lineStrokeWidth: 4,
      circleRadius: 6,
      minPoint: 2,
      maxPoint: 8,
      useEvent: true
    });
  };
  return {
    draw: draw
  };
};
},{"../src/modules/svg_geometry":"DyCu"}],"rqhg":[function(require,module,exports) {
var SVGGeometry = require('../src/modules/svg_geometry');
module.exports = function FixedRatio() {
  var svgTag = document.getElementById('svg_fixed_ratio');
  var svgGeometry = new SVGGeometry(svgTag);
  var kindSVGObj = [];
  var draw = function draw() {
    //Bule
    kindSVGObj.push(svgGeometry.draw({
      fillColor: '#7fa9e3',
      lineColor: '#7fa9e3',
      pointColor: '#7fa9e3',
      lineStrokeWidth: 4,
      circleRadius: 8,
      useCursor: true,
      fill: true,
      points: [[10, 10], [10, 100], [130, 100], [130, 10]],
      fixedRatio: true,
      useEvent: true
    }));

    //Red
    kindSVGObj.push(svgGeometry.draw({
      fillColor: '#e38d7f',
      lineColor: '#e38d7f',
      pointColor: '#e38d7f',
      lineStrokeWidth: 4,
      circleRadius: 8,
      useCursor: true,
      fill: true,
      points: [[200, 10], [200, 210], [400, 210], [400, 10]],
      fixedRatio: true,
      useEvent: true
    }));

    //Green
    kindSVGObj.push(svgGeometry.draw({
      fillColor: '#7fe3a8',
      lineColor: '#7fe3a8',
      pointColor: '#7fe3a8',
      lineStrokeWidth: 4,
      circleRadius: 8,
      useCursor: true,
      fill: true,
      points: [[100, 250], [100, 430], [460, 430], [460, 250]],
      fixedRatio: true,
      useEvent: true
    }));
  };
  function alignCenter() {
    for (var i = 0, ii = kindSVGObj.length; i < ii; i++) {
      kindSVGObj[i].alignCenter();
    }
  }
  return {
    draw: draw,
    alignCenter: alignCenter
  };
};
},{"../src/modules/svg_geometry":"DyCu"}],"Focm":[function(require,module,exports) {
var SVGGeometry = require('./src/modules/svg_geometry');
var Polygon = require('./scripts/polygon.js');
var Line = require('./scripts/line.js');
var FixedRatio = require('./scripts/fixedratio.js');
var lineObject = null;
var kindSVGDrawing = null;
window.onload = function () {
  var polygon = new Polygon();
  polygon.draw();
  getElem('svg_polygon_add_point').onclick = polygon.addPoint;
  getElem('svg_polygon_get_point').onclick = polygon.getPoints;
  var fixedRatio = new FixedRatio();
  fixedRatio.draw();
  getElem('svg_fixed_ratio_btn').onclick = fixedRatio.alignCenter;
  var line = new Line();
  line.draw();
};
function getElem(id) {
  return document.getElementById(id);
}
var colorFactory = {
  red: '#CE534D',
  blue: '#3184F9',
  includeArea: {
    fill: '#ff6633',
    line: '#ff6633',
    point: '#ff6633'
  },
  excludeArea: {
    fill: '#000000',
    line: '#ffffff',
    point: '#999999'
  }
};
function getROIOptions() {
  return {
    fillColor: colorFactory.includeArea.fill,
    lineColor: colorFactory.includeArea.line,
    pointColor: colorFactory.includeArea.point,
    lineStrokeWidth: 4,
    circleRadius: 5,
    useEvent: true,
    useCursor: true,
    minPoint: 4,
    maxPoint: 8,
    fill: true,
    fillOpacity: '0.2'
  };
}
function getLineOptions() {
  return {
    fillColor: colorFactory.includeArea.fill,
    lineColor: colorFactory.includeArea.line,
    pointColor: colorFactory.includeArea.point,
    lineStrokeWidth: 4,
    circleRadius: 6,
    useEvent: true,
    useCursor: true,
    minPoint: 2,
    maxPoint: 8,
    arrow: {
      mode: 'R',
      min: 'L',
      max: 'LR',
      text: true
    }
  };
}
window.addEventListener('load', function () {
  // [MD, IVA] ROI
  var roi = document.getElementById('roi');
  var roiEditor = new SVGGeometry(roi);
  var roiOptions = getROIOptions();
  var roiObj = [];
  var selectROIObj = function selectROIObj(obj) {
    for (var i = 0, ii = roiObj.length; i < ii; i++) {
      roiObj[i].normal();
    }
    obj.active();
  };
  var defaultROIPoints = [[[686, 319], [455, 333], [465, 467], [694, 459]], [[294, 46], [135, 55], [150, 216], [367, 194]]];
  roiOptions.event = {
    start: function start() {},
    end: function end(obj) {
      roiObj.push(obj);
      selectROIObj(obj);
    },
    mouseup: function mouseup() {
      var self = this;
      // 포인트가 추가된뒤에 active 효과를 적용
      setTimeout(function () {
        selectROIObj(self);
      });
    }
  };
  roiEditor.customEditorV2(roiOptions);
  for (var i = 0, ii = defaultROIPoints.length; i < ii; i++) {
    roiOptions.points = defaultROIPoints[i];
    roiObj.push(roiEditor.draw(roiOptions));
  }
  selectROIObj(roiObj[0]);

  // [IVA] Virtual Line
  var virtualLine = document.getElementById('virtual_line');
  var virtualLineEditor = new SVGGeometry(virtualLine);
  var virtualLineOptions = getLineOptions();
  virtualLineOptions.fillColor = colorFactory.blue;
  virtualLineOptions.lineColor = colorFactory.blue;
  virtualLineOptions.pointColor = colorFactory.blue;
  var virtualLineObj = [];
  var defaultVirtualLinePoints = [[[736, 146], [455, 333]], [[651, 332], [295, 152]]];
  var selectLineObj = function selectLineObj(obj) {
    for (var i = 0, ii = virtualLineObj.length; i < ii; i++) {
      virtualLineObj[i].normal();
    }
    obj.active();
  };
  virtualLineOptions.event = {
    start: function start() {},
    end: function end(obj) {
      virtualLineObj.push(obj);
      selectLineObj(obj);
    },
    mouseup: function mouseup() {
      var self = this;
      setTimeout(function () {
        selectLineObj(self);
      });
    }
  };
  virtualLineEditor.customEditor(virtualLineOptions);
  for (var i = 0, ii = defaultVirtualLinePoints.length; i < ii; i++) {
    virtualLineOptions.points = defaultVirtualLinePoints[i];
    virtualLineObj.push(virtualLineEditor.draw(virtualLineOptions));
  }
  selectLineObj(virtualLineObj[0]);
});
},{"./src/modules/svg_geometry":"DyCu","./scripts/polygon.js":"k3zf","./scripts/line.js":"HlDc","./scripts/fixedratio.js":"rqhg"}]},{},["Focm"], null)
//# sourceMappingURL=src.06c530df.js.map