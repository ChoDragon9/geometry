const GroupHelper = require('./group-helper')
const WiseFaceDetectionHelper = require('./wise-facedetection-helper')
const LineHelper = require('./line-helper')
const CircleHelper = require('./circle-helper')
const TextTagHelper = require('./text-helper')
const PolygonHelper = require('./polygon-helper')
const ArrowImageHelper = require('./arrow-image-helper')

const ElementController = require('../../common/ElementController')
const FunnyMath = require('../../common/FunnyMath')
const EventController = require('../../common/EventController')
const CommonUtils = require('../../common/CommonUtils')
const _ = require('../../common/fp')
const {MOVED_ATTR} = require('../../modules/constants')

module.exports = function DrawView (draw, rootSVG) { // eslint-disable-line
  var TEXT_POINT_RADIUS = 1.5

  var parentSvgRatio = []
  var parentSvgStartAxis = null

  var selectedPolygon = null

  var drawView = this

  draw.selectedCircleIndex = null
  draw.selectedLineIndex = null

  draw.groupHelper = new GroupHelper(draw, rootSVG)
  draw.wiseFaceDetectionHelper = new WiseFaceDetectionHelper(draw, rootSVG)
  draw.lineHelper = new LineHelper(draw, rootSVG)
  draw.circleHelper = new CircleHelper(draw, rootSVG)
  draw.textTagHelper = new TextTagHelper(draw, rootSVG)
  draw.polygonHelper = new PolygonHelper(draw, rootSVG)
  draw.arrowImageHelper = new ArrowImageHelper(draw, rootSVG)

  this.getArrow = draw.arrowImageHelper.getArrow
  this.changeArrow = draw.arrowImageHelper.changeArrow
  this.moveTopLayer = draw.groupHelper.moveTopLayer
  this.changeFillColor = draw.wiseFaceDetectionHelper.changeFillColor
  this.changeAxis = function () {
    var polygonPoint = ''
    var height = 0
    var lines = draw.lineHelper.getLines()
    var circles = draw.circleHelper.getCircles()
    var textTag = draw.textTagHelper.getTextTag()
    var polygon = draw.polygonHelper.getPolygon()
    var points = draw.drawModel.getPoints()

    _.each((line, index, lines, len) => {
      const endAxisIndex = draw.options.fill === true && index === len - 1 ? 0 : index + 1
      const [x1, y1] = points[index]
      const [x2, y2] = points[endAxisIndex]

      _.divEq(
        ElementController.setAttr('x1', x1),
        ElementController.setAttr('y1', y1),
        ElementController.setAttr('x2', x2),
        ElementController.setAttr('y2', y2)
      )(line)
    })(lines)

    _.each((circle, index, _, len) => {
      var pointAxis = points[index]
      var circleXAxis = pointAxis[0]
      var circleYAxis = pointAxis[1]
      var width = parseInt(ElementController.getAttr('width')(circle))
      var height = parseInt(ElementController.getAttr('height')(circle))

      /**
       * 고정비 사각형일 때, 부모의 영역를 넘어갈 경우 Safari에서
       * 정상적으로 Cursor가 지정이 안되므로 2px 이동 시킨다.
       */
      if (draw.options.fixedRatio === false && draw.options.useOnlyRectangle === false) {
        circleXAxis -= width / 2
        circleYAxis -= height / 2
      } else if (draw.options.fixedRatio === true) {
        switch (index) {
          case draw.rectangleIndex[0]:
            circleXAxis -= width - draw.options.lineStrokeWidth / 2
            circleYAxis -= height - draw.options.lineStrokeWidth / 2
            break
          case draw.rectangleIndex[1]:
            circleXAxis -= draw.options.lineStrokeWidth / 2
            circleYAxis -= height - draw.options.lineStrokeWidth / 2
            break
          case draw.rectangleIndex[2]:
            circleXAxis -= width - draw.options.lineStrokeWidth / 2
            circleYAxis -= height - draw.options.lineStrokeWidth / 2
            break
          case draw.rectangleIndex[3]:
            circleXAxis -= width - draw.options.lineStrokeWidth / 2
            circleYAxis -= draw.options.lineStrokeWidth / 2
            break
        }
      }

      circle.setAttributeNS(null, 'x', circleXAxis)
      circle.setAttributeNS(null, 'y', circleYAxis)

      if (index === len - 1 && draw.options.textInCircle !== null) {
        textTag.setAttributeNS(null, 'x', pointAxis[0] - 3)
        textTag.setAttributeNS(null, 'y', pointAxis[1] + 4)
      }

      if (draw.options.fill === true) {
        polygonPoint += pointAxis[0] + ',' + pointAxis[1] + ' '
      }
    })(circles)

    if (draw.options.fill === true) {
      polygon.setAttributeNS(null, 'points', polygonPoint.replace(/[\s]{1}$/, ''))
    }

    if (draw.useArrow === true) {
      draw.arrowImageHelper.changeArrowImage()
    }

    if (draw.options.wiseFaceDetection !== false) {
      var firstPoint = points[0]
      var secondPoint = points[1]
      var thridPoint = points[2]
      var xAxis = FunnyMath.getLineCenter(secondPoint[0], secondPoint[1], thridPoint[0], thridPoint[1])[0]
      var yAxis = FunnyMath.getLineCenter(firstPoint[0], firstPoint[1], secondPoint[0], secondPoint[1])[1]
      height = 0

      if ('heightRatio' in draw.options.wiseFaceDetection) {
        height = firstPoint[1] - secondPoint[1]
      } else if ('widthRatio' in draw.options.wiseFaceDetection) {
        height = firstPoint[0] - secondPoint[0]
      }

      height = Math.abs(height)

      draw.wiseFaceDetectionHelper.updateCircle(xAxis, yAxis, height)
    }
  }
  this.resetAllColor = function () {
    var lines = draw.lineHelper.getLines()
    var circles = draw.circleHelper.getCircles()

    _.each(line => draw.lineHelper.setDefaultColor(line))(lines)
    _.each(circle => draw.lineHelper.setDefaultColor(circle))(circles)

    draw.polygonHelper.setDefaultColor()
  }
  this.setAllColor = function () {
    var lines = draw.lineHelper.getLines()
    var circles = draw.circleHelper.getCircles()

    _.each(line => draw.lineHelper.setSelectColor(line))(lines)
    _.each(circle => draw.lineHelper.setSelectColor(circle))(circles)

    draw.polygonHelper.setSelectColor()
  }
  this.setCursor = function (element) {
    ElementController.style('cursor', draw.options.useCursor ? 'pointer' : 'default')(element)
  }
  this.resetCursor = function (element) {
    ElementController.style('cursor', 'default')(element)
  }
  this.createSVGElement = function () {
    var radius = draw.options.circleRadius
    var pointsLength = draw.drawModel.getPointsLength()
    var addLine = function () {
      if (draw.options.fixedRatio === true) {
        draw.lineHelper.addLine(false, false)
      } else {
        draw.lineHelper.addLine()
      }
    }

    _.loop((i, len) => {
      if (i < len - 1) {
        addLine()
      } else {
        if (draw.options.textInCircle !== null) {
          radius *= TEXT_POINT_RADIUS
        }

        if (draw.options.fill === true) {
          addLine()
          draw.polygonHelper.addPolygon()
        }
      }

      if (draw.options.fixedRatio === true) {
        if (i === draw.rectangleIndex[2]) {
          draw.circleHelper.addCircle(radius)
        } else {
          // Circle을 작게 그려서 안보이게 함.
          draw.circleHelper.addCircle(0, false, false)
        }
      } else {
        draw.circleHelper.addCircle(radius)
      }
    })(pointsLength)

    draw.textTagHelper.addText()
    draw.arrowImageHelper.addImage()
    draw.groupHelper.add()

    if (draw.options.wiseFaceDetection !== false) {
      draw.wiseFaceDetectionHelper.add()
    }
  }
  this.appendDom = function () {
    // appending sequense is important.
    // Group -> Polygon -> Line -> Circle -> Text
    draw.groupHelper.append()
    draw.polygonHelper.append()
    draw.lineHelper.appendAll()
    draw.circleHelper.appendAll()
    draw.textTagHelper.append()
    draw.arrowImageHelper.append()

    if (draw.options.wiseFaceDetection !== false) {
      draw.wiseFaceDetectionHelper.append()
    }
  }
  this.resetParentSvgAttr = function () {
    window.setTimeout(function () {
      ElementController.setAttr(MOVED_ATTR, false)(rootSVG)
    }, 100)
  }
  this.removeAllElement = function () {
    try {
      draw.lineHelper.removeAll()
      draw.circleHelper.removeAll()
      draw.polygonHelper.remove()
      draw.textTagHelper.remove()
      draw.arrowImageHelper.remove()

      if (draw.options.wiseFaceDetection !== false) {
        draw.wiseFaceDetectionHelper.remove()
      }

      draw.groupHelper.remove()
    } catch (e) {
      /**
       * hide 후 destroy를 하면 에러가 발생을 하는 데,
       * 현재 태그들이 삭제되었는 지 확인 하는 로직대신
       * 예외 처리가 간단하므로 예외처리를 한다.
       */
    }
  }
  this.addPoint = function (xAxis, yAxis, appendIndex) {
    var newCircleRadius = draw.options.circleRadius
    var pointsLength = draw.drawModel.getPointsLength()
    // Set Axis
    if (_.negate(_.isUndefined(appendIndex))) {
      draw.drawModel.addAxis(xAxis, yAxis, appendIndex)
    } else {
      draw.drawModel.addAxis(xAxis, yAxis)
    }

    draw.lineHelper.addLine()
    draw.lineHelper.appendAtLast()

    if (draw.options.textInCircle !== null) {
      newCircleRadius *= TEXT_POINT_RADIUS
    }

    draw.circleHelper.addCircle(newCircleRadius)

    draw.circleHelper.changeRadius(pointsLength - 1, draw.options.circleRadius)
    draw.circleHelper.appendAtLast()

    draw.changeAxis()

    if (draw.drawModel.isAllSelected) {
      draw.setAllColor()
    }
  }
  this.callCustomEvent = function (eventName, arg) {
    var method = ''

    if (
      (draw.options.useResizeRectangle === true || draw.options.useEvent === true) &&
      draw.options.event !== null &&
      draw.options.customDraw === false
    ) {
      if (eventName in draw.options.event) {
        method = Array.isArray(arg) === true ? 'apply' : 'call'
        draw.options.event[eventName][method](draw, arg)
      }
    }
  }
  this.createArrow = function (arrowOptions) {
    draw.useArrow = true
    draw.options.arrow = CommonUtils.cloneObject(arrowOptions)
    draw.arrowImageHelper.addImage()
    draw.changeAxis()
    draw.arrowImageHelper.append()
  }
  this.toggleDraggingStatus = function (statusType) {
    var method = statusType === true ? 'add' : 'remove'
    var className = 'svg-geometry'

    document.body.classList[method](className)
  }
  this.resetElementStatus = function () {
    var lines = draw.lineHelper.getLines()
    var circles = draw.circleHelper.getCircles()
    var polygon = draw.polygonHelper.getPolygon()

    if (draw.selectedLineIndex !== null) {
      lines[draw.selectedLineIndex].isSelected = false
      draw.selectedLineIndex = null
    }

    if (draw.selectedCircleIndex !== null) {
      circles.forEach(function (circle) {
        if (circle.isSelected === true) {
          circle.isSelected = false
        }
      })

      draw.selectedCircleIndex = null
    }

    if (draw.options.fill === true) {
      polygon.isSelected = false
      selectedPolygon = null
    }

    if (draw.drawModel.isAllSelected === false) {
      draw.resetAllColor()
    }

    drawView.resetCursor(rootSVG)

    if (draw.options.fixedRatio === true) {
      parentSvgRatio = []
    }

    parentSvgStartAxis = null
  }
  this.parentSVGMouseUpHandle = function () {
    drawView.toggleDraggingStatus(false)

    if (draw.selectedCircleIndex !== null && draw.circleHelper.isMouseLeave()) {
      draw.circleHelper.update()
    }

    if (draw.selectedLineIndex !== null) {
      drawView.callCustomEvent('mouseup', draw.getData())
    }

    drawView.resetElementStatus()
    drawView.resetParentSvgAttr()
  }
  this.parentSVGMouseDownHandle = function (event) {
    var idx = 0
    var len = 0
    var circles = draw.circleHelper.getCircles()
    var lines = draw.lineHelper.getLines()
    var polygon = draw.polygonHelper.getPolygon()
    const isSelected = item => item.isSelected

    parentSvgStartAxis = ElementController.getPageAxis(rootSVG, event)

    _.pipe(
      _.findIndex(isSelected),
      index => {
        index > -1 && (draw.selectedCircleIndex = index)
      }
    )(circles)


    // Check selected Line
    if (draw.selectedCircleIndex === null && draw.options.fixedRatio === false) {
      _.pipe(
        _.findIndex(isSelected),
        index => {
          index > -1 && (draw.selectedLineIndex = index)
        }
      )
    }

    if (draw.options.fixedRatio === true && draw.options.ratio !== false) {
      parentSvgRatio = draw.options.ratio
    } else if (draw.selectedCircleIndex !== null && draw.options.fixedRatio === true) {
      // 최대 공약수를 구해서 메모리 최적화 필요
      parentSvgRatio = [
        draw.options.points[2][0] - draw.options.points[0][0],
        draw.options.points[2][1] - draw.options.points[0][1]
      ]
    }

    if (draw.options.fill === true) {
      if (polygon.isSelected === true) {
        selectedPolygon = true
      }
    }

    if (draw.options.customDraw === true) {
      draw.selectedCircleIndex =
        (draw.options.useOnlyRectangle === true || draw.options.useRectangleForCustomDraw === true)
          ? 2
          : circles.length - 1
      drawView.toggleDraggingStatus(true)
    } else if (
      draw.selectedCircleIndex !== null ||
      draw.selectedLineIndex !== null ||
      selectedPolygon !== null
    ) {
      ElementController.setAttr(MOVED_ATTR, true)(rootSVG)
      drawView.toggleDraggingStatus(true)
    }
  }
  const moveRectangle = (event) => {
    let [changedX1, changedY1] = draw.drawModel.getAxis(draw.rectangleIndex[0])
    let [changedX2, changedY2] = ElementController.getPageAxis(rootSVG, event)
    let thirdPoint = draw.drawModel.getAxis(draw.rectangleIndex[2])

    // 가로 Min, Max Validation
    if (!drawView.validateGeometrySize(
        Math.abs(changedX1 - changedX2),
        Math.abs(changedY1 - thirdPoint[1])
      )) {
      changedX2 = thirdPoint[0]
    }

    // 세로 Min, Max Validation
    if (!drawView.validateGeometrySize(
        Math.abs(changedX1 - thirdPoint[0]),
        Math.abs(changedY1 - changedY2)
      )) {
      changedY2 = thirdPoint[1]
    }
    return [changedX1, changedY1, changedX2, changedY2]
  }
  const moveFixedRect = (event) => {
    var pageAxis = ElementController.getPageAxis(rootSVG, event)
    var xAxis = pageAxis[0]
    var yAxis = pageAxis[1]
    var firstPoint = draw.drawModel.getAxis(draw.rectangleIndex[0])

    var movedXAxis = xAxis - parentSvgStartAxis[0]
    var movedYAxis = yAxis - parentSvgStartAxis[1]

    var totalMovement = Math.abs(movedXAxis) + Math.abs(movedYAxis)

    var incrementXAxis = parentSvgRatio[0] / (parentSvgRatio[1] + parentSvgRatio[0]) * totalMovement

    if (movedXAxis < 0 || movedYAxis < 0) {
      incrementXAxis *= -1
    }

    let changedX1 = firstPoint[0]
    let changedX2 = xAxis + incrementXAxis
    let changedY1 = firstPoint[1]
    let changedY2 = changedY1 + ((changedX2 - changedX1) * parentSvgRatio[1] / parentSvgRatio[0])

    // 변경된좌표 체크
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
        changedX2 = draw.options.maxSize.width
        changedY2 = draw.options.maxSize.height
      } else {
        return
      }
    }

    // Min, Max Validation
    if (!drawView.validateGeometrySize(Math.abs(changedX1 - changedX2), Math.abs(changedY1 - changedY2))) {
      return
    }
    return [changedX1, changedY1, changedX2, changedY2]
  }
  this.parentSVGMouseMoveHandle = function (event) {
    if (draw.options.customDraw === true && draw.selectedCircleIndex === null) {
      drawView.parentSVGMouseDownHandle(event)
    }

    if (
      draw.selectedCircleIndex === null &&
      draw.selectedLineIndex === null &&
      selectedPolygon === null &&
      draw.options.customDraw === false
    ) {
      return
    }

    var pageAxis = ElementController.getPageAxis(rootSVG, event)
    var xAxis = pageAxis[0]
    var yAxis = pageAxis[1]

    var movedXAxis = xAxis - parentSvgStartAxis[0]
    var movedYAxis = yAxis - parentSvgStartAxis[1]

    var offsetWidth = ElementController.getSVGOffset(rootSVG)().width
    var offsetHeight = ElementController.getSVGOffset(rootSVG)().height

    var firstPoint = draw.drawModel.getAxis(draw.rectangleIndex[0])
    var thirdPoint = draw.drawModel.getAxis(draw.rectangleIndex[2])

    var prevPoints = []

    var pointsLength = draw.drawModel.getPointsLength()

    var changedX1 = 0
    var changedX2 = 0
    var changedY1 = 0
    var changedY2 = 0

    var self = null

    var circles = []
    var lines = []
    var polygon = null

    // 포인트를 선택하여 영역을 이동 시킬 때
    if (draw.selectedCircleIndex !== null) {
      /*
      Point 이동 시 좌표 유효성 체크
      움직였을 때의 거리를 계산하여 유효성을 체크한다.
      */
      if (xAxis < 0) {
        xAxis = 0
      } else if (xAxis > offsetWidth) {
        xAxis = offsetWidth
      }

      if (yAxis < 0) {
        yAxis = 0
      } else if (yAxis > offsetHeight) {
        yAxis = offsetHeight
      }

      // 사각형 리사이징
      if (draw.options.fixedRatio === true || draw.options.useRectangleForCustomDraw === true) {
        // 사각형
        let axis = []
        if (draw.options.useOnlyRectangle === true || draw.options.useRectangleForCustomDraw === true) {
          axis = moveRectangle(event)
        } else { // 고정비 확대
          axis = moveFixedRect(event)
        }

        // 뒤집어지는 것을 방지 하기 위해 세번째 포인트가 첫번째 포인트 보다 적을 때 return
        if (
          _.isUndefined(axis) ||
          (
            draw.options.useRectangleForCustomDraw === false &&
            (firstPoint[0] > axis[2] || firstPoint[1] > axis[3])
          )
        ) {
          return
        }

        drawView.changeRectangle(...axis)

        // 라인과 폴리곤 사각형의 Circle
      } else {
        var validateAxis = []
        var leftAxisIndex = 0
        var rightAxisIndex = 0
        /**
         * Custom Drawing 중일 때는 Line 제한을 하지 않고,
         * custom 함수에서 클릭시 제한을 한다.
         */
        if (
          draw.options.customDraw === false &&
          draw.options.minLineLength !== false) {
          circles = draw.circleHelper.getCircles()

          if (!(draw.options.fill === false && draw.selectedCircleIndex === 0)) {
            leftAxisIndex = draw.selectedCircleIndex === 0 ? circles.length - 1 : draw.selectedCircleIndex - 1
            validateAxis.push(draw.drawModel.getAxis(leftAxisIndex))
          }

          if (!(draw.options.fill === false && draw.selectedCircleIndex === circles.length - 1)) {
            rightAxisIndex = draw.selectedCircleIndex === circles.length - 1 ? 0 : draw.selectedCircleIndex + 1
            validateAxis.push(draw.drawModel.getAxis(rightAxisIndex))
          }

          for (var i = 0, ii = validateAxis.length; i < ii; i++) {
            self = validateAxis[i]

            if (FunnyMath.pythagoreanTheorem(xAxis, yAxis, self[0], self[1]) < draw.options.minLineLength) {
              return
            }
          }
        }

        prevPoints = draw.drawModel.getPoints()
        prevPoints[draw.selectedCircleIndex] = [xAxis, yAxis]

        if (draw.validateStabilization(prevPoints) === false) {
          return
        }

        draw.drawModel.setAxis(draw.selectedCircleIndex, xAxis, yAxis)
      }
      // 라인을 선택하여 이동할 때
    } else if (draw.options.fill === true && draw.selectedLineIndex !== null) {
      lines = draw.lineHelper.getLines()
      var startAxis = draw.drawModel.getAxis(draw.selectedLineIndex)
      var endAxisIndex = draw.options.fill === true && draw.selectedLineIndex === lines.length - 1 ? 0 : draw.selectedLineIndex + 1
      var endAxis = draw.drawModel.getAxis(endAxisIndex)

      changedX1 = startAxis[0] + movedXAxis
      changedY1 = startAxis[1] + movedYAxis
      changedX2 = endAxis[0] + movedXAxis
      changedY2 = endAxis[1] + movedYAxis

      /*
       * 라인 이동 시, 양쪽 끝의 유효성 체크하여
       * 변경이 불가능하면 기존 좌표로 한다.
       */
      if (
        draw.drawModel.validateAxis(changedX1, changedY1) === false ||
        draw.drawModel.validateAxis(changedX2, changedY2) === false
      ) {
        changedX1 = startAxis[0]
        changedY1 = startAxis[1]
        changedX2 = endAxis[0]
        changedY2 = endAxis[1]
      }

      prevPoints = draw.drawModel.getPoints()
      prevPoints[draw.selectedLineIndex] = [changedX1, changedY1]
      prevPoints[endAxisIndex] = [changedX2, changedY2]

      if (draw.validateStabilization(prevPoints) === false) {
        return
      }

      draw.drawModel.setAxis(draw.selectedLineIndex, changedX1, changedY1)
      draw.drawModel.setAxis(endAxisIndex, changedX2, changedY2)
      // 영역을 선택하여 이동할 때
    } else if (draw.options.fill === true || draw.selectedLineIndex !== null) {
      var isMoveOk = false
      polygon = draw.polygonHelper.getPolygon()

      if (polygon !== null) {
        isMoveOk = polygon.isSelected === true
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
          movedXAxis = 0
        }

        if (
          firstPoint[1] + movedYAxis < 0 ||
          thirdPoint[1] + movedYAxis > offsetHeight) {
          movedYAxis = 0
        }
      }

      if (draw.drawModel.validateAllPoint(movedXAxis, 0) === false) {
        movedXAxis = 0
      }

      if (draw.drawModel.validateAllPoint(0, movedYAxis) === false) {
        movedYAxis = 0
      }
      if (isMoveOk) {
        _.loop(index => {
          const self = draw.drawModel.getAxis(index)
          draw.drawModel.setAxis(index, self[0] + movedXAxis, self[1] + movedYAxis)
        })(pointsLength)
      }
    }

    parentSvgStartAxis = [xAxis, yAxis]

    // Update
    draw.changeAxis()
  }
  this.bindEvent = function () {
    if (
      draw.options.useResizeRectangle === true ||
      draw.options.useEvent === true ||
      draw.options.customDraw === true) {
      parentSvgStartAxis = null
      EventController.bindBodyEvent('mousedown', drawView.parentSVGMouseDownHandle)
      EventController.bindBodyEvent('mousemove', drawView.parentSVGMouseMoveHandle)
      EventController.bindBodyEvent('mouseup', drawView.parentSVGMouseUpHandle)
      EventController.bindBodyEvent('mouseleave', drawView.parentSVGMouseUpHandle)
    }
  }
  this.init = function () {
    drawView.createSVGElement()

    if (draw.options.initCenter === true) {
      draw.drawModel.alignCenter()
    }

    draw.changeAxis()
    draw.resetAllColor()
    drawView.bindEvent()
    drawView.appendDom()
  }
  this.reset = function () {
    drawView.removeAllElement()
    drawView.unbindEvent()
    draw.lineHelper.setLines([])
    draw.circleHelper.setCircles([])
    draw.polygonHelper.setPolygon(null)
    draw.textTagHelper.setTextTag(null)
    draw.arrowImageHelper.resetData()
  }
  this.unbindEvent = function () {
    EventController.unbindBodyEvent('mousedown', drawView.parentSVGMouseDownHandle)
    EventController.unbindBodyEvent('mousemove', drawView.parentSVGMouseMoveHandle)
    EventController.unbindBodyEvent('mouseup', drawView.parentSVGMouseUpHandle)
    EventController.unbindBodyEvent('mouseleave', drawView.parentSVGMouseUpHandle)
    // document.documentElement.removeEventListener('mouseup', documentElementMouseMoveHandle);
  }
  this.endDraw = function () {
    draw.options.customDraw = false
    draw.options.useRectangleForCustomDraw = false
    drawView.resetElementStatus()
    drawView.resetParentSvgAttr()
  }
  this.changeRectangleToSize = function (width, height) {
    if (draw.options.useOnlyRectangle !== true && draw.options.fixedRatio !== true) {
      return
    }

    var firstPoint = draw.drawModel.getAxis(0)
    var thirdPoint = draw.drawModel.getAxis(2)
    var offset = ElementController.getSVGOffset(rootSVG)()
    var changedX1 = 0
    var changedX3 = 0
    var changedY1 = 0
    var changedY3 = 0

    /*
     * 세번째 좌표가 오른쪽 하단 끝에 있을 경우
     * 세번째 좌표를 기준으로 변경을 하고,
     * 그렇지 않을 경우 첫번째 좌표를 기준으로 한다.
     */
    if (thirdPoint[0] >= offset.width) {
      changedX1 = thirdPoint[0] - width
      changedX3 = thirdPoint[0]
    } else {
      changedX1 = firstPoint[0]
      changedX3 = firstPoint[0] + width
    }

    if (thirdPoint[1] >= offset.height) {
      changedY1 = thirdPoint[1] - height
      changedY3 = thirdPoint[1]
    } else {
      changedY1 = firstPoint[1]
      changedY3 = firstPoint[1] + height
    }

    drawView.changeRectangle(changedX1, changedY1, changedX3, changedY3, true)
    draw.changeAxis()
  }
  this.changeRectangle = function (x1, y1, x2, y2, flagForchangeFirstAxis) {
    if (flagForchangeFirstAxis === true) {
      draw.drawModel.setAxis(0, x1, y1)
    }

    draw.drawModel.setAxis(draw.rectangleIndex[1], x1, y2)
    draw.drawModel.setAxis(draw.rectangleIndex[2], x2, y2)
    draw.drawModel.setAxis(draw.rectangleIndex[3], x2, y1)
  }
  this.changeNormalStatus = function () {
    var lines = draw.lineHelper.getLines()
    var circles = draw.circleHelper.getCircles()

    lines.forEach(function (line) {
      draw.lineHelper.hide(line)
    })

    circles.forEach(function (circle) {
      draw.circleHelper.hide(circle)
    })

    if (draw.useArrow === true) {
      draw.arrowImageHelper.hide()
    }

    draw.textTagHelper.hide()

    draw.resetAllColor()
  }
  this.changeActiveStatus = function () {
    var lines = draw.lineHelper.getLines()
    var circles = draw.circleHelper.getCircles()

    lines.forEach(function (line) {
      draw.lineHelper.show(line)
    })

    circles.forEach(function (circle) {
      draw.circleHelper.show(circle)
    })

    if (draw.useArrow === true) {
      draw.arrowImageHelper.show()
    }

    draw.textTagHelper.show()

    draw.setAllColor()
  }
  this.validateGeometrySize = function (geometryWidth, geometryHeight) {
    if (_.negate(_.isUndefined(draw.options.minSize))) {
      if (geometryWidth < draw.options.minSize.width || geometryHeight < draw.options.minSize.height) {
        return false
      }
    }

    if (_.negate(_.isUndefined(draw.options.maxSize))) {
      if (geometryWidth > draw.options.maxSize.width || geometryHeight > draw.options.maxSize.height) {
        return false
      }
    }

    return true
  }
}
