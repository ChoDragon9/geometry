/**
 * Wise Face Detection 헬퍼
 */
const ElementController = require('../../common/ElementController')
const _ = require('../../common/fp')

module.exports = function WiseFaceDetectionHelper (draw) { // eslint-disable-line
  var wiseFaceDetectionCircle = null
  var wiseFaceDetection = draw.options.wiseFaceDetection

  function changeFillColor (fillColor) {
    ElementController.style('color', fillColor)(wiseFaceDetectionCircle)
  }

  function add () {
    wiseFaceDetectionCircle = document.createElement('span')
    wiseFaceDetectionCircle.className = 'tui tui-wn5-smile'
    ElementController.style('position', 'absolute')(wiseFaceDetectionCircle)
    changeFillColor(wiseFaceDetection.fillColor)
  }

  function append () {
    try {
      document.getElementById('sketchbook').appendChild(wiseFaceDetectionCircle)
    } catch (e) {

    }
  }

  function remove () {
    try {
      document.getElementById('sketchbook').removeChild(wiseFaceDetectionCircle)
    } catch (e) {

    }
  }

  function updateCircle (xAxis, yAxis, height) {
    var radius = height / 100

    if ('heightRatio' in wiseFaceDetection) {
      radius *= wiseFaceDetection.heightRatio
    } else if ('widthRatio' in wiseFaceDetection) {
      radius *= wiseFaceDetection.widthRatio
    }

    _.divEq(
      ElementController.style('top', (yAxis - radius) + 'px'),
      ElementController.style('left', (xAxis - radius) + 'px'),
      ElementController.style('fontSize', (radius * 2) + 'px')
    )(wiseFaceDetectionCircle)
  }

  if (wiseFaceDetection !== false) {
    _.isUndefined(wiseFaceDetection.fillColor) && (wiseFaceDetection.fillColor = '#dd2200')
    _.isUndefined(wiseFaceDetection.heightRatio) && (wiseFaceDetection.heightRatio = 2.2)
    _.isUndefined(wiseFaceDetection.widthRatio) && (wiseFaceDetection.widthRatio = false)

    this.updateCircle = updateCircle
    this.append = append
    this.add = add
    this.remove = remove
    this.changeFillColor = changeFillColor
  }
}