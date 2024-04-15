const SVGGeometry = require('./src/modules/svg_geometry')
const Polygon = require('./scripts/polygon.js')
const UWAPrivacyPolygon = require('./scripts/uwa_privacy_polygon.js')
const UWAPrivacyRectangle = require('./scripts/uwa_privacy_rectangle.js')
const Line = require('./scripts/line.js')
const FixedRatio = require('./scripts/fixedratio.js')

var lineObject = null
var kindSVGDrawing = null
window.onload = function () {
  var polygon = new Polygon()
  polygon.draw()
  getElem('svg_polygon_add_point').onclick = polygon.addPoint
  getElem('svg_polygon_get_point').onclick = polygon.getPoints

  var fixedRatio = new FixedRatio()
  fixedRatio.draw()
  getElem('svg_fixed_ratio_btn').onclick = fixedRatio.alignCenter

  var line = new Line()
  line.draw()

  var uwaPrivacyPolygon = new UWAPrivacyPolygon()
  uwaPrivacyPolygon.init()
  getElem('svg_privacy_polygon_stop_drawing').onclick = uwaPrivacyPolygon.stopDrawing
  getElem('svg_privacy_polygon_start_drawing').onclick = uwaPrivacyPolygon.startDrawing
  getElem('svg_privacy_polygon_list').onchange = uwaPrivacyPolygon.selectShape
  getElem('svg_privacy_polygon_add_point').onclick = uwaPrivacyPolygon.addPoint

  var uwaPrivacyRectangle = new UWAPrivacyRectangle()
  uwaPrivacyRectangle.startDrawing()
  getElem('svg_privacy_rectangle_min').onchange = uwaPrivacyRectangle.changeMinMaxSize
  getElem('svg_privacy_rectangle_max').onchange = uwaPrivacyRectangle.changeMinMaxSize
  getElem('svg_privacy_rectangle_change_min').onclick = uwaPrivacyRectangle.changeRectangleToMinSize
  getElem('svg_privacy_rectangle_change_max').onclick = uwaPrivacyRectangle.changeRectangleToMaxSize
}

function getElem (id) {
  return document.getElementById(id)
}
var colorFactory = {
  red: '#CE534D',
  blue: '#3184F9',
  includeArea: {
    fill: '#ff6633',
    line: '#ff6633',
    point: '#ff6633'
  },
  excludeArea: {
    fill: '#000000',
    line: '#ffffff',
    point: '#999999'
  }
}
function getROIOptions () {
  return {
    fillColor: colorFactory.includeArea.fill,
    lineColor: colorFactory.includeArea.line,
    pointColor: colorFactory.includeArea.point,
    lineStrokeWidth: 4,
    circleRadius: 5,
    useEvent: true,
    useCursor: true,
    minPoint: 4,
    maxPoint: 8,
    fill: true,
    fillOpacity: '0.2'
  }
}

function getLineOptions () {
  return {
    fillColor: colorFactory.includeArea.fill,
    lineColor: colorFactory.includeArea.line,
    pointColor: colorFactory.includeArea.point,
    lineStrokeWidth: 4,
    circleRadius: 6,
    useEvent: true,
    useCursor: true,
    minPoint: 2,
    maxPoint: 8,
    arrow: {
      mode: 'R',
      min: 'L',
      max: 'LR',
      text: true
    }
  }
}

