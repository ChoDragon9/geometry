const SVGGeometry = require('./src/modules/svg_geometry')
const Polygon = require('./scripts/polygon.js')
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
})
