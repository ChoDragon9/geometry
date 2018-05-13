'use strict'
const CustomEditor = require('./customeditor')
const Draw = require('./draw')
const EventController = require('../common/EventController')
const _ = require('../common/fp')

function CustomEditorV2 (product, options) {
  var self = this
  self._mouseDownTimer = null
  self._svgObj = null
  self._product = product

  self.parentSVGMouseUpHandleProxy = function (event) {
    self.parentSVGMouseUpHandle.bind(self)(event)
  }
  self.parentSVGMouseDownHandleProxy = function (event) {
    self.parentSVGMouseDownHandle.bind(self)(event)
  }

  CustomEditor.call(self, product, options)
}

CustomEditorV2.prototype = Object.create(CustomEditor.prototype)
CustomEditorV2.prototype.constructor = CustomEditorV2
CustomEditorV2.prototype.parentSVGClickHandle = function (event) {
  this._options.useRectangleForCustomDraw = false
  CustomEditor.prototype.parentSVGClickHandle.call(this, event)
}
CustomEditorV2.prototype.unbindEvent = function () {
  CustomEditor.prototype.unbindEvent.call(this)

  EventController.unbindEvent('mousedown', this.parentSVGMouseDownHandleProxy)(this._product.getParentSvg())
  EventController.unbindBodyEvent('mouseup', this.parentSVGMouseUpHandleProxy)
}
CustomEditorV2.prototype.bindEvent = function () {
  _.divEq(
    EventController.bindEvent('mousedown', this.parentSVGMouseDownHandleProxy),
    EventController.bindEvent('mouseup', this.parentSVGMouseUpHandleProxy)
  )(this._product.getParentSvg())
}
CustomEditorV2.prototype.bindCancelEvent = function () {
  this.bindContextMenu()
  document.addEventListener('keyup', this.handleESCKey)
}
CustomEditorV2.prototype.unbindCancelEvent = function () {
  this.unbindContextMenu()
  document.removeEventListener('keyup', this.handleESCKey)
}
CustomEditorV2.prototype.removeDrawingGeometry = function () {
  CustomEditor.prototype.removeDrawingGeometry.call(this)
  if (this._state.isFirst() === false) {
    this.restartDrawing()
  }
}
CustomEditorV2.prototype.restartDrawing = function () {
  this.unbindCancelEvent()
  this.unbindEvent()
  this.bindEvent()
}
CustomEditorV2.prototype.endDraw = function () {
  CustomEditor.prototype.endDraw.call(this)
  this.restartDrawing()
}
CustomEditorV2.prototype.endDragEvent = function () {
  this._svgObj.endDraw()
  this.unbindCancelEvent()
  this.restartDrawing()
  this._svgObj = null
}
CustomEditorV2.prototype.parentSVGMouseUpHandle = function (event) {
  var isCheckingDragEvent = this._mouseDownTimer !== null

  if (isCheckingDragEvent) {
    this.abortCheckingDragEvent(event)
    return
  }

  var isRightMouseBtn = event.buttons === 2
  var isUsingParent = this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === 'true'

  if (isRightMouseBtn || isUsingParent || this._svgObj === null) {
    return
  }

  this.endDragEvent()
}

CustomEditorV2.prototype.abortCheckingDragEvent = function (event) {
  window.clearTimeout(this._mouseDownTimer)
  this._mouseDownTimer = null

  this.parentSVGClickHandle(event)

  _.divEq(
    EventController.unbindEvent('mousedown', this.parentSVGMouseDownHandle),
    EventController.unbindEvent('mouseup', this.parentSVGMouseUpHandle)
  )(this._product.getParentSvg())

  CustomEditor.prototype.bindEvent.call(this)
}

CustomEditorV2.prototype.parentSVGMouseDownHandle = function (event) {
  var isRightMouseBtn = event.buttons === 2
  var isNotCurrentTarget = event.currentTarget !== event.target
  var isUsingParent = this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === 'true'

  if (isRightMouseBtn || isNotCurrentTarget || isUsingParent) {
    return
  }

  this.startCheckingDragEvent(event)
}
CustomEditorV2.prototype.startCheckingDragEvent = function (event) {
  window.clearTimeout(this._mouseDownTimer)

  this._mouseDownTimer = window.setTimeout(
    this.startDragEvent.bind(this),
    this._product.getClickDetectionTime(),
    this._product.getPageAxis(event)
  )
}
CustomEditorV2.prototype.startDragEvent = function (axis) {
  var DEFAULT_OBJECT_SIZE = 30
  this._mouseDownTimer = null
  this._options.points = [
    axis, [axis[0], axis[1] + DEFAULT_OBJECT_SIZE],
    [axis[0] + DEFAULT_OBJECT_SIZE, axis[1] + DEFAULT_OBJECT_SIZE],
    [axis[0] + DEFAULT_OBJECT_SIZE, axis[1]]
  ]

  this._options.useRectangleForCustomDraw = true

  this._svgObj = new Draw(this._product, this._options)
  this.bindCancelEvent()
}

module.exports = CustomEditorV2