window.addEventListener('load', function () {
  // [Face Detection] Wise FaceDetection ROI
  var wiseFDROI = document.getElementById('wfd_roi')
  var wiseFDROIEditor = new SVGGeometry(wiseFDROI)
  var wiseFDOptions = getROIOptions()
  wiseFDOptions.points = [
    [0, 0],
    [0, 480],
    [854, 480],
    [854, 0]
  ]
  wiseFDOptions.ratio = [1.77, 1]
  wiseFDOptions.fixedRatio = true
  wiseFDOptions.wiseFaceDetection = {
    strokeWidth: 2,
    strokeColor: colorFactory.includeArea.line,
    fillOpacity: 0,
    heightRatio: 4 // Wise Face Detection에 표현되는 원의 반지름 %
  }
  wiseFDROIEditor.draw(wiseFDOptions)

  // [MD, IVA] ROI
  var roi = document.getElementById('roi')
  var roiEditor = new SVGGeometry(roi)
  var roiOptions = getROIOptions()
  var roiObj = []
  var selectROIObj = function (obj) {
    for (var i = 0, ii = roiObj.length; i < ii; i++) {
      roiObj[i].normal()
    }

    obj.active()
  }
  var defaultROIPoints = [
    [
      [686, 319],
      [455, 333],
      [465, 467],
      [694, 459]
    ],
    [
      [294, 46],
      [135, 55],
      [150, 216],
      [367, 194]
    ]
  ]
  roiOptions.event = {
    start: function () {

    },
    end: function (obj) {
      roiObj.push(obj)
      selectROIObj(obj)
    },
    mouseup: function () {
      var self = this
      // 포인트가 추가된뒤에 active 효과를 적용
      setTimeout(function () {
        selectROIObj(self)
      })
    }
  }

  roiEditor.customEditorV2(roiOptions)
  for (var i = 0, ii = defaultROIPoints.length; i < ii; i++) {
    roiOptions.points = defaultROIPoints[i]
    roiOptions.fillColor = i === 0 ? colorFactory.includeArea.fill : colorFactory.excludeArea.fill
    roiOptions.pointColor = i === 0 ? colorFactory.includeArea.point : colorFactory.excludeArea.point
    roiOptions.lineColor = i === 0 ? colorFactory.includeArea.line : colorFactory.excludeArea.line
    roiObj.push(roiEditor.draw(roiOptions))
  }
  selectROIObj(roiObj[0])

  // [IVA] Virtual Line
  var virtualLine = document.getElementById('virtual_line')
  var virtualLineEditor = new SVGGeometry(virtualLine)
  var virtualLineOptions = getLineOptions()
  virtualLineOptions.fillColor = colorFactory.blue
  virtualLineOptions.lineColor = colorFactory.blue
  virtualLineOptions.pointColor = colorFactory.blue
  var virtualLineObj = []
  var defaultVirtualLinePoints = [
    [
      [736, 146],
      [455, 333]
    ],
    [
      [651, 332],
      [295, 152]
    ]
  ]
  var selectLineObj = function (obj) {
    for (var i = 0, ii = virtualLineObj.length; i < ii; i++) {
      virtualLineObj[i].normal()
    }

    obj.active()
  }
  virtualLineOptions.event = {
    start: function () {},
    end: function (obj) {
      virtualLineObj.push(obj)
      selectLineObj(obj)
    },
    mouseup: function () {
      var self = this
      setTimeout(function () {
        selectLineObj(self)
      })
    }
  }
  virtualLineEditor.customEditor(virtualLineOptions)
  for (var i = 0, ii = defaultVirtualLinePoints.length; i < ii; i++) {
    virtualLineOptions.points = defaultVirtualLinePoints[i]
    virtualLineObj.push(virtualLineEditor.draw(virtualLineOptions))
  }
  selectLineObj(virtualLineObj[0])

  // [IVA] Common Calibration
  var commonCalibration = document.getElementById('common_calibration')
  var commonCalibrationEditor = new SVGGeometry(commonCalibration)
  var commonCalibrationOptions = getROIOptions()
  commonCalibrationOptions.initCenter = true
  commonCalibrationOptions.notUseMoveTopLayer = true
  commonCalibrationOptions.useOnlyRectangle = true
  commonCalibrationOptions.minSize = {
    width: 100,
    height: 100
  }
  commonCalibrationOptions.maxSize = {
    width: 854,
    height: 480
  }
  commonCalibrationOptions.points = [
    [0, 0],
    [0, 480],
    [854, 480],
    [854, 0]
  ]
  commonCalibrationOptions.fillColor = colorFactory.red
  commonCalibrationOptions.lineColor = colorFactory.red
  commonCalibrationOptions.pointColor = colorFactory.red
  commonCalibrationEditor.draw(commonCalibrationOptions)
  commonCalibrationOptions.points = [
    [0, 0],
    [0, 100],
    [100, 100],
    [100, 0]
  ]
  commonCalibrationOptions.fillColor = colorFactory.blue
  commonCalibrationOptions.lineColor = colorFactory.blue
  commonCalibrationOptions.pointColor = colorFactory.blue
  commonCalibrationEditor.draw(commonCalibrationOptions)
})
