"use strict";
/* globals SVGGeometry */
SVGGeometry.addPlugin('customEditor', function(_options) {
  var parentSvgMovedAttr = 'is-moved';
  var options = this.common.cloneObject(_options);
  var minPoint = typeof options.minPoint === "undefined" ? 4 : options.minPoint;
  //custom 함수에서는 start, end 이벤트만 사용한다.
  var customEvent = typeof options.event === "undefined" ? null : options.event;
  var fixedRatio = typeof options.fixedRatio === "undefined" ? false : options.fixedRatio;
  var useOnlyRectangle = typeof options.useOnlyRectangle === "undefined" ? false : options.useOnlyRectangle;
  var ratio = typeof options.ratio === "undefined" ? false : options.ratio;
  var minLineLength = typeof options.minLineLength === "undefined" ? 20 : options.minLineLength;
  var minSize = typeof options.minSize === "undefined" ? false : options.minSize;
  var currentPoint = 0;
  var svgObj = [];
  var currentSvgObjIndex = 0;
  var isDrawing = false;

  var eventCtrl = this.eventController;
  var elemCtrl = this.elementController;
  var commonFunc = this.common;
  var funnyMath = this.funnyMath;

  var svgGeometry = new SVGGeometry(elemCtrl.getParentSvg());

  if (fixedRatio === true) {
    useOnlyRectangle = true;
  }

  options.customDraw = true;

  var parentSVGClickHandle = function(event) {
    if (
      elemCtrl.getParentSvgAttr(parentSvgMovedAttr) === "true"
    ) {
      return;
    }

    var axis = commonFunc.getPageAxis(event);

    var addPoint = function() {
      svgObj[currentSvgObjIndex].addPoint(axis[0], axis[1]);
    };

    var callStartEvent = function() {
      bindContextMenu();
      bindESCkeyEvent();
      isDrawing = true;
      if ("start" in customEvent) {
        customEvent.start(svgObj[currentSvgObjIndex]);
      }
    };

    var callEndEvent = function() {
      unbindContextMenu();
      unbindESCkeyEvent();
      isDrawing = false;
      if ("end" in customEvent) {
        customEvent.end(svgObj[currentSvgObjIndex]);
      }
    };

    var endDraw = function() {
      svgObj[currentSvgObjIndex].endDraw();
      callEndEvent();
      currentPoint = 0;
      currentSvgObjIndex++;
    };

    var validateAllAxis = function() {
      var points = svgObj[currentSvgObjIndex].getData().points;
      var returnVal = true;

      if (minLineLength !== false) {
        for (var i = 0, ii = points.length; i < ii; i++) {
          var startAxis = points[i];
          var endAxis = i === ii - 1 ? points[0] : points[i + 1];

          if (funnyMath.pythagoreanTheorem(
              startAxis[0],
              startAxis[1],
              endAxis[0],
              endAxis[1]) < minLineLength) {
            returnVal = false;
          }
        }
      }

      return returnVal;
    };

    if (useOnlyRectangle === true) {
      //처음 클릭을 할 때
      if (currentPoint === 0) {
        if (fixedRatio === true) {
          if (minSize === false) {
            options.points = [
              axis, [axis[0], axis[1] + ratio[1]],
              [axis[0] + ratio[0], axis[1] + ratio[1]],
              [axis[0] + ratio[0], axis[1]]
            ];
          } else {
            //영상 영역을 넘는 이슈로 0,0를 초기로 설정
            axis = [0, 0];
            options.points = [
              axis, [axis[0], axis[1] + minSize.height],
              [axis[0] + minSize.width, axis[1] + minSize.height],
              [axis[0] + minSize.width, axis[1]]
            ];
          }
        } else {
          options.points = [axis, axis, axis, axis];
        }
        svgObj[currentSvgObjIndex] = svgGeometry.draw(options);
        currentPoint++;
        callStartEvent();
      } else {
        endDraw();
      }
    } else {
      if (currentPoint === 0) {
        options.points = [axis, axis];
        svgObj[currentSvgObjIndex] = svgGeometry.draw(options);
        currentPoint = 2;
        callStartEvent();
      } else if (minPoint === currentPoint) {
        if (validateAllAxis() === false || svgObj[currentSvgObjIndex].validateStabilization() === false) {
          return;
        }

        endDraw();
      } else {
        if (validateAllAxis() === false) {
          return;
        }

        if (currentPoint > 2) {
          if (svgObj[currentSvgObjIndex].validateStabilization() === false) {
            return;
          }
        }

        addPoint();
        currentPoint++;
      }
    }
  };

  bindEvent();

  function unbindEvent() {
    eventCtrl.unbindParentEvent('click', parentSVGClickHandle);
  }

  function bindEvent() {
    eventCtrl.bindParentEvent('click', parentSVGClickHandle);
  }

  function handleESCKey(event) {
    if (event.keyCode === 27) {
      removeDrawingGeometry();
    }
  }

  function bindContextMenu() {
    eventCtrl.bindParentEvent("contextmenu", removeDrawingGeometry);
  }

  function unbindContextMenu() {
    eventCtrl.unbindParentEvent("contextmenu", removeDrawingGeometry);
  }

  function bindESCkeyEvent() {
    document.addEventListener('keyup', handleESCKey);
  }

  function unbindESCkeyEvent() {
    document.removeEventListener('keyup', handleESCKey);
  }

  function removeDrawingGeometry() {
    if (isDrawing) {
      svgObj[currentSvgObjIndex].destroy();
      unbindESCkeyEvent();
      unbindContextMenu();
      currentPoint = 0;
    }
  }

  return {
    destroy: unbindEvent,
    stop: unbindEvent,
    start: bindEvent,
    removeDrawingGeometry: removeDrawingGeometry
  }
});