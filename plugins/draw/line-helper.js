/**
 * Line 태그 Helper
 */
function LineHelper(draw, product) {
  "use strict";
  var parentSvgMovedAttr = 'is-moved';
  var lines = [];
  var tempArrForDragChecking = [];
  var iconHelper = new IconHelper(draw.groupHelper);
  var hideOpacity = '0.5';
  var hoveredLineIndex = null;
  var iconHelperTimer = null;

  iconHelper.onClick(function(event) {
    backupPoints(); //addPointInLine에서 드래그 체크를 하기 때문에 추가
    addPointInLine.call({
      lineIndex: hoveredLineIndex
    }, event);
    iconHelper.hide();
  });

  iconHelper.onLeave(iconHelper.hide);

  function backupPoints() {
    tempArrForDragChecking = draw.geometryManager.getPoints();
  }

  function isPointsChanged() {
    var returnVal = true;
    var currentPoints = draw.geometryManager.getPoints();
    if (tempArrForDragChecking.length !== currentPoints.length) {
      returnVal = false;
    }

    for (var i = 0, ii = tempArrForDragChecking.length; i < ii; i++) {
      if (
        tempArrForDragChecking[i][0] !== currentPoints[i][0] ||
        tempArrForDragChecking[i][1] !== currentPoints[i][1]) {
        returnVal = false;
        break;
      }
    }

    tempArrForDragChecking = [];

    return returnVal;
  }

  function addLine(useLineEvent, useLineCursor) {
    var newLine = ElementController.createLine(draw.options.lineStrokeWidth);
    newLine.lineIndex = lines.length;
    if (draw.options.useEvent === true && useLineEvent !== false) {
      bindEvent(newLine);
    }
    setDefaultColor(newLine);
    if (useLineCursor !== false) {
      draw.setCursor(newLine);
    }
    lines.push(newLine);
  }

  function setDefaultColor(lineElement) {
    ElementController.setAttr(lineElement, 'stroke', draw.options.lineColor);
  }

  function setSelectColor(lineElement) {
    ElementController.setAttr(lineElement, 'stroke', draw.options.lineColor);
  }

  function hide(lineElement) {
    if (draw.options.fill === true) {
      lineElement.style.display = 'none';
    } else {
      lineElement.style.opacity = hideOpacity;
    }
  }

  function show(lineElement) {
    if (draw.options.fill === true) {
      lineElement.style.display = 'inline';
    } else {
      lineElement.style.opacity = 1;
    }
  }

  function showPointIcon(event) {
    var pointsLength = draw.geometryManager.points.length;
    clearTimeout(iconHelperTimer);
    if (
      product.getParentSvgAttr(parentSvgMovedAttr) === 'true' || //폴리건 드래그를 하고 있을 때
      draw.selectedLineIndex !== null || //드래그를 하고 있을 때
      this.style.opacity === hideOpacity || //선택된 오브젝트가 아닐 때
      pointsLength >= draw.options.maxPoint) { //최대 포인트일 때
      return;
    }
    var pageAxis = product.getPageAxis(event);
    var xAxis = pageAxis[0];
    var yAxis = pageAxis[1];
    var leftAxis = null;
    var rightAxis = null;


    if (draw.options.minLineLength !== false) {
      leftAxis = draw.geometryManager.getAxis(this.lineIndex);
      rightAxis = draw.geometryManager.getAxis(this.lineIndex === lines.length - 1 ? 0 : this.lineIndex + 1);

      if (
        FunnyMath.pythagoreanTheorem(xAxis, yAxis, leftAxis[0], leftAxis[1]) < draw.options.minLineLength ||
        FunnyMath.pythagoreanTheorem(xAxis, yAxis, rightAxis[0], rightAxis[1]) < draw.options.minLineLength
      ) {
        return;
      }
    }

    iconHelper.changePosition(pageAxis[0], pageAxis[1]);
    hoveredLineIndex = this.lineIndex;
    iconHelper.show();

    iconHelperTimer = setTimeout(function(){
      iconHelper.hide();
    }, product.getIconHiddenDelay());
  }

  function mouseUpHandler() {
    setTimeout(function() {
      draw.callCustomEvent("mouseup", draw.getData());
    });	
  }

  function contextMenuHandler(event){
    draw.callCustomEvent("linecontextmenu", event);
  }

  function bindEvent(lineElement) {
    lineElement.addEventListener('contextmenu', contextMenuHandler);

    if (draw.options.useOnlyRectangle === false && draw.options.fixedRatio === false) {
      //Add Point
      lineElement.addEventListener('mousemove', showPointIcon);
      if(draw.options.fill === false){
        iconHelper.onContextMenu(contextMenuHandler);
        
        lineElement.addEventListener('mousedown', selectLine);
        lineElement.addEventListener('mouseup', mouseUpHandler);
        lineElement.addEventListener('mouseleave', function() {
          if (this.isSelected === true) {
            mouseUpHandler();
          }
        });
      }
    }
  }

  function addPointInLine(event) {
    var pageAxis = null;
    var xAxis = null;
    var yAxis = null;
    var pointsLength = draw.geometryManager.getPointsLength();

    if (isPointsChanged() === false) {
      // console.log("isPointsChanged() === false return");
      return;
    }

    if (pointsLength >= draw.options.maxPoint) {
      // console.log("pointsLength >= draw.options.maxPoint return");
      return;
    }

    pageAxis = product.getPageAxis(event);
    xAxis = pageAxis[0];
    yAxis = pageAxis[1];

    draw.addPoint(xAxis, yAxis, this.lineIndex + 1);
    
    mouseUpHandler();
  }

  function appendAll() {
    for (var i = 0, len = lines.length; i < len; i++) {
      draw.groupHelper.appendChild(lines[i]);
    }

    iconHelper.createIcon(true);
  }

  function selectLine() {
    setSelectColor(this);
    this.isSelected = true;
    draw.groupHelper.moveTopLayer();
    backupPoints();
  }

  function appendAtLast() {
    var lineLength = lines.length;
    var newLineElement = lines[lineLength - 1];
    var nextElementSibling = lines[lineLength - 2].nextElementSibling;

    draw.groupHelper.insertBefore(
      newLineElement,
      nextElementSibling
    );
  }

  function removeAll() {
    for (var i = 0, len = lines.length; i < len; i++) {
      draw.groupHelper.removeChild(lines[i]);
    }
  }

  function getLines(){
    return lines;
  }

  function setLines(_lines){
    lines = _lines;
  }

  this.addLine = addLine
  this.setDefaultColor = setDefaultColor
  this.setSelectColor = setSelectColor
  this.appendAll = appendAll
  this.appendAtLast = appendAtLast
  this.bindEvent = bindEvent
  this.removeAll = removeAll
  this.hide = hide
  this.show = show
  this.getLines = getLines
  this.setLines = setLines
}