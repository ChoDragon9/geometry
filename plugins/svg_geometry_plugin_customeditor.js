"use strict";
/* globals SVGGeometry */
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

  var svgGeometry = new SVGGeometry(product.getParentSvg());

  if (options.fixedRatio === true) {
    options.useOnlyRectangle = true;
  }

  options.customDraw = true;

  /**
   * @todo
   * options에 따라 초기에 어떤 모양의 객체를 만들지 결정이남
   * 초기에 옵션을 분기하여 state에 객체를 설정함
   * 객체의 인터페이스를 동일하게 사용
   */
  /*
  if (options.useOnlyRectangle) {
    // 사각형일 때
    if (currentPoint === 0) {
      // start() : 처음 클릭할 때

      // getDefaultAxis()
      if (options.fixedRatio) {
        // 고정비 사각형일때
        if (options.minSize) {
          // 최소 사이즈 옵션을 적용했을 때
        } else {
          // 비율데로 사이즈를 적용
        }
      } else {
        // 그냥 사각형일 때
      }
      // createSvgObj()
      // bindCancelEvnet()
      // callStartEvent()
      // startDrawing() : 첫번째 클릭으로 드로윙을 시작했다는 표시
    } else {
      // end()
    }
  } else {
    // 라인일 때
    if (currentPoint === 0) {
      // start() : 첫번째 클릭일 때
      // getDefaultAxis()
      // createSvgObj()
      // bindCancelEvnet()
      // callStartEvent()
      // startDrawing() : 첫번째 클릭으로 드로윙을 시작했다는 표시
    } else if (options.minPoint === currentPoint) {
      // validateAllAxis()
      // validateStabilization()
      // end()
    } else {
      // validateAllAxis()
      // 삼각형부터 안정성 테스트
      if (currentPoint > 2) {
        // validateStabilization()
      }
      // addPoint()
      // 포인트 증가 표시
    }
  }
  */

  this.parentSVGClickHandle = function(event) {
    if (
      product.getParentSvgAttr(product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = product.getPageAxis(event);

    if (options.useOnlyRectangle === true) {
      //처음 클릭을 할 때
      if (currentPoint === 0) {
        if (options.fixedRatio === true) {
          if (options.minSize === false) {
            options.points = this.convertRectanglePoints(
              axis[0], axis[1],
              axis[0] + options.ratio[0], axis[1] + option.ratio[1]
            )
          } else {
            //영상 영역을 넘는 이슈로 0,0를 초기로 설정
            axis = [0, 0];
            options.points = this.convertRectanglePoints(
              axis[0], axis[1],
              axis[0] + options.minSize.width, axis[1] + options.minSize.height
            );
          }
        } else {
          options.points = this.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1])
        }
        this.setSvgObj(svgGeometry.draw(options));
        currentPoint++;
        this.bindContextMenu();
        this.bindESCkeyEvent();
        this.callStartEvent(options.event);
      } else {
        this.endDraw();
      }
    } else {
      if (currentPoint === 0) {
        options.points = [axis, axis];
        this.setSvgObj(svgGeometry.draw(options));
        currentPoint = 2;
        this.bindContextMenu();
        this.bindESCkeyEvent();
        this.callStartEvent(options.event);
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