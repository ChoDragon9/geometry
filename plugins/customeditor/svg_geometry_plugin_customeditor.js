"use strict";
/* globals SVGGeometry */
function CustomEditor (product, options) {
  var self = this

  this._product = product
  this._options = null
  this._state = null
  this._svgGeometry = new SVGGeometry(product.getParentSvg());

  this.parentSVGClickHandleProxy = function (event) {
    self.parentSVGClickHandle(event)
  };

  this.removeDrawingGeometryProxy = function () {
    self.removeDrawingGeometry()
  }

  this.setOptions(options)
  this.bindEvent();
}

CustomEditor.prototype = {
  destroy: function () {
    this.unbindEvent();
  },
  stop: function () {
    this.unbindEvent();
  },
  start: function () {
    this.bindEvent();
  },
  unbindEvent: function () {
    EventController.unbindEvent(this.getParentSvg(), 'click', this.parentSVGClickHandleProxy);
  },
  bindEvent: function () {
    EventController.bindEvent(this.getParentSvg(), 'click', this.parentSVGClickHandleProxy);
  },
  handleESCKey: function (event) {
    if (event.keyCode === 27) {
      this.removeDrawingGeometry();
    }
  },
  bindContextMenu: function() {
    EventController.bindEvent(this.getParentSvg(), "contextmenu", this.removeDrawingGeometryProxy);
  },
  unbindContextMenu: function () {
    EventController.unbindEvent(this.getParentSvg(), "contextmenu", this.removeDrawingGeometryProxy);
  },
  bindESCkeyEvent: function () {
    document.addEventListener('keyup', this.handleESCKey.bind(this));
  },
  unbindESCkeyEvent: function () {
    document.removeEventListener('keyup', this.handleESCKey.bind(this));
  },
  removeDrawingGeometry: function () {
    if (this._state.isFirst() === false) {
      this._state.destroy();
      this.endDraw()
    }
  },
  startDraw: function () {
    this.bindContextMenu();
    this.bindESCkeyEvent();
  },
  endDraw: function() {
    this.unbindContextMenu();
    this.unbindESCkeyEvent();
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
    }, options);
  
    if (this._options.fixedRatio === true) {
      this._options.useOnlyRectangle = true;
    }
  
    this._options.customDraw = true;
  
    if (this._options.useOnlyRectangle === true) {
      if (this._options.fixedRatio === true) {
        this._state = new FixedRatioState(this._svgGeometry)
      } else {
        this._state = new RectangleState(this._svgGeometry)
      }
    } else {
      this._state = new LineState(this._svgGeometry)
    }
  },
  parentSVGClickHandle: function(event) {
    if (
      this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = this._product.getPageAxis(event);

    if (this._state.isFirst()) {
      this.startDraw()
      this._state.start(this._options, axis)
    } else if (this._state.isLast()) {
      this.endDraw();
      this._state.end()
    } else {
      this._state.add(axis)
    }
  },
  getParentSvg: function () {
    return this._product.getParentSvg()
  }
}

SVGGeometry.addPlugin('customEditor', CustomEditor);