"use strict";
/* globals SVGGeometry */
function CustomEditorV2 (product, options) {
  var DEFAULT_OBJECT_SIZE = 30;
  var mouseDownTimer = null;
  var currentPoint = 0
  var svgObj = null
  var self = this

  function parentSVGMouseUpHandle(event) {
    //Right button

    if(mouseDownTimer !== null){
      clearTimeout(mouseDownTimer);
      mouseDownTimer = null;

      this.parentSVGClickHandle(event);
      this._eventCtrl.unbindEvent(this._product.getParentSvg(), 'mousedown', parentSVGMouseDownHandle);
      this._eventCtrl.unbindEvent(this._product.getParentSvg(), 'mouseup', parentSVGMouseUpHandle);

      CustomEditor.prototype.bindEvent.call(this)
      return;
    }

    if (event.buttons === 2) {
      return;
    }

    if (
      this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === "true" ||
      svgObj === null
    ) {
      return;
    }
    svgObj.endDraw();
    this.unbindCancelEvent();
    this.restartDrawing();
    currentPoint = 0;
    svgObj = null
  }

  function parentSVGMouseDownHandle(event) {
    if (
      event.buttons === 2 ||
      event.currentTarget !== event.target ||
      this._product.getParentSvgAttr(this._product.getParentMovedAttr()) === "true"
    ) {
      return;
    }

    var axis = this._product.getPageAxis(event);

    clearTimeout(mouseDownTimer);

    mouseDownTimer = setTimeout(function(axis, options){
      mouseDownTimer = null;
      options.points = [
        axis, [axis[0], axis[1] + DEFAULT_OBJECT_SIZE],
        [axis[0] + DEFAULT_OBJECT_SIZE, axis[1] + DEFAULT_OBJECT_SIZE],
        [axis[0] + DEFAULT_OBJECT_SIZE, axis[1]],
      ];

      options.useRectangleForCustomDraw = true;

      svgObj = this._svgGeometry.draw(this._options);
      currentPoint++;
      this.bindCancelEvent();
    }.bind(self), this._product.getClickDetectionTime(), axis, this._options);
  }

  this.parentSVGMouseUpHandleProxy = function (event) {
    parentSVGMouseUpHandle.call(self, event)
  }
  this.parentSVGMouseDownHandleProxy = function (event) {
    parentSVGMouseDownHandle.call(self, event)
  }

  CustomEditor.call(this, product, options)
}

CustomEditorV2.prototype = Object.create(CustomEditor.prototype)
CustomEditorV2.prototype.constructor = CustomEditorV2
CustomEditorV2.prototype.parentSVGClickHandle = function (event) {
  this._options.useRectangleForCustomDraw = false;
  CustomEditor.prototype.parentSVGClickHandle.call(this, event)
}
CustomEditorV2.prototype.unbindEvent = function () {
  CustomEditor.prototype.unbindEvent.call(this)

  this._eventCtrl.unbindEvent(this._product.getParentSvg(), 'mousedown', this.parentSVGMouseDownHandleProxy);
  this._eventCtrl.unbindBodyEvent('mouseup', this.parentSVGMouseUpHandleProxy);
}
CustomEditorV2.prototype.bindEvent = function () {
  this._eventCtrl.bindEvent(this._product.getParentSvg(), 'mousedown', this.parentSVGMouseDownHandleProxy);
  this._eventCtrl.bindEvent(this._product.getParentSvg(), 'mouseup', this.parentSVGMouseUpHandleProxy);
}
CustomEditorV2.prototype.bindCancelEvent = function () {
  this.bindContextMenu()
  document.addEventListener('keyup', this.handleESCKey);
}
CustomEditorV2.prototype.unbindCancelEvent = function () {
  this.unbindContextMenu()
  document.removeEventListener('keyup', this.handleESCKey);
}
CustomEditorV2.prototype.removeDrawingGeometry = function () {
  CustomEditor.prototype.removeDrawingGeometry.call(this)
  if (this._state.isFirst() === false) {
    this.restartDrawing();
  }
}
CustomEditorV2.prototype.restartDrawing = function (){
  this.unbindCancelEvent();
  this.unbindEvent();
  this.bindEvent();
}
CustomEditorV2.prototype.endDraw = function() {
  CustomEditor.prototype.endDraw.call(this)
  this.restartDrawing();
}


SVGGeometry.addPlugin('customEditorV2', CustomEditorV2);