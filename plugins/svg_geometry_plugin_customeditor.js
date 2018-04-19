"use strict";
/* globals SVGGeometry */
function State (svgGeometry) {
  this._svgGeometry = svgGeometry
  this._obj = null
  this._currentPoint = 0
  this._options = null
}
State.prototype = {
  start: function (options, axis) {
    this._options = options
    this._obj = this._svgGeometry.draw(options)
    this._currentPoint++
    this.callStartEvent()
  },
  end: function () {
    this._obj.endDraw()
    this.callEndEvent()

    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  add: function () {},
  isFirst: function () {
    return this._currentPoint === 0
  },
  isLast: function () {},
  destroy: function () {
    this._obj.destroy()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  convertRectanglePoints: function (x1, y1, x2, y2) {
    return [
      [x1, y1], [x1, y2], [x2, y2], [x2, y1]
    ]
  },
  callStartEvent: function() {
    if ("start" in this._options.event) {
      this._options.event.start(this._obj);
    }
  },
  callEndEvent: function() {
    if ("end" in this._options.event) {
      this._options.event.end(this._obj);
    }
  }
}

function FixedRatioState (svgGeometry) {
  State.call(this, svgGeometry)
}
FixedRatioState.prototype = Object.create(State.prototype)
FixedRatioState.prototype.start = function (options, axis) {
  var points = []
  if (options.minSize === false) {
    points = this.convertRectanglePoints(
      axis[0], axis[1],
      axis[0] + options.ratio[0], axis[1] + option.ratio[1]
    )
  } else {
    points = this.convertRectanglePoints(
      axis[0], axis[1],
      axis[0] + options.minSize.width, axis[1] + options.minSize.height
    )
  }
  options.points = points

  State.prototype.start.call(this, options, axis)
}
FixedRatioState.prototype.end = function () {
  State.prototype.end.call(this)
}
FixedRatioState.prototype.isLast = function () {
  return this._currentPoint !== 0
}
FixedRatioState.prototype.constructor = FixedRatioState

function RectangleState (svgGeometry) {
  State.call(this, svgGeometry)
}
RectangleState.prototype = Object.create(State.prototype)
RectangleState.prototype.start = function (options, axis) {
  options.points = this.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1])
  State.prototype.start.call(this, options, axis)
}
RectangleState.prototype.end = function () {
  State.prototype.end.call(this)
}
RectangleState.prototype.isLast = function () {
  return this._currentPoint !== 0
}
RectangleState.prototype.constructor = RectangleState

function LineState (svgGeometry) {
  this._svgGeometry = svgGeometry
  this._obj = null
  this._currentPoint = 0
  this._options = null
}
LineState.prototype = Object.create(State.prototype)
LineState.prototype.start = function (options, axis) {
  options.points = [axis, axis]
  State.prototype.start.call(this, options, axis)
  this._currentPoint = 2
}
LineState.prototype.end = function () {
  State.prototype.end.call(this)
}
LineState.prototype.add = function (axis) {
  if (this.validateAllAxis(this._options.minLineLength) === false) {
    return
  }

  if (this._currentPoint > 2) {
    if (this._obj.validateStabilization() === false) {
      return
    }
  }

  this._obj.addPoint(axis[0], axis[1])
  this._currentPoint++
}
LineState.prototype.isLast = function () {
  if (this._currentPoint == this._options.minPoint) {
    if (this.validateAllAxis(this._options.minLineLength) === false || this._obj.validateStabilization() === false) {
      return false
    }
    return true
  }
  return false
}
LineState.prototype.validateAllAxis = function() {
  var points = this._obj.getData().points;
  var pythagoreanTheorem = new FunnyMath().pythagoreanTheorem

  for (var i = 0, ii = points.length; i < ii; i++) {
    var startAxis = points[i];
    var endAxis = i === ii - 1 ? points[0] : points[i + 1];

    if (pythagoreanTheorem(
        startAxis[0],
        startAxis[1],
        endAxis[0],
        endAxis[1]) < this._options.minLineLength) {
      return false
    }
  }

  return true
}
LineState.prototype.constructor = LineState

function CustomEditor (product, options) {
  var self = this

  this._product = product
  this._commonFunc = product.common;
  this._eventCtrl = product.eventController;
  this._options = null
  this._state = null
  this._svgGeometry = new SVGGeometry(product.getParentSvg());

  this.parentSVGClickHandleProxy = function (event) {
    self.parentSVGClickHandle(event)
  };

  this.removeDrawingGeometryProxy = function () {
    self.removeDrawingGeometry()
  }

  this.setOptions(options)
  this.bindEvent();
}

CustomEditor.prototype = {
  destroy: function () {
    this.unbindEvent();
  },
  stop: function () {
    this.unbindEvent();
  },
  start: function () {
    this.bindEvent();
  },
  unbindEvent: function () {
    this._eventCtrl.unbindEvent(this.getParentSvg(), 'click', this.parentSVGClickHandleProxy);
  },
  bindEvent: function () {
    this._eventCtrl.bindEvent(this.getParentSvg(), 'click', this.parentSVGClickHandleProxy);
  },
  handleESCKey: function (event) {
    if (event.keyCode === 27) {
      this.removeDrawingGeometry();
    }
  },
  bindContextMenu: function() {
    this._eventCtrl.bindEvent(this.getParentSvg(), "contextmenu", this.removeDrawingGeometryProxy);
  },
  unbindContextMenu: function () {
    this._eventCtrl.unbindEvent(this.getParentSvg(), "contextmenu", this.removeDrawingGeometryProxy);
  },
  bindESCkeyEvent: function () {
    document.addEventListener('keyup', this.handleESCKey.bind(this));
  },
  unbindESCkeyEvent: function () {
    document.removeEventListener('keyup', this.handleESCKey.bind(this));
  },
  removeDrawingGeometry: function () {
    if (this._state.isFirst() === false) {
      this._state.destroy();
      this.endDraw()
    }
  },
  startDraw: function () {
    this.bindContextMenu();
    this.bindESCkeyEvent();
  },
  endDraw: function() {
    this.unbindContextMenu();
    this.unbindESCkeyEvent();
  },
  setOptions: function (options) {
    this._options = this._commonFunc.getOptions({
      minPoint: 4,
      event: {},
      fixedRatio: false,
      useOnlyRectangle: false,
      ratio: false,
      minLineLength: 20,
      minSize: false
    }, options);
  
    if (this._options.fixedRatio === true) {
      this._options.useOnlyRectangle = true;
    }
  
    this._options.customDraw = true;
  
    if (this._options.useOnlyRectangle === true) {
      if (this._options.fixedRatio === true) {
        this._state = new FixedRatioState(this._svgGeometry)
      } else {
        this._state = new RectangleState(this._svgGeometry)
      }
    } else {
      this._state = new LineState(this._svgGeometry)
    }
  },
  parentSVGClickHandle: function(event) {
    if (
      this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = this._product.getPageAxis(event);

    if (this._state.isFirst()) {
      this.startDraw()
      this._state.start(this._options, axis)
    } else if (this._state.isLast()) {
      this.endDraw();
      this._state.end()
    } else {
      this._state.add(axis)
    }
  },
  getParentSvg: function () {
    return this._product.getParentSvg()
  }
}

SVGGeometry.addPlugin('customEditor', CustomEditor);