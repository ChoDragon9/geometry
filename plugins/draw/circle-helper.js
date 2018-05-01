/**
 * Polygon과 Line 꼭지점 Helper
 */
function CircleHelper(draw, product) {

  var parentSvg = product.getParentSvg();
  var isLeave = false;
  var iconHelper = new IconHelper(draw.groupHelper);
  var iconHelperTimer = null;
  var hoveredPointIndex = null;
  var circles = [];

  iconHelper.onClick(function(event) {
    iconHelper.hide();
    removeCircle.call({
      circleIndex: hoveredPointIndex
    }, event);
    update();
  });

  function addCircle(radius, useCircleEvent, useCircleCursor) {
    var newCircle = ElementController.createRect(radius * 2, radius * 2);
    if (
      draw.options.useResizeRectangle === true ||
      draw.options.useEvent === true &&
      useCircleEvent !== false) {
      bindEvent(newCircle);
    }
    setDefaultColor(newCircle);
    if (useCircleCursor !== false) {
      draw.setCursor(newCircle);
    }

    newCircle.circleIndex = circles.length;
    circles.push(newCircle);
  }

  function bindEvent(circleElement) {
    circleElement.onmousedown = selectCircle;
    circleElement.onmouseup = function() {
      isLeave = false;
      if (draw.options.customDraw === true) {
        return;
      }
      update();
    };
    circleElement.addEventListener('mouseleave', function() {
      isLeave = true;
    });

    if (draw.options.fixedRatio !== true) {
      circleElement.customContextmenu = removeCircle;
      circleElement.addEventListener('contextmenu', function(event) {
        event.preventDefault();
      });
      circleElement.addEventListener('mouseover', showDeleteIcon);
      circleElement.addEventListener('mouseout', hideDeleteIconWithDelay);
      circleElement.addEventListener('mousedown', hideDeleteIcon);
    }
  }

  function showDeleteIcon() {
    var pointsLength = draw.drawModel.getPointsLength();

    if (
      draw.selectedCircleIndex !== null ||
      pointsLength <= draw.options.minPoint) { //최대 포인트일 때
      return;
    }

    hoveredPointIndex = this.circleIndex;

    var xAxis = parseInt(ElementController.getAttr(this, 'x'));
    var yAxis = parseInt(ElementController.getAttr(this, 'y'));
    var width = parseInt(ElementController.getAttr(this, 'width'));
    var height = parseInt(ElementController.getAttr(this, 'height'));

    if (xAxis - width * 2 < 0) {
      xAxis += width * 2;
    } else {
      xAxis -= width;
    }

    if (yAxis - width * 2 < 0) {
      yAxis += height * 2;
    } else {
      yAxis -= height;
    }

    clearTimeout(iconHelperTimer);

    iconHelper.changePosition(xAxis, yAxis);
    iconHelper.show();
  }

  function hideDeleteIcon() {
    iconHelper.hide();
  }

  function hideDeleteIconWithDelay() {
    clearTimeout(iconHelperTimer);
    iconHelperTimer = setTimeout(function() {
      iconHelper.hide();
    }, product.getIconHiddenDelay());
  }

  function update() {
    setTimeout(function() {
      draw.callCustomEvent("mouseup", draw.getData());
    });
  }

  function isMouseLeave() {
    return isLeave;
  }

  function removeCircle(event) {
    var self = this;
    var points = draw.drawModel.getPoints();
    var pointsLength = points.length;

    event.preventDefault();

    if (pointsLength <= draw.options.minPoint) {
      return;
    }

    if (this.nodeName === "text") {
      self = circles[pointsLength - 1];
    }

    points.splice(self.circleIndex, 1);
    draw.drawModel.setPoints(points);
    draw.reset();
    draw.init();
    draw.changeActiveStatus();
  }

  function selectCircle() {
    isLeave = false;
    var self = this;
    var pointsLength = draw.drawModel.getPointsLength();
    if (this.nodeName === "text") {
      self = circles[pointsLength - 1];
    }

    setSelectColor(self);
    self.isSelected = true;
    draw.setCursor(parentSvg);
  }

  function setDefaultColor(circleElement) {

    ElementController.setAttr(circleElement, "fill", draw.options.pointColor);
  }

  function setSelectColor(circleElement) {
    ElementController.setAttr(circleElement, "fill", draw.options.pointColor);
  }

  function hide(circleElement) {
    circleElement.style.display = 'none';
  }

  function show(circleElement) {
    circleElement.style.display = 'inline';
  }

  function appendAll() {
    for (var i = 0, len = circles.length; i < len; i++) {
      draw.groupHelper.appendChild(circles[i]);
    }
    
    iconHelper.createIcon(false);
  }

  function changeRadius(index, radius) {
    ElementController.setAttr(circles[index], 'width', radius * 2);
    ElementController.setAttr(circles[index], 'height', radius * 2);
  }

  function appendAtLast() {
    var circleLength = circles.length;
    var newCircleElement = circles[circleLength - 1];
    var nextElementSibling = circles[circleLength - 2].nextElementSibling;

    if (draw.options.textInCircle === null || nextElementSibling === null) {
      draw.groupHelper.appendChild(newCircleElement);
    } else {
      draw.groupHelper.insertBefore(
        newCircleElement,
        nextElementSibling
      );
    }
  }

  function removeAll() {
    for (var i = 0, len = circles.length; i < len; i++) {
      draw.groupHelper.removeChild(circles[i]);
    }
  }

  function getCircles(){
    return circles;
  }

  function setCircles(_circles){
    circles = _circles;
  }

  this.addCircle = addCircle
  this.bindEvent = bindEvent
  this.selectCircle = selectCircle
  this.setDefaultColor = setDefaultColor
  this.setSelectColor = setSelectColor
  this.appendAll = appendAll
  this.changeRadius = changeRadius
  this.appendAtLast = appendAtLast
  this.removeAll = removeAll
  this.update = update
  this.isMouseLeave = isMouseLeave
  this.hide = hide
  this.show = show
  this.getCircles = getCircles
  this.setCircles = setCircles
}