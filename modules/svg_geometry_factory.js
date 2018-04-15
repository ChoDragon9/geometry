"use strict";
/**
 * 수학함수 객체
 */
function FunnyMath () { }

FunnyMath.prototype = {
  getRadian: function (angle) {
    return angle * (Math.PI / 180);
  },
  getSine: function (num) {
    return Math.sin(this.getRadian(num));
  },
  getCosine: function (num) {
    return Math.cos(this.getRadian(num));
  },
  pythagoreanTheorem: function (x1, y1, x2, y2) {
    var xLength = Math.abs(x1 - x2);
    var yLength = Math.abs(y1 - y2);
    /**
     * It is Pythagorean theorem.
     * Math.pow(a, 2) + Math.pow(b, 2) = Math.pow(c, 2)
     */
    var lineLength = Math.sqrt(
      Math.pow(xLength, 2) + Math.pow(yLength, 2)
    );

    return lineLength;
  },
  getAngle: function (x1, y1, x2, y2) {
    var xLength = x1 - x2;
    var yLength = y1 - y2;
    var angle = Math.atan2(xLength, yLength);

    angle *= 180 / Math.PI;
    angle *= -1;

    return angle;
  },
  getVertextAngle: function (a, b, c) {
    var ab = [
      b[0] - a[0],
      b[1] - a[1]
    ];
    var cb = [
      b[0] - c[0],
      b[1] - c[1]
    ];
    var dot = (ab[0] * cb[0] + ab[1] * cb[1]); // dot product
    var cross = (ab[0] * cb[1] - ab[1] * cb[0]); // cross product
    var alpha = Math.atan2(cross, dot);
    return alpha * 180 / Math.PI;
  },
  checkLineIntersection: function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    var returnVal = true;
    var denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));

    if (denominator === 0) {
      return returnVal;
    }
    var a = line1StartY - line2StartY;
    var b = line1StartX - line2StartX;
    var numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    var numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    /*
    // it is worth noting that this should be the same as:
    x = line2StartX + (b * (line2EndX - line2StartX));
    y = line2StartX + (b * (line2EndY - line2StartY));
    */
    // if line1 is a segment and line2 is infinite, they intersect if:
    // if line2 is a segment and line1 is infinite, they intersect if:
    if ((a > 0 && a < 1) && (b > 0 && b < 1)) {
      returnVal = false;
    }
    return returnVal;
  },
  getLineCenter: function (x1, y1, x2, y2) {
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
}

/**
 * 이벤트 조작 객체
 */
function EventController () { }

EventController.prototype = {
  bindEvent: function (element, name, callback) {
    element.addEventListener(name, callback);
  },
  unbindEvent: function (element, name, callback) {
    element.removeEventListener(name, callback);
  },
  bindBodyEvent: function (name, callback) {
    document.body.addEventListener(name, callback);
  },
  unbindBodyEvent: function (name, callback) {
    document.body.removeEventListener(name, callback);
  }
}

/**
 * 플러그인 호출시 this로 사용할 객체
 *
 * @param {Object} svgTag svg tag
 */
function SVGGeometryFactory(svgTag) {
  this.PARENT_SVG_TAG = svgTag;
  this.NS = {
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink"
  };
  this.CONFIG = {
    ICON_HIDDEN_DELAY: 2000, //ms
    CLICK_DETECION_TIME: 100 //ms
  };

  svgTag.setAttributeNS(null, 'draggable', false);

  //Default style
  svgTag.style.cursor = 'normal';

  svgTag.style.userSelect = 'none';
  svgTag.style.mozUserSelect = 'none';
  svgTag.style.webkitUserSelect = 'none';
  svgTag.style.msUserSelect = 'none';

  this.elementController = new ElementController(svgTag, this.NS)
  this.common = new CommonUtils(svgTag)
}

SVGGeometryFactory.prototype.funnyMath = new FunnyMath()
SVGGeometryFactory.prototype.eventController = new EventController()

/**
 * 공통 함수 객체
 */
