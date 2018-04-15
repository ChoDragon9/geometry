"use strict";
/* globals SVGGeometry */
function customEditorV2 (product, _options) {
  var DEFAULT_OBJECT_SIZE = 30;
  var eventCtrl = product.eventController;
  var commonFunc = product.common;
  var funnyMath = product.funnyMath;
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

  var svgGeometry = new SVGGeometry(product.getParentSvg());

  options.customDraw = true;

  function parentSVGMouseUpHandle(event) {
    //Right button

    if(mouseDownTimer !== null){
      clearTimeout(mouseDownTimer);
      mouseDownTimer = null;

      parentSVGClickHandle(event);
      eventCtrl.unbindEvent(product.getParentSvg(), 'mousedown', parentSVGMouseDownHandle);
      eventCtrl.unbindEvent(product.getParentSvg(), 'mouseup', parentSVGMouseUpHandle);

      eventCtrl.bindEvent(product.getParentSvg(), 'click', parentSVGClickHandle);
      return;
    }

    if (event.buttons === 2) {
      return;
    }

    if (
      product.getParentSvgAttr(product.getParentMovedAttr()) === "true" ||
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
      product.getParentSvgAttr(product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = product.getPageAxis(event);

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
    }, product.getClickDetectionTime(), axis, options);
  }

  function parentSVGClickHandle(event) {
    if (
      product.getParentSvgAttr(product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = product.getPageAxis(event);

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
    eventCtrl.unbindEvent(product.getParentSvg(), 'click', parentSVGClickHandle);

    eventCtrl.unbindEvent(product.getParentSvg(), 'mousedown', parentSVGMouseDownHandle);
    eventCtrl.unbindBodyEvent('mouseup', parentSVGMouseUpHandle);
  }

  function bindEvent() {
    eventCtrl.bindEvent(product.getParentSvg(), 'mousedown', parentSVGMouseDownHandle);
    eventCtrl.bindEvent(product.getParentSvg(), 'mouseup', parentSVGMouseUpHandle);
  }

  function bindCancelEvent() {
    eventCtrl.bindEvent(product.getParentSvg(), "contextmenu", removeDrawingGeometry);
    document.addEventListener('keyup', handleESCKey);
  }

  function unbindCancelEvent() {
    eventCtrl.unbindEvent(product.getParentSvg(), "contextmenu", removeDrawingGeometry);
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

  /**
   * @todo
   * prototype으로 변경
   */
  this.destroy = unbindEvent;
  this.stop = unbindEvent;
  this.start = bindEvent;
  this.removeDrawingGeometry = removeDrawingGeometry;
}

SVGGeometry.addPlugin('customEditorV2', customEditorV2);