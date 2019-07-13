'use strict'
const CustomEditor = require('./customeditor')
const Draw = require('./draw')
const EventController = require('../common/EventController')
const ElementController = require('../common/ElementController')
const _ = require('../common/fp')
const {
  MOVED_ATTR,
  CLICK_DETECTION_TIME
} = require('../modules/constants')

class CustomEditorV2 extends CustomEditor {
  constructor(rootSVG, options) {
    super(rootSVG, options)
    this._mouseDownTimer = null
    this._svgObj = null
  }

  unbindEvent() {
    _.divEq(
      EventController.unbindEvent('click', this.parentSVGClickHandle),
      EventController.unbindEvent('mousedown', this.parentSVGMouseDownHandle),
      EventController.unbindEvent('mouseup', this.parentSVGMouseUpHandle)
    )(this._rootSVG)
  }

  createParentSVGClickHandle () {
    const fn = super.createParentSVGClickHandle()
    return (event) => {
      this._options.useRectangleForCustomDraw = false
      fn(event)
    }
  }

  bindEvent() {
    this.parentSVGMouseDownHandle = this.createParentSVGMouseDownHandle()
    this.parentSVGMouseUpHandle = this.createParentSVGMouseUpHandle()
    this.parentSVGClickHandle = this.createParentSVGClickHandle()

    _.divEq(
      EventController.bindEvent('mousedown', this.parentSVGMouseDownHandle),
      EventController.bindEvent('mouseup', this.parentSVGMouseUpHandle)
    )(this._rootSVG)
  }

  bindCancelEvent() {
    this.bindContextMenu()
    document.addEventListener('keyup', this.handleESCKey)
  }

  unbindCancelEvent() {
    this.unbindContextMenu()
    document.removeEventListener('keyup', this.handleESCKey)
  }

  removeDrawingGeometry() {
    super.removeDrawingGeometry()
    if (this._state.isFirst() === false) {
      this.restartDrawing()
    }
  }

  restartDrawing() {
    this.unbindCancelEvent()
    this.unbindEvent()
    this.bindEvent()
  }

  endDraw() {
    super.endDraw()
    this.restartDrawing()
  }

  endDragEvent() {
    this._svgObj.endDraw()
    this.unbindCancelEvent()
    this.restartDrawing()
    this._svgObj = null
  }

  createParentSVGMouseUpHandle () {
    return (event) => {
      var isCheckingDragEvent = this._mouseDownTimer !== null

      if (isCheckingDragEvent) {
        this.abortCheckingDragEvent(event)
        return
      }

      var isRightMouseBtn = event.buttons === 2
      var isUsingParent = ElementController.getAttr(MOVED_ATTR)(this._rootSVG) === 'true'

      if (isRightMouseBtn || isUsingParent || this._svgObj === null) {
        return
      }
      this.endDragEvent()
    }
  }

  abortCheckingDragEvent(event) {
    window.clearTimeout(this._mouseDownTimer)
    this._mouseDownTimer = null

    this.parentSVGClickHandle(event)

    _.divEq(
      EventController.unbindEvent('mousedown', this.parentSVGMouseDownHandle),
      EventController.unbindEvent('mouseup', this.parentSVGMouseUpHandle),
      EventController.bindEvent('click', this.parentSVGClickHandle)
    )(this._rootSVG)

  }

  createParentSVGMouseDownHandle () {
    return (event) => {
      const isRightMouseBtn = event.buttons === 2
      const isNotCurrentTarget = event.currentTarget !== event.target
      const isUsingParent = ElementController.getAttr(MOVED_ATTR)(this._rootSVG) === 'true'

      if (isRightMouseBtn || isNotCurrentTarget || isUsingParent) {
        return
      }

      this.startCheckingDragEvent(event)
    }
  }

  startCheckingDragEvent(event) {
    window.clearTimeout(this._mouseDownTimer)

    this._mouseDownTimer = window.setTimeout((axis) => this.startDragEvent(axis),
      CLICK_DETECTION_TIME,
      ElementController.getPageAxis(this._rootSVG, event)
    )
  }

  startDragEvent(axis) {
    var DEFAULT_OBJECT_SIZE = 30
    this._mouseDownTimer = null
    this._options.points = [
      axis, [axis[0], axis[1] + DEFAULT_OBJECT_SIZE],
      [axis[0] + DEFAULT_OBJECT_SIZE, axis[1] + DEFAULT_OBJECT_SIZE],
      [axis[0] + DEFAULT_OBJECT_SIZE, axis[1]]
    ]

    this._options.useRectangleForCustomDraw = true

    this._svgObj = new Draw(this._rootSVG, this._options)
    this.bindCancelEvent()
  }
}


module.exports = CustomEditorV2
