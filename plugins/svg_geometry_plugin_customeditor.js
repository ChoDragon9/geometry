"use strict";
/* globals SVGGeometry */
/**
 * @todo
 * Drawing 할 객체가 option을 설정하면 하나로 되어
 * 모양을 변경을 못하기 때문에 모양을 변경할 수 있게해야 함
 */
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
  },
  end: function () {
    this._obj.endDraw()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  add: function () {},
  isFirst: function () {},
  isLast: function () {},
  destory: function () {
    this._obj.destory()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }
}

function FixedRatio (svgGeometry) {
  this._svgGeometry = svgGeometry
  this._obj = null
  this._currentPoint = 0
  this._options = null
}
FixedRatio.prototype = {
  start: function (options, axis) {
    var points = []
    if (options.minSize === false) {
      points = CustomEditor.prototype.convertRectanglePoints(
        axis[0], axis[1],
        axis[0] + options.ratio[0], axis[1] + option.ratio[1]
      )
    } else {
      points = CustomEditor.prototype.convertRectanglePoints(
        axis[0], axis[1],
        axis[0] + options.minSize.width, axis[1] + options.minSize.height
      )
    }
    options.points = points
    this._options = options
    this._obj = this._svgGeometry.draw(options)
    this._currentPoint++
  },
  end: function () {
    this._obj.endDraw()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  add: function () {},
  isFirst: function () {
    return this._currentPoint === 0
  },
  isLast: function () {
    return this._currentPoint !== 0
  },
  destory: function () {
    this._obj.destory()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }
}

function Rectangle (svgGeometry) {
  this._svgGeometry = svgGeometry
  this._obj = null
  this._currentPoint = 0
  this._options = null
}
Rectangle.prototype = {
  start: function (options, axis) {
    options.points = CustomEditor.prototype.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1])
    this._options = options
    this._obj = this._svgGeometry.draw(options)
    this._currentPoint++
  },
  end: function () {
    this._obj.endDraw()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  add: function () {},
  isFirst: function () {
    return this._currentPoint === 0
  },
  isLast: function () {
    return this._currentPoint !== 0
  },
  destory: function () {
    this._obj.destory()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }
}

function Line (svgGeometry) {
  this._svgGeometry = svgGeometry
  this._obj = null
  this._currentPoint = 0
  this._options = null
}
Line.prototype = {
  start: function (options, axis) {
    options.points = [axis, axis]
    this._options = options
    this._obj = this._svgGeometry.draw(options)
    this._currentPoint = 2
  },
  end: function () {
    this._obj.endDraw()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  add: function (axis) {
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
  },
  isFirst: function () {
    return this._currentPoint === 0
  },
  isLast: function () {
    if (this._currentPoint == this._options.minPoint) {
      if (this.validateAllAxis(this._options.minLineLength) === false || this._obj.validateStabilization() === false) {
        return false
      }
      return true
    }
    return false
  },
  validateAllAxis: function() {
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
  },
  destory: function () {
    this._obj.destory()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }
}


function CustomEditor (product, _options) {
  var commonFunc = product.common;
  var options = {}
  var self = this

  this.state = null

  var svgGeometry = new SVGGeometry(product.getParentSvg());

  this.setOptions = function (_options) {
    options = commonFunc.getOptions({
      minPoint: 4,
      event: {},
      fixedRatio: false,
      useOnlyRectangle: false,
      ratio: false,
      minLineLength: 20,
      minSize: false
    }, _options);

    if (options.fixedRatio === true) {
      options.useOnlyRectangle = true;
    }

    options.customDraw = true;

    if (options.useOnlyRectangle === true) {
      if (options.fixedRatio === true) {
        this.state = new FixedRatio(svgGeometry)
      } else {
        this.state = new Rectangle(svgGeometry)
      }
    } else {
      this.state = new Line(svgGeometry)
    }
  }

  this.parentSVGClickHandle = function(event) {
    if (
      product.getParentSvgAttr(product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = product.getPageAxis(event);

    if (this.state.isFirst()) {
      this.state.start(options, axis)
      this.startDraw()
    } else if (this.state.isLast()) {
      this.state.end()
      this.endDraw();
    } else {
      this.state.add(axis)
    }
  }

  this.parentSVGClickHandleProxy = function (event) {
    self.parentSVGClickHandle(event)
  };

  this.eventCtrl = product.eventController;
  this.funnyMath = product.funnyMath;

  this.getParentSvg = function () {
    return product.getParentSvg()
  }
  this.getEventOption = function () {
    return options.event
  }

  this.setOptions(_options)
  this.bindEvent();
}

CustomEditor.prototype = {
  convertRectanglePoints: function (x1, y1, x2, y2) {
    return [
      [x1, y1], [x1, y2], [x2, y2], [x2, y1]
    ]
  },
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
    this.eventCtrl.unbindEvent(this.getParentSvg(), 'click', this.parentSVGClickHandleProxy);
  },
  bindEvent: function () {
    this.eventCtrl.bindEvent(this.getParentSvg(), 'click', this.parentSVGClickHandleProxy);
  },
  handleESCKey: function (event) {
    if (event.keyCode === 27) {
      this.removeDrawingGeometry();
    }
  },
  bindContextMenu: function() {
    this.eventCtrl.bindEvent(this.getParentSvg(), "contextmenu", this.removeDrawingGeometry.bind(this));
  },
  unbindContextMenu: function () {
    this.eventCtrl.unbindEvent(this.getParentSvg(), "contextmenu", this.removeDrawingGeometry.bind(this));
  },
  bindESCkeyEvent: function () {
    document.addEventListener('keyup', this.handleESCKey.bind(this));
  },
  unbindESCkeyEvent: function () {
    document.removeEventListener('keyup', this.handleESCKey.bind(this));
  },
  removeDrawingGeometry: function () {
    if (this.state.isFirst() === false) {
      this.state.destroy();
      this.unbindESCkeyEvent();
      this.unbindContextMenu();
    }
  },
  startDraw: function () {
    this.bindContextMenu();
    this.bindESCkeyEvent();
    this.callStartEvent(this.getEventOption());
  },
  endDraw: function() {
    this.unbindContextMenu();
    this.unbindESCkeyEvent();
    this.callEndEvent(this.getEventOption());
  },
  callStartEvent: function(eventOption) {
    if ("start" in eventOption) {
      eventOption.start(this.state._obj);
    }
  },
  callEndEvent: function(eventOption) {
    if ("end" in eventOption) {
      eventOption.end(this.state._obj);
    }
  }
}

SVGGeometry.addPlugin('customEditor', CustomEditor);