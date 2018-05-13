'use strict'
/**
 * SVG를 사용한 Drawing 툴 모듈이다.
 * Plugin 중 'draw'를 통해서 영역을 조작한다.
 *
 * @class
 * @param {Object} rootSVG svg tag
 * @example
<caption>HTML Resource</caption>
<script src="./svg_drawing/modules/svg_geometry_product.js"></script>
<script src="./svg_drawing/modules/svg_geometry.js"></script>

<script src="./svg_drawing/plugins/draw/arrow-image-helper.js"></script>
<script src="./svg_drawing/plugins/draw/circle-helper.js"></script>
<script src="./svg_drawing/plugins/draw/group-helper.js"></script>
<script src="./svg_drawing/plugins/draw/icon-helper.js"></script>
<script src="./svg_drawing/plugins/draw/line-helper.js"></script>
<script src="./svg_drawing/plugins/draw/polygon-helper.js"></script>
<script src="./svg_drawing/plugins/draw/text-helper.js"></script>
<script src="./svg_drawing/plugins/draw/wise-facedetection-helper.js"></script>
<script src="./svg_drawing/plugins/draw/index.js"></script>

* @example
<caption>HTML</caption>
<svg
  width="500"
  height="500"
  id="svg_polygon"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
</svg>

 * @example
<caption>Javascript</caption>
var rootSVG = document.getElementById("svg_polygon");
var svgGeometry = new SVGGeometry(rootSVG);
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
const Draw = require('../plugins/draw')
const CustomEditor = require('../plugins/customeditor')
const CustomEditorV2 = require('../plugins/svg_geometry_plugin_customeditor_v2')

const ElementController = require('../common/ElementController')
const _ = require('../common/fp')

class SVGGeometry {
  constructor (rootSVG) {
    _.divEq(
      ElementController.setAttr('draggable', false),
      ElementController.style('cursor', 'normal'),
      ElementController.style('userSelect', 'none'),
      ElementController.style('mozUserSelect', 'none'),
      ElementController.style('webkitUserSelect', 'none'),
      ElementController.style('msUserSelect', 'none')
    )(rootSVG)
    this._rootSVG = rootSVG
  }
  draw (options) {
    return new Draw(this._rootSVG, options)
  }
  customEditor (options) {
    return new CustomEditor(this._rootSVG, options)
  }
  customEditorV2 (options) {
    return new CustomEditorV2(this._rootSVG, options)
  }
}

module.exports = SVGGeometry