function CommonUtils (PARENT_SVG_TAG) {
  this.PARENT_SVG_TAG = PARENT_SVG_TAG
}
CommonUtils.prototype = {
  getBodyScroll: function () {
    var scroll = false;
    var body = document.body;
    var html = document.documentElement;

    if (body.scrollTop !== 0 || body.scrollLeft !== 0) {
      //For Chrome, Safari, Opera
      scroll = {
        left: body.scrollLeft,
        top: body.scrollTop
      };
    } else if (html.scrollTop !== 0 || html.scrollLeft !== 0) {
      //Firefox, IE
      scroll = {
        left: html.scrollLeft,
        top: html.scrollTop
      };
    }

    return scroll;
  },
  getPageAxis: function (event) {
    var offset = this.parentOffset();
    var xAxis = event.pageX - offset.left;
    var yAxis = event.pageY - offset.top;
    var scroll = this.getBodyScroll();

    if (scroll) {
      xAxis -= scroll.left;
      yAxis -= scroll.top;
    }

    return [xAxis, yAxis];
  },
  cloneObject: function (obj) {
    if (obj === null || typeof(obj) !== 'object') {
      return obj;
    }

    var copiedObj = obj.constructor();

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copiedObj[attr] = this.cloneObject(obj[attr]);
      }
    }

    return copiedObj;
  },
  parentOffset: function () {
    var offset = this.PARENT_SVG_TAG.getBoundingClientRect();
    return {
      top: offset.top,
      left: offset.left,
      width: offset.width,
      height: offset.height
    };
  },
  getOptions: function (defaultOptions, _options) {
    var keyName = '';
    var newOptions = {};
    var options = this.cloneObject(_options);

    for (keyName in defaultOptions) {
      newOptions[keyName] =
        typeof options[keyName] === "undefined" ?
          defaultOptions[keyName] :
          options[keyName];
    }

    return newOptions;
  }
}

/**
 * DOM 조작 객체
 */
function ElementController (PARENT_SVG_TAG, NS) {
  this.PARENT_SVG_TAG = PARENT_SVG_TAG
  this.NS = NS
}

ElementController.prototype = {
  getParentSvg: function () {
    return this.PARENT_SVG_TAG;
  },
  setParentSvgAttr: function (attrName, val) {
    return this.setAttr(
      this.PARENT_SVG_TAG,
      attrName,
      val
    );
  },
  getParentSvgAttr: function (attrName) {
    return this.getAttr(
      this.PARENT_SVG_TAG,
      attrName
    );
  },
  setAttr: function (element, attrName, val, ns) {
    var ns = typeof ns === "undefined" ? null : ns;
    element.setAttributeNS(ns, attrName, val);
  },
  getAttr: function (element, attrName) {
    return element.getAttributeNS(null, attrName);
  },
  removeParentChild: function (childrenElement) {
    this.PARENT_SVG_TAG.removeChild(childrenElement);
  },
  removeChild: function (parentElement, childrenElement) {
    parentElement.removeChild(childrenElement);
  },
  appendParentChild: function (childrenElement) {
    this.PARENT_SVG_TAG.appendChild(childrenElement);
  },
  appendChild: function (parentElement, childrenElement) {
    parentElement.appendChild(childrenElement);
  },
  createLine: function (strokeWidth) {
    var line = document.createElementNS(this.NS.SVG, "line");
    line.setAttributeNS(null, 'stroke-width', strokeWidth);
    line.setAttributeNS(null, 'draggable', false);

    return line;
  },
  createCircle: function (circleRadius) {
    var circle = document.createElementNS(this.NS.SVG, "circle");
    circle.setAttributeNS(null, "r", circleRadius);
    circle.setAttributeNS(null, 'draggable', false);

    return circle;
  },
  createRect: function (width, height) {
    var rectangle = document.createElementNS(this.NS.SVG, "rect");
    rectangle.setAttributeNS(null, "width", width);
    rectangle.setAttributeNS(null, "height", height);
    rectangle.setAttributeNS(null, 'draggable', false);

    return rectangle;
  },
  createText: function (txt) {
    var textTag = document.createElementNS(this.NS.SVG, 'text');
    textTag.textContent = txt;
    textTag.setAttributeNS(null, 'draggable', false);

    return textTag;
  },
  createGroup: function () {
    var group = document.createElementNS(this.NS.SVG, 'g');
    return group;
  },
  createImage: function (imagePath, width, height) {
    var imageContainner = this.createGroup();
    var image = document.createElementNS(this.NS.SVG, 'image');

    image.setAttributeNS(this.NS.XLINK, 'href', imagePath);
    image.setAttributeNS(null, 'width', width);
    image.setAttributeNS(null, 'height', height);
    image.setAttributeNS(null, 'draggable', false);

    imageContainner.appendChild(image);

    return [image, imageContainner];
  },
  createPolygon: function () {
    var polygon = document.createElementNS(this.NS.SVG, "polygon");
    polygon.setAttributeNS(null, 'draggable', false);

    return polygon;
  },
  createUse: function () {
    var use = document.createElementNS(this.NS.SVG, 'use');
    return use;
  }
}