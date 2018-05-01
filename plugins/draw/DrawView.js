function DrawView (draw, product) {
  draw.groupHelper = new GroupHelper(draw, product);
  draw.wiseFaceDetectionHelper = new WiseFaceDetectionHelper(draw, product);
  draw.lineHelper = new LineHelper(draw, product);
  draw.circleHelper = new CircleHelper(draw, product);
  draw.textTagHelper = new TextTagHelper(draw, product);
  draw.polygonHelper = new PolygonHelper(draw, product);
  draw.arrowImageHelper = new ArrowImageHelper(draw, product);

  this.getArrow = draw.arrowImageHelper.getArrow
  this.changeArrow = draw.arrowImageHelper.changeArrow
  this.moveTopLayer = draw.groupHelper.moveTopLayer
  this.changeFillColor = draw.wiseFaceDetectionHelper.changeFillColor
  this.changeAxis = function() {
    var polygonPoint = '';
    var height = 0;
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();
    var textTag = draw.textTagHelper.getTextTag();
    var polygon = draw.polygonHelper.getPolygon();
    var points = draw.drawModel.getPoints();

    for (var idx = 0, len = lines.length; idx < len; idx++) {
      var startAxis = points[idx];
      var endAxisIndex = draw.options.fill === true && idx === len - 1 ? 0 : idx + 1;
      var endAxis = points[endAxisIndex];
      var startXAxis = startAxis[0];
      var endXAxis = endAxis[0];

      lines[idx].setAttributeNS(null, 'x1', startXAxis);
      lines[idx].setAttributeNS(null, 'y1', startAxis[1]);
      lines[idx].setAttributeNS(null, 'x2', endXAxis);
      lines[idx].setAttributeNS(null, 'y2', endAxis[1]);
    }

    for (idx = 0, len = circles.length; idx < len; idx++) {
      var pointAxis = points[idx];
      var circleXAxis = pointAxis[0];
      var circleYAxis = pointAxis[1];
      var selfCircle = circles[idx];
      var width = parseInt(ElementController.getAttr(selfCircle, 'width'));
      height = parseInt(ElementController.getAttr(selfCircle, 'height'));

      /**
       * 고정비 사각형일 때, 부모의 영역를 넘어갈 경우 Safari에서
       * 정상적으로 Cursor가 지정이 안되므로 2px 이동 시킨다.
       */
      if (draw.options.fixedRatio === false && draw.options.useOnlyRectangle === false) {
        circleXAxis -= width / 2;
        circleYAxis -= height / 2;
      } else if (draw.options.fixedRatio === true) {
        switch (idx) {
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

      selfCircle.setAttributeNS(null, "x", circleXAxis);
      selfCircle.setAttributeNS(null, "y", circleYAxis);

      if (idx === len - 1 && draw.options.textInCircle !== null) {
        textTag.setAttributeNS(null, 'x', pointAxis[0] - 3);
        textTag.setAttributeNS(null, 'y', pointAxis[1] + 4);
      }

      if (draw.options.fill === true) {
        polygonPoint += pointAxis[0] + ',' + pointAxis[1] + ' ';
      }
    }

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

      if ("heightRatio" in draw.options.wiseFaceDetection) {
        height = firstPoint[1] - secondPoint[1];
      } else if ("widthRatio" in draw.options.wiseFaceDetection) {
        height = firstPoint[0] - secondPoint[0];
      }

      height = Math.abs(height);

      draw.wiseFaceDetectionHelper.updateCircle(xAxis, yAxis, height);
    }
  };
  this.resetAllColor = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();

    for (var idx = 0, len = lines.length; idx < len; idx++) {
      draw.lineHelper.setDefaultColor(lines[idx]);
    }
    for (idx = 0, len = circles.length; idx < len; idx++) {
      draw.circleHelper.setDefaultColor(circles[idx]);
    }

    draw.polygonHelper.setDefaultColor();
  }
  this.setAllColor = function () {
    var lines = draw.lineHelper.getLines();
    var circles = draw.circleHelper.getCircles();

    for (var idx = 0, len = lines.length; idx < len; idx++) {
      draw.lineHelper.setSelectColor(lines[idx]);
    }
    for (idx = 0, len = circles.length; idx < len; idx++) {
      draw.circleHelper.setSelectColor(circles[idx]);
    }

    draw.polygonHelper.setSelectColor();
  }
  this.setCursor = function (element) {
    element.style.cursor = draw.options.useCursor ? 'pointer' : 'default';
  }
  this.resetCursor = function(element) {
    element.style.cursor = 'default';
  }
}