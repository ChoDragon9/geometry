"use strict";
/* globals SVGGeometry */
function customEditorV2 (_options) {
  var DEFAULT_OBJECT_SIZE = 30;
  var self = this;
  var eventCtrl = self.eventController;
  var elemCtrl = self.elementController;
  var commonFunc = self.common;
  var funnyMath = self.funnyMath;
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
  var svgObj = [];
  var currentSvgObjIndex = 0;
  var isDrawing = false;
  var mouseDownTimer = null;

  var svgGeometry = new SVGGeometry(self.PARENT_SVG_TAG);

  options.customDraw = true;

  function parentSVGMouseUpHandle(event) {
    //Right button

    if(mouseDownTimer !== null){
      clearTimeout(mouseDownTimer);
      mouseDownTimer = null;

      parentSVGClickHandle(event);
      eventCtrl.unbindEvent(self.PARENT_SVG_TAG, 'mousedown', parentSVGMouseDownHandle);
      eventCtrl.unbindEvent(self.PARENT_SVG_TAG, 'mouseup', parentSVGMouseUpHandle);

      eventCtrl.bindEvent(self.PARENT_SVG_TAG, 'click', parentSVGClickHandle);
      return;
    }

    if (event.buttons === 2) {
      return;
    }

    if (
      self.getParentSvgAttr(self.PARENT_SVG_MOVED_ATTRIBUTE) === "true" ||
      typeof svgObj[currentSvgObjIndex] === "undefined"
    ) {
      return;
    }
    svgObj[currentSvgObjIndex].endDraw();
    unbindCancelEvent();
    callEndEvent();
    currentPoint = 0;
    currentSvgObjIndex++;
  }

  function parentSVGMouseDownHandle(event) {
    if (
      event.buttons === 2 ||
      event.currentTarget !== event.target ||
      self.getParentSvgAttr(self.PARENT_SVG_MOVED_ATTRIBUTE) === "true"
    ) {
      return;
    }

    var axis = self.getPageAxis(event);

    clearTimeout(mouseDownTimer);
    mouseDownTimer = setTimeout(function(axis, options){
      mouseDownTimer = null;
      options.points = [
        axis, [axis[0], axis[1] + DEFAULT_OBJECT_SIZE],
        [axis[0] + DEFAULT_OBJECT_SIZE, axis[1] + DEFAULT_OBJECT_SIZE],
        [axis[0] + DEFAULT_OBJECT_SIZE, axis[1]],
      ];

      options.useRectangleForCustomDraw = true;

      svgObj[currentSvgObjIndex] = svgGeometry.draw(options);
      currentPoint++;
      callStartEvent();
    }, self.CONFIG.CLICK_DETECION_TIME, axis, options);
  }

  function parentSVGClickHandle(event) {
    if (
      self.getParentSvgAttr(self.PARENT_SVG_MOVED_ATTRIBUTE) === "true"
    ) {
      return;
    }

    var axis = self.getPageAxis(event);

    var addPoint = function() {
      svgObj[currentSvgObjIndex].addPoint(axis[0], axis[1]);
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

      if (options.minLineLength !== false) {
        for (var i = 0, ii = points.length; i < ii; i++) {
          var startAxis = points[i];
          var endAxis = i === ii - 1 ? points[0] : points[i + 1];

          if (funnyMath.pythagoreanTheorem(
              startAxis[0],
              startAxis[1],
              endAxis[0],
              endAxis[1]) < options.minLineLength) {
            returnVal = false;
          }
        }
      }

      return returnVal;
    };

    options.useRectangleForCustomDraw = false;

    if (options.useOnlyRectangle === true) {
      //처음 클릭을 할 때
      if (currentPoint === 0) {
        if (options.fixedRatio === true) {
          if (options.minSize === false) {
            options.points = [
              axis, [axis[0], axis[1] + options.ratio[1]],
              [axis[0] + options.ratio[0], axis[1] + options.ratio[1]],
              [axis[0] + options.ratio[0], axis[1]]
            ];
          } else {
            //영상 영역을 넘는 이슈로 0,0를 초기로 설정
            axis = [0, 0];
            options.points = [
              axis, [axis[0], axis[1] + options.minSize.height],
              [axis[0] + options.minSize.width, axis[1] + options.minSize.height],
              [axis[0] + options.minSize.width, axis[1]]
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
      } else if (options.minPoint === currentPoint) {
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
  }

  bindEvent();

  function callEndEvent() {
    restartDrawing();
    isDrawing = false;
    if ("end" in options.event) {
      options.event.end(svgObj[currentSvgObjIndex]);
    }
  }

  function callStartEvent() {
    bindCancelEvent();
    isDrawing = true;
    if ("start" in options.event) {
      options.event.start(svgObj[currentSvgObjIndex]);
    }
  }

  function handleESCKey(event) {
    if (event.keyCode === 27) {
      removeDrawingGeometry();
    }
  }

  function unbindEvent() {
    eventCtrl.unbindEvent(self.PARENT_SVG_TAG, 'click', parentSVGClickHandle);

    eventCtrl.unbindEvent(self.PARENT_SVG_TAG, 'mousedown', parentSVGMouseDownHandle);
    eventCtrl.unbindBodyEvent('mouseup', parentSVGMouseUpHandle);
  }

  function bindEvent() {
    eventCtrl.bindEvent(self.PARENT_SVG_TAG, 'mousedown', parentSVGMouseDownHandle);
    eventCtrl.bindEvent(self.PARENT_SVG_TAG, 'mouseup', parentSVGMouseUpHandle);
  }

  function bindCancelEvent() {
    eventCtrl.bindEvent(self.PARENT_SVG_TAG, "contextmenu", removeDrawingGeometry);
    document.addEventListener('keyup', handleESCKey);
  }

  function unbindCancelEvent() {
    eventCtrl.unbindEvent(self.PARENT_SVG_TAG, "contextmenu", removeDrawingGeometry);
    document.removeEventListener('keyup', handleESCKey);
  }

  function removeDrawingGeometry() {
    if (isDrawing) {
      svgObj[currentSvgObjIndex].destroy();
      restartDrawing();
      currentPoint = 0;
    }
  }

  function restartDrawing(){
    unbindCancelEvent();
    unbindEvent();
    bindEvent();
  }

  return {
    destroy: unbindEvent,
    stop: unbindEvent,
    start: bindEvent,
    removeDrawingGeometry: removeDrawingGeometry
  };
}

SVGGeometry.addPlugin('customEditorV2', customEditorV2);