'use strict'
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
const CommonUtils = require('../../common/CommonUtils')
const FunnyMath = require('../../common/FunnyMath')
const DrawModel = require('./DrawModel')
const DrawView = require('./DrawView')
const _ = require('../../common/fp')

module.exports = function Draw (product, options) {
  var draw = this

  var MINIMUM_ANGLE = 1

  draw.options = CommonUtils.getOptions({
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
    fillOpacity: 0.5,
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
  }, options)

  draw.useArrow = true

  if (draw.options.arrow === null) {
    draw.useArrow = false
  } else if (draw.options.arrow.mode === '') {
    draw.useArrow = false
  }

  if (draw.options.useOnlyRectangle === true) {
    draw.options.fixedRatio = true
  }

  draw.drawModel = new DrawModel(draw, product)
  draw.drawView = new DrawView(draw, product)

  draw.rectangleIndex = draw.drawModel.getRectangleIndex()

  draw.callCustomEvent = draw.drawView.callCustomEvent
  draw.init = draw.drawView.init
  draw.addPoint = draw.drawView.addPoint
  draw.hide = draw.drawView.removeAllElement
  draw.show = draw.drawView.appendDom
  draw.active = draw.drawView.changeActiveStatus
  draw.normal = draw.drawView.changeNormalStatus
  draw.getData = function () {
    return {
      points: draw.drawModel.getPoints(),
      arrow: draw.drawView.getArrow()
    }
  }
  draw.reset = draw.drawView.reset
  draw.destroy = draw.drawView.reset
  draw.endDraw = draw.drawView.endDraw
  draw.createArrow = draw.drawView.createArrow
  draw.changeArrow = draw.drawView.changeArrow
  draw.changeMinSizeOption = draw.drawModel.changeMinSizeOption
  draw.changeMaxSizeOption = draw.drawModel.changeMaxSizeOption
  draw.changeRectangleToSize = draw.drawView.changeRectangleToSize
  draw.modifyPoints = draw.drawModel.modifyPoints
  draw.alignCenter = draw.drawModel.alignCenter
  draw.validateAxis = draw.drawModel.validateAxis
  draw.stopEvent = draw.drawView.unbindEvent
  draw.startEvent = draw.drawView.bindEvent
  draw.moveTopLayer = draw.drawView.moveTopLayer
  draw.changeWFDFillColor = draw.drawView.changeFillColor
  draw.changeAxis = draw.drawView.changeAxis
  draw.resetAllColor = function () {
    draw.drawView.resetAllColor()
    draw.drawModel.setIsAllSelectedState(false)
  }
  draw.setAllColor = function () {
    draw.drawView.setAllColor()
    draw.drawModel.setIsAllSelectedState(true)
  }

  draw.validateStabilization = validateStabilization
  draw.validateIntersection = validateIntersection
  draw.validateMinimumAngle = validateMinimumAngle

  draw.drawView.init()

  // @DrawUtil
  function validateMinimumAngle (prevPoints) {
    var points = []
    var pointsLength = 0

    try {
      points = _.isUndefined(prevPoints)
        ? CommonUtils.cloneObject(draw.drawModel.getPoints())
        : CommonUtils.cloneObject(prevPoints)
      pointsLength = points.length

      /**
       * 삼각형부터 체크
       */
      if (pointsLength >= 3 && draw.options.fill === true) {
        var vertextAngle = Math.abs(FunnyMath.getVertextAngle(points[0], points[1], points[2]))
        if (vertextAngle < MINIMUM_ANGLE) {
          return false
        }

        _.loop(() => {
          points.push(points.shift())
        })(pointsLength)
      }
    } catch (e) {
      console.warn(e)
    }

    return true
  }

  // @DrawUtil
  function validateIntersection (prevPoints) {
    var returnVal = true
    var points = 0
    var pointsLength = 0

    // 고정비 사각형, 직각사각형, 라인은 교차 체크를 하지 않음.
    if (draw.options.fill === false || draw.options.fixedRatio === true) {
      return
    }

    try {
      points = _.isUndefined(prevPoints)
        ? CommonUtils.cloneObject(draw.drawModel.getPoints())
        : CommonUtils.cloneObject(prevPoints)
      pointsLength = points.length

      for (var i = 0; i < pointsLength - 1; i++) {
        var firstLineFirstPoint = points[i]
        var firstLineSecondPoint = points[i + 1]

        for (var j = i + 1; j < pointsLength; j++) {
          var secondLineFirstPoint = points[j]
          var secondLineSecondPointIndex = ((j + 1) === pointsLength ? 0 : (j + 1))
          var secondLineSecondPoint = points[secondLineSecondPointIndex]

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
            returnVal = false
            break
          }
        }
      }
    } catch (e) {
      console.info(e)
    }

    return returnVal
  }

  // @DrawUtil
  function validateStabilization (prevPoints) {
    var points = _.isUndefined(prevPoints)
      ? CommonUtils.cloneObject(draw.drawModel.getPoints())
      : CommonUtils.cloneObject(prevPoints)
    var returnVal = true

    if (validateMinimumAngle(points) === false || validateIntersection(points) === false) {
      returnVal = false
    }

    return returnVal
  }
}