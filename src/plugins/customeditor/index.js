'use strict'
const SVGGeometry = require('../../modules/svg_geometry')
const EventController = require('../../common/EventController')
const CommonUtils = require('../../common/CommonUtils')
const FixedRatioState = require('./fixed_ratio_state')
const RectangleState = require('./ractangle_state')
const LineState = require('./line_state')

function CustomEditor (product, options) {
  var self = this

  this._product = product
  this._options = null
  this._state = null

  this.parentSVGClickHandleProxy = function (event) {
    self.parentSVGClickHandle(event)
  }

  this.removeDrawingGeometryProxy = function () {
    self.removeDrawingGeometry()
  }

  this.setOptions(options)
  this.bindEvent()
}

CustomEditor.prototype = {
  constructor: CustomEditor,
  destroy: function () {
    this.unbindEvent()
  },
  stop: function () {
    this.unbindEvent()
  },
  start: function () {
    this.bindEvent()
  },
  unbindEvent: function () {
    EventController.unbindEvent('click', this.parentSVGClickHandleProxy)(this.getParentSvg())
  },
  bindEvent: function () {
    EventController.bindEvent('click', this.parentSVGClickHandleProxy)(this.getParentSvg())
  },
  handleESCKey: function (event) {
    if (event.keyCode === 27) {
      this.removeDrawingGeometry()
    }
  },
  bindContextMenu: function () {
    EventController.bindEvent('contextmenu', this.removeDrawingGeometryProxy)(this.getParentSvg())
  },
  unbindContextMenu: function () {
    EventController.unbindEvent('contextmenu', this.removeDrawingGeometryProxy)(this.getParentSvg())
  },
  bindESCkeyEvent: function () {
    document.addEventListener('keyup', this.handleESCKey.bind(this))
  },
  unbindESCkeyEvent: function () {
    document.removeEventListener('keyup', this.handleESCKey.bind(this))
  },
  removeDrawingGeometry: function () {
    if (this._state.isFirst() === false) {
      this._state.destroy()
      this.endDraw()
    }
  },
  startDraw: function () {
    this.bindContextMenu()
    this.bindESCkeyEvent()
  },
  endDraw: function () {
    this.unbindContextMenu()
    this.unbindESCkeyEvent()
  },
  setOptions: function (options) {
    this._options = CommonUtils.getOptions({
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

    this._options.customDraw = true

    if (this._options.useOnlyRectangle === true) {
      if (this._options.fixedRatio === true) {
        this._state = new FixedRatioState(this._product)
      } else {
        this._state = new RectangleState(this._product)
      }
    } else {
      this._state = new LineState(this._product)
    }
  },
  parentSVGClickHandle: function (event) {
    if (
      this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === 'true'
    ) {
      return
    }

    var axis = this._product.getPageAxis(event)

    if (this._state.isFirst()) {
      this.startDraw()
      this._state.start(this._options, axis)
    } else if (this._state.isLast()) {
      this.endDraw()
      this._state.end()
    } else {
      this._state.add(axis)
    }
  },
  getParentSvg: function () {
    return this._product.getParentSvg()
  }
}

module.exports = CustomEditor
