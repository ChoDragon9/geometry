"use strict";
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
function Draw (product, options) {
  var MINIMUM_ANGLE = 1;
  var TEXT_POINT_RADIUS = 1.5;

  var draw = this;
  
  var parentSvg = product.getParentSvg();

  var selectedPolygon = null;

  draw.options = CommonUtils.getOptions(
    {
      fillColor: '#cccccc',
      lineColor: '#cccccc',
      pointColor: '#cccccc',
      points: [ [0, 0], [100, 100] ],
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
      fillOpacity: .5,
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
    },
    options
  );

  draw.useArrow = true;

  if (draw.options.arrow === null) {
    draw.useArrow = false;
  } else if (draw.options.arrow.mode === '') {
    draw.useArrow = false;
  }

  if (draw.options.useOnlyRectangle === true) {
    draw.options.fixedRatio = true;
  }

  draw.selectedCircleIndex = null;
  draw.selectedLineIndex = null;

  draw.drawModel = new DrawModel(draw, product);
  draw.drawView = new DrawView(draw, product)

  draw.rectangleIndex = draw.drawModel.getRectangleIndex();

  draw.callCustomEvent = callCustomEvent;
  draw.init = init;
  draw.addPoint = addPoint;
  draw.hide = removeAllElement;
  draw.show = appendDom;
  draw.active = changeActiveStatus;
  draw.normal = changeNormalStatus;
  draw.addPoint = addPoint;
  draw.getData = function() {
    return {
      points: draw.drawModel.getPoints(),
      arrow: draw.drawView.getArrow()
    };
  };
  draw.reset = reset;
  draw.destroy = reset;
  draw.endDraw = endDraw;
  draw.createArrow = createArrow;
  draw.changeArrow = draw.drawView.changeArrow;
  draw.changeMinSizeOption = draw.drawModel.changeMinSizeOption;
  draw.changeMaxSizeOption = draw.drawModel.changeMaxSizeOption;
  draw.changeRectangleToSize = changeRectangleToSize;
  draw.modifyPoints = draw.drawModel.modifyPoints;
  draw.alignCenter = draw.drawModel.alignCenter;
  draw.validateAxis = draw.drawModel.validateAxis;
  draw.validateStabilization = validateStabilization;
  draw.validateIntersection = validateIntersection;
  draw.validateMinimumAngle = validateMinimumAngle;
  draw.stopEvent = unbindEvent;
  draw.startEvent = bindEvent;
  draw.moveTopLayer = draw.drawView.moveTopLayer;
  draw.changeWFDFillColor = draw.drawView.changeFillColor;
  draw.changeAxis = draw.drawView.changeAxis
  draw.resetAllColor = function() {
    draw.drawView.resetAllColor()
    draw.drawModel.setIsAllSelectedState(false);
  };
  draw.setAllColor = function() {
    draw.drawView.setAllColor()
    draw.drawModel.setIsAllSelectedState(true);
  };

  init();

  // @DrawView
  function createSVGElement() {
    var radius = draw.options.circleRadius;
    var pointsLength = draw.drawModel.getPointsLength();
    var addLine = function() {
      if (draw.options.fixedRatio === true) {
        draw.lineHelper.addLine(false, false);
      } else {
        draw.lineHelper.addLine();
      }
    };

    for (var i = 0, len = pointsLength; i < len; i++) {
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
          //Circle을 작게 그려서 안보이게 함.
          draw.circleHelper.addCircle(0, false, false);
        }
      } else {
        draw.circleHelper.addCircle(radius);
      }
    }

    draw.textTagHelper.addText();
    draw.arrowImageHelper.addImage();
    draw.groupHelper.add();

    if (draw.options.wiseFaceDetection !== false) {
      draw.wiseFaceDetectionHelper.add();
    }
  }

  // @DrawView
  function appendDom() {
    //appending sequense is important.
    //Group -> Polygon -> Line -> Circle -> Text
    draw.groupHelper.append();
    draw.polygonHelper.append();
    draw.lineHelper.appendAll();
    draw.circleHelper.appendAll();
    draw.textTagHelper.append();
    draw.arrowImageHelper.append();

    if (draw.options.wiseFaceDetection !== false) {
      draw.wiseFaceDetectionHelper.append();
    }
  }

  // @DrawView
  function resetElementStatus() {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    var polygon = draw.polygonHelper.getPolygon();

    if (draw.selectedLineIndex !== null) {
      lines[draw.selectedLineIndex].isSelected = false;
      draw.selectedLineIndex = null;
    }

    if (draw.selectedCircleIndex !== null) {
      circles.forEach(function(circle){
        if(circle.isSelected === true){
          circle.isSelected = false;
        }
      });

      draw.selectedCircleIndex = null;
    }

    if (draw.options.fill === true) {
      polygon.isSelected = false;
      selectedPolygon = null;
    }

    if (draw.options.fixedRatio === true) {
      parentSvg.ratio = [];
    }

    parentSvg.startAxis = null;

    if (draw.drawModel.isAllSelected === false) {
      draw.resetAllColor();
    }

    draw.drawView.resetCursor(parentSvg);
  }

  // @DrawView
  function resetParentSvgAttr() {
    setTimeout(function() {
      product.setParentSvgAttr(product.getParentMovedAttr(), false);
    }, 100);
  }

  // @DrawController
  function callCustomEvent(eventName, arg) {
    var method = '';

    if (
      (draw.options.useResizeRectangle === true || draw.options.useEvent === true) &&
      draw.options.event !== null &&
      draw.options.customDraw === false
    ) {
      if (eventName in draw.options.event) {
        method = Array.isArray(arg) === true ? "apply" : "call";
        draw.options.event[eventName][method](draw, arg);
      }
    }
  }

  // @DrawView
  function toggleDraggingStatus(statusType) {
    var method = statusType === true ? "add" : "remove";
    var className = "svg-geometry";

    document.body.classList[method](className);
  }

  // @DrawController
  function parentSVGMouseUpHandle() {
    toggleDraggingStatus(false);

    if (draw.selectedCircleIndex !== null && draw.circleHelper.isMouseLeave()) {
      draw.circleHelper.update();
    }

    if (draw.selectedLineIndex !== null) {
      callCustomEvent("mouseup", draw.getData());
    }

    resetElementStatus();
    resetParentSvgAttr();
  }

  /* mousedown에 세팅한 값은 항상 mouseup에 리셋을 해줘야 한다. */
  // @DrawController
  function parentSVGMouseDownHandle(event) {
    var idx = 0;
    var len = 0;
    var circles = draw.circleHelper.getCircles();
    var lines = draw.lineHelper.getLines();
    var polygon = draw.polygonHelper.getPolygon();

    parentSvg.startAxis = product.getPageAxis(event);

    for (idx = 0, len = circles.length; idx < len; idx++) {
      if (circles[idx].isSelected === true) {
        draw.selectedCircleIndex = idx;
        break;
      }
    }

    //Check selected Line
    if (draw.selectedCircleIndex === null && draw.options.fixedRatio === false) {
      for (idx = 0, len = lines.length; idx < len; idx++) {
        if (lines[idx].isSelected === true) {
          draw.selectedLineIndex = idx;
          break;
        }
      }
    }

    if (draw.options.fixedRatio === true && draw.options.ratio !== false) {
      parentSvg.ratio = draw.options.ratio;
    } else if (draw.selectedCircleIndex !== null && draw.options.fixedRatio === true) {
      //최대 공약수를 구해서 메모리 최적화 필요
      parentSvg.ratio = [
        draw.options.points[2][0] - draw.options.points[0][0],
        draw.options.points[2][1] - draw.options.points[0][1]
      ];
    }

    if (draw.options.fill === true) {
      if (polygon.isSelected === true) {
        selectedPolygon = true;
      }
    }

    if (draw.options.customDraw === true) {
      draw.selectedCircleIndex =
        (draw.options.useOnlyRectangle === true || draw.options.useRectangleForCustomDraw === true) ?
          2 :
          circles.length - 1;
      toggleDraggingStatus(true);
    } else if (
      (draw.options.customDraw === false) &&
      draw.selectedCircleIndex !== null ||
      draw.selectedLineIndex !== null ||
      selectedPolygon !== null
    ) {
      product.setParentSvgAttr(product.getParentMovedAttr(), true);
      toggleDraggingStatus(true);
    }
  }

  // @DrawController
  function parentSVGMouseMoveHandle(event) {
    if (draw.options.customDraw === true && draw.selectedCircleIndex === null) {
      parentSVGMouseDownHandle(event);
    }

    if (
      draw.selectedCircleIndex === null &&
      draw.selectedLineIndex === null &&
      selectedPolygon === null &&
      draw.options.customDraw === false
    ) {
      return;
    }

    var pageAxis = product.getPageAxis(event);
    var xAxis = pageAxis[0];
    var yAxis = pageAxis[1];

    var movedXAxis = xAxis - parentSvg.startAxis[0];
    var movedYAxis = yAxis - parentSvg.startAxis[1];

    var offsetWidth = product.parentOffset().width;
    var offsetHeight = product.parentOffset().height;

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

    //포인트를 선택하여 영역을 이동 시킬 때
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

      /*if(
      	draw.drawModel.validateAxis(xAxis, yAxis) === false
      	){
      	return;
      }*/

      //사각형 리사이징
      if (draw.options.fixedRatio === true || draw.options.useRectangleForCustomDraw === true) {

        //사각형
        if (draw.options.useOnlyRectangle === true || draw.options.useRectangleForCustomDraw === true) {
          changedX1 = firstPoint[0];
          changedX2 = xAxis;
          changedY1 = firstPoint[1];
          changedY2 = yAxis;

          //가로 Min, Max Validation
          if (!validateGeometrySize(
              Math.abs(changedX1 - changedX2),
              Math.abs(changedY1 - thirdPoint[1])
            )) {
            changedX2 = thirdPoint[0];
          }

          //세로 Min, Max Validation
          if (!validateGeometrySize(
              Math.abs(changedX1 - thirdPoint[0]),
              Math.abs(changedY1 - changedY2)
            )) {
            changedY2 = thirdPoint[1];
          }
        } else { //고정비 확대
          var totalMovement = Math.abs(movedXAxis) + Math.abs(movedYAxis);

          var incrementXAxis = parentSvg.ratio[0] / (parentSvg.ratio[1] + parentSvg.ratio[0]) * totalMovement;

          if (movedXAxis < 0 || movedYAxis < 0) {
            incrementXAxis *= -1;
          }

          changedX1 = firstPoint[0];
          changedX2 = xAxis + incrementXAxis;
          changedY1 = firstPoint[1];
          changedY2 = changedY1 + ((changedX2 - changedX1) * parentSvg.ratio[1] / parentSvg.ratio[0]);

          //변경된좌표 체크
          if (draw.drawModel.validateAxis(changedX2, changedY2) === false) {
            /**
             * @date 2017-04-24
             * maxSize로 적용한 것은 최대 사이즈로 정상 적용을 위해서 이다.
             * 두번재 (x,y)가 0 보다 작을 때는 최소 사이즈보다 작을 때 이므로,
             * 분기를 추가 한다.
             */
            if (
              (changedX1 === 0 && changedY1 === 0) &&
              (changedX2 > 0 && changedY2 > 0)
            ) {
              changedX2 = draw.options.maxSize.width;
              changedY2 = draw.options.maxSize.height;
            } else {
              return;
            }
          }

          //Min, Max Validation
          if (!validateGeometrySize(Math.abs(changedX1 - changedX2), Math.abs(changedY1 - changedY2))) {
            return;
          }
        }

        //뒤집어지는 것을 방지 하기 위해 세번째 포인트가 첫번째 포인트 보다 적을 때 return
        if (
          draw.options.useRectangleForCustomDraw === false &&
          (firstPoint[0] > changedX2 || firstPoint[1] > changedY2)
        ) {
          return;
        }

        changeRectangle(changedX1, changedY1, changedX2, changedY2);

        //라인과 폴리곤 사각형의 Circle
      } else {
        var validateAxis = [];
        var leftAxisIndex = 0;
        var rightAxisIndex = 0;
        /**
         * Custom Drawing 중일 때는 Line 제한을 하지 않고,
         * custom 함수에서 클릭시 제한을 한다.
         */
        if (
          draw.options.customDraw === false &&
          draw.options.minLineLength !== false) {
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

        if (validateStabilization(prevPoints) === false) {
          return;
        }

        draw.drawModel.setAxis(draw.selectedCircleIndex, xAxis, yAxis);
      }
      //라인을 선택하여 이동할 때
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
      if (
        draw.drawModel.validateAxis(changedX1, changedY1) === false ||
        draw.drawModel.validateAxis(changedX2, changedY2) === false
      ) {
        changedX1 = startAxis[0];
        changedY1 = startAxis[1];
        changedX2 = endAxis[0];
        changedY2 = endAxis[1];
      }

      prevPoints = draw.drawModel.getPoints();
      prevPoints[draw.selectedLineIndex] = [changedX1, changedY1];
      prevPoints[endAxisIndex] = [changedX2, changedY2];

      if (validateStabilization(prevPoints) === false) {
        return;
      }

      draw.drawModel.setAxis(draw.selectedLineIndex, changedX1, changedY1);
      draw.drawModel.setAxis(endAxisIndex, changedX2, changedY2);
      //영역을 선택하여 이동할 때
    } else if (draw.options.fill === true || draw.selectedLineIndex !== null) {
      var isMoveOk = false;
      polygon = draw.polygonHelper.getPolygon();

      if (polygon !== null) {
        isMoveOk = polygon.isSelected === true;
      } else {
        isMoveOk = draw.selectedLineIndex !== null
      }

      /*
      Polygon 이동 시 좌표 유효성 체크
      Polygon은 도형 전체가 움직이므로 모든 Point의 좌표를 체크한다.
      */
      if (draw.options.useOnlyRectangle === true || draw.options.fixedRatio === true) {
        if (
          firstPoint[0] + movedXAxis < 0 ||
          thirdPoint[0] + movedXAxis > offsetWidth) {
          movedXAxis = 0;
        }

        if (
          firstPoint[1] + movedYAxis < 0 ||
          thirdPoint[1] + movedYAxis > offsetHeight) {
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
        for (var idx = 0; idx < pointsLength; idx++) {
          self = draw.drawModel.getAxis(idx);
          draw.drawModel.setAxis(idx, self[0] + movedXAxis, self[1] + movedYAxis);
        }
      }
    }

    parentSvg.startAxis = [xAxis, yAxis];

    //Update
    draw.changeAxis();
  }

  //Bind Event
  // @DrawController
  function bindEvent() {
    if (
      draw.options.useResizeRectangle === true ||
      draw.options.useEvent === true ||
      draw.options.customDraw === true) {
      parentSvg.startAxis = null;
      EventController.bindBodyEvent('mousedown', parentSVGMouseDownHandle);
      EventController.bindBodyEvent('mousemove', parentSVGMouseMoveHandle);
      EventController.bindBodyEvent('mouseup', parentSVGMouseUpHandle);
      EventController.bindBodyEvent('mouseleave', parentSVGMouseUpHandle);
    }
  }

  // @DrawView
  function init() {
    createSVGElement();

    if (draw.options.initCenter === true) {
      draw.drawModel.alignCenter();
    }

    draw.changeAxis();
    draw.resetAllColor();
    bindEvent();
    appendDom();
  }

  // @DrawView
  function addPoint(xAxis, yAxis, appendIndex) {
    var newCircleRadius = draw.options.circleRadius;
    var pointsLength = draw.drawModel.getPointsLength();
    //Set Axis
    if (typeof appendIndex !== "undefined") {
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
  }

  // @DrawView
  function removeAllElement() {
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
  }

  // @DrawView
  function reset() {
    removeAllElement();
    unbindEvent();
    draw.lineHelper.setLines([]);
    draw.circleHelper.setCircles([]);
    draw.polygonHelper.setPolygon(null);
    draw.textTagHelper.setTextTag(null);
    draw.arrowImageHelper.resetData();
  }

  // @DrawController
  function unbindEvent() {
    EventController.unbindBodyEvent('mousedown', parentSVGMouseDownHandle);
    EventController.unbindBodyEvent('mousemove', parentSVGMouseMoveHandle);
    EventController.unbindBodyEvent('mouseup', parentSVGMouseUpHandle);
    EventController.unbindBodyEvent('mouseleave', parentSVGMouseUpHandle);
    // document.documentElement.removeEventListener('mouseup', documentElementMouseMoveHandle);
  }

  // @DrawController
  function endDraw() {
    draw.options.customDraw = false;
    draw.options.useRectangleForCustomDraw = false;
    resetElementStatus();
    resetParentSvgAttr();
  }

  // @DrawController
  function changeRectangleToSize(width, height) {
    if (draw.options.useOnlyRectangle !== true && draw.options.fixedRatio !== true) {
      return;
    }

    var firstPoint = draw.drawModel.getAxis(0);
    var thirdPoint = draw.drawModel.getAxis(2);
    var offset = product.parentOffset();
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

    changeRectangle(changedX1, changedY1, changedX3, changedY3, true);
    draw.changeAxis();
  }

  // @DrawController
  function changeRectangle(x1, y1, x2, y2, flagForchangeFirstAxis) {
    if (flagForchangeFirstAxis === true) {
      draw.drawModel.setAxis(0, x1, y1);
    }

    draw.drawModel.setAxis(draw.rectangleIndex[1], x1, y2);
    draw.drawModel.setAxis(draw.rectangleIndex[2], x2, y2);
    draw.drawModel.setAxis(draw.rectangleIndex[3], x2, y1);
  }

  // @DrawView
  function changeNormalStatus() {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();

    lines.forEach(function(line){
      draw.lineHelper.hide(line);
    });

    circles.forEach(function(circle){
      draw.circleHelper.hide(circle);
    });

    if (draw.useArrow === true) {
      draw.arrowImageHelper.hide();
    }

    draw.textTagHelper.hide();

    draw.resetAllColor();
  }

  // @DrawView
  function changeActiveStatus() {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();

    lines.forEach(function(line){
      draw.lineHelper.show(line);
    });

    circles.forEach(function(circle){
      draw.circleHelper.show(circle);
    });

    if (draw.useArrow === true) {
      draw.arrowImageHelper.show();
    }

    draw.textTagHelper.show();

    draw.setAllColor();
  }

  // @DrawView
  function createArrow(arrowOptions) {
    draw.useArrow = true;
    draw.options.arrow = CommonUtils.cloneObject(arrowOptions);
    draw.arrowImageHelper.addImage();
    draw.changeAxis();
    draw.arrowImageHelper.append();
  }

  // @DrawUtil
  function validateMinimumAngle(prevPoints) {
    var returnVal = true;
    var points = [];
    var pointsLength = 0;

    try {
      points = typeof prevPoints === "undefined" ?
        CommonUtils.cloneObject(draw.drawModel.getPoints()) :
        CommonUtils.cloneObject(prevPoints);
      pointsLength = points.length;

      /**
       * 삼각형부터 체크
       */
      if (pointsLength >= 3 && draw.options.fill === true) {
        for (var i = 0; i < pointsLength; i++) {
          var firstPoint = [];
          var vertextAngle = Math.abs(FunnyMath.getVertextAngle(points[0], points[1], points[2]));

          if (vertextAngle < MINIMUM_ANGLE) {
            returnVal = false;
            break;
          }

          firstPoint = points.shift();
          points.push(firstPoint);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    return returnVal;
  }

  // @DrawUtil
  function validateIntersection(prevPoints) {
    var returnVal = true;
    var points = 0;
    var pointsLength = 0;

    //고정비 사각형, 직각사각형, 라인은 교차 체크를 하지 않음.
    if (draw.options.fill === false || draw.options.fixedRatio === true) {
      return;
    }

    try {
      points = typeof prevPoints === "undefined" ?
        CommonUtils.cloneObject(draw.drawModel.getPoints()) :
        CommonUtils.cloneObject(prevPoints);
      pointsLength = points.length;

      for (var i = 0; i < pointsLength - 1; i++) {
        var firstLineFirstPoint = points[i];
        var firstLineSecondPoint = points[i + 1];

        for (var j = i + 1; j < pointsLength; j++) {
          var secondLineFirstPoint = points[j];
          var secondLineSecondPointIndex = ((j + 1) === pointsLength ? 0 : (j + 1));
          var secondLineSecondPoint = points[secondLineSecondPointIndex];

          if (FunnyMath.checkLineIntersection(
              firstLineFirstPoint[0],
              firstLineFirstPoint[1],
              firstLineSecondPoint[0],
              firstLineSecondPoint[1],
              secondLineFirstPoint[0],
              secondLineFirstPoint[1],
              secondLineSecondPoint[0],
              secondLineSecondPoint[1]
            ) === false) {
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
    var points = typeof prevPoints === "undefined" ?
      CommonUtils.cloneObject(draw.drawModel.getPoints()) :
      CommonUtils.cloneObject(prevPoints);
    var returnVal = true;

    if (validateMinimumAngle(points) === false || validateIntersection(points) === false) {
      returnVal = false;
    }

    return returnVal;
  }

  // @DrawView
  function validateGeometrySize (geometryWidth, geometryHeight) {
    if (typeof draw.options.minSize !== "undefined") {
      if (geometryWidth < draw.options.minSize.width || geometryHeight < draw.options.minSize.height) {
        return false
      }
    }

    if (typeof draw.options.maxSize !== "undefined") {
      if (geometryWidth > draw.options.maxSize.width || geometryHeight > draw.options.maxSize.height) {
        return false
      }
    }

    return true
  }
}

SVGGeometry.addPlugin('draw', Draw);