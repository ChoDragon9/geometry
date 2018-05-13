'use strict'
const EventController = require('../../common/EventController')
const ElementController = require('../../common/ElementController')
const _ = require('../../common/fp')
const FixedRatioState = require('./fixed_ratio_state')
const RectangleState = require('./ractangle_state')
const LineState = require('./line_state')
const {MOVED_ATTR} = require('../../modules/constants')

class CustomEditor {
  constructor(rootSVG, options) {
    this._rootSVG = rootSVG
    this._options = null
    this._state = null
    this.parentSVGClickHandle = this.createParentSVGClickHandle()
    this.removeDrawingGeometry = this.createRemoveDrawingGeometry()
    this.handleESCKey = this.createHandleESCKey()

    this.setOptions(options)
    this.bindEvent()
  }
  destroy() {
    return this.unbindEvent();
  }
  stop() {
    return this.unbindEvent();
  }
  start() {
    return this.bindEvent();
  }
  unbindEvent() {
    EventController.unbindEvent('click', this.parentSVGClickHandle)(this._rootSVG)
  }

  bindEvent() {
    EventController.bindEvent('click', this.parentSVGClickHandle)(this._rootSVG)
  }

  createHandleESCKey () {
    return (event) => {
      if (event.keyCode === 27) {
        this.removeDrawingGeometry()
      }
    }
  }

  bindContextMenu() {
    EventController.bindEvent('contextmenu', this.removeDrawingGeometry)(this._rootSVG)
  }

  unbindContextMenu() {
    EventController.unbindEvent('contextmenu', this.removeDrawingGeometry)(this._rootSVG)
  }

  bindESCkeyEvent() {
    document.addEventListener('keyup', this.handleESCKey)
  }

  unbindESCkeyEvent() {
    document.removeEventListener('keyup', this.handleESCKey)
  }

  createRemoveDrawingGeometry () {
    return () => {
      if (this._state.isFirst() === false) {
        this._state.destroy()
        this.endDraw()
      }
    }
  }

  startDraw() {
    this.bindContextMenu()
    this.bindESCkeyEvent()
  }

  endDraw() {
    this.unbindContextMenu()
    this.unbindESCkeyEvent()
  }

  setOptions(options) {
    this._options = _.merge({
      minPoint: 4,
      event: {},
      fixedRatio: false,
      useOnlyRectangle: false,
      ratio: false,
      minLineLength: 20,
      minSize: false
    }, options)

    if (this._options.fixedRatio === true) {
      this._options.useOnlyRectangle = true
    }

    this._options.flag = new Date().getTime()
    this._options.customDraw = true

    if (this._options.useOnlyRectangle === true) {
      if (this._options.fixedRatio === true) {
        this._state = new FixedRatioState(this._rootSVG)
      } else {
        this._state = new RectangleState(this._rootSVG)
      }
    } else {
      this._state = new LineState(this._rootSVG)
    }
  }

  createParentSVGClickHandle () {
    return (event) => {
      if (
        ElementController.getAttr(MOVED_ATTR)(this._rootSVG) === 'true'
      ) {
        return
      }

      var axis = ElementController.getPageAxis(this._rootSVG, event)

      if (this._state.isFirst()) {
        this.startDraw()
        this._state.start(this._options, axis)
      } else if (this._state.isLast()) {
        this.endDraw()
        this._state.end()
      } else {
        this._state.add(axis)
      }
    }
  }

  getParentSvg() {
    return this._rootSVG
  }
}



module.exports = CustomEditor
