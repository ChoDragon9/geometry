"use strict";
/* globals SVGGeometry */
/**
 * @todo
 * Drawing 할 객체가 option을 설정하면 하나로 되어
 * 모양을 변경을 못하기 때문에 모양을 변경할 수 있게해야 함
 */
function CustomEditor (product, _options) {
  var commonFunc = product.common;
  var options = commonFunc.getOptions({
    minPoint: 4,
    event: {},
    fixedRatio: false,
    useOnlyRectangle: false,
    ratio: false,
    minLineLength: 20,
    minSize: false
  }, _options);
  var currentPoint = 0;
  var svgObj = null;
  var self = this
  var strategy = function () {}
  var setStrategy = function (_strategy) {
    strategy = _strategy.bind(self)
  }

  var svgGeometry = new SVGGeometry(product.getParentSvg());

  if (options.fixedRatio === true) {
    options.useOnlyRectangle = true;
  }

  options.customDraw = true;

  if (options.useOnlyRectangle === true) {
    if (options.fixedRatio === true) {
      if (options.minSize === false) {
        setStrategy(function (axis) {
          return this.convertRectanglePoints(
            axis[0], axis[1],
            axis[0] + options.ratio[0], axis[1] + option.ratio[1]
          )
        })
      } else {
        setStrategy(function (axis) {
          //영상 영역을 넘는 이슈로 0,0를 초기로 설정
          axis = [0, 0];
          return this.convertRectanglePoints(
            axis[0], axis[1],
            axis[0] + options.minSize.width, axis[1] + options.minSize.height
          );
        })
      }
    } else {
      setStrategy(function (axis) {
        return this.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1])
      })
    }
  } else {
    setStrategy(function (axis) {
      return [axis, axis]
    })
  }

  this.parentSVGClickHandle = function(event) {
    if (
      product.getParentSvgAttr(product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = product.getPageAxis(event);

    if (currentPoint === 0) {
      options.points = this.getDefaultPoint(axis)
      this.setSvgObj(svgGeometry.draw(options));
      this.bindContextMenu();
      this.bindESCkeyEvent();
      this.callStartEvent(options.event);

      if(options.useOnlyRectangle === true) {
        this.setCurrentPoint(++currentPoint)
      } else {
        this.setCurrentPoint(2)
      }
    } else {
      if(options.useOnlyRectangle === true) {
        this.endDraw();
      } else if (options.minPoint === currentPoint) {
        if (this.validateAllAxis(options.minLineLength) === false || this.getSvgObj().validateStabilization() === false) {
          return;
        }

        this.endDraw();
      } else {
        if (this.validateAllAxis(options.minLineLength) === false) {
          return;
        }

        if (currentPoint > 2) {
          if (this.getSvgObj().validateStabilization() === false) {
            return;
          }
        }

        this.addPoint(axis[0], axis[1]);
        currentPoint++;
      }
    }
  }

  this.parentSVGClickHandleProxy = function (event) {
    self.parentSVGClickHandle(event)
  };

  this.eventCtrl = product.eventController;
  this.funnyMath = product.funnyMath;

  this.getSvgObj = function() {
    return svgObj
  };
  this.setSvgObj = function (obj) {
    svgObj = obj
  };
  this.setCurrentPoint = function (point) {
    currentPoint = point
  };
  this.isDrawing = function () {
    return svgObj !== null
  };
  this.getParentSvg = function () {
    return product.getParentSvg()
  }
  this.getEventOption = function () {
    return options.event
  }
  this.getDefaultPoint = function (axis) {
    return strategy(axis)
  }

  this.bindEvent();
}

CustomEditor.prototype = {
  convertRectanglePoints: function (x1, y1, x2, y2) {
    return [
      [x1, y1], [x1, y2], [x2, y2], [x2, y1]
    ]
  },
  addPoint: function(x, y) {
    this.getSvgObj().addPoint(x, y);
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
    if (this.isDrawing()) {
      this.getSvgObj().destroy();
      this.unbindESCkeyEvent();
      this.unbindContextMenu();
      this.setCurrentPoint(0);
    }
  },
  endDraw: function() {
    this.unbindContextMenu();
    this.unbindESCkeyEvent();
    this.getSvgObj().endDraw();
    this.callEndEvent(this.getEventOption());
    this.setSvgObj(null);
    this.setCurrentPoint(0)
  },
  callStartEvent: function(eventOption) {
    if ("start" in eventOption) {
      eventOption.start(this.getSvgObj());
    }
  },
  callEndEvent: function(eventOption) {
    if ("end" in eventOption) {
      eventOption.end(this.getSvgObj());
    }
  },
  validateAllAxis: function(minLineLength) {
    var points = this.getSvgObj().getData().points;

    for (var i = 0, ii = points.length; i < ii; i++) {
      var startAxis = points[i];
      var endAxis = i === ii - 1 ? points[0] : points[i + 1];

      if (this.funnyMath.pythagoreanTheorem(
          startAxis[0],
          startAxis[1],
          endAxis[0],
          endAxis[1]) < minLineLength) {
        return false
      }
    }

    return true
  }
}

SVGGeometry.addPlugin('customEditor', CustomEditor);