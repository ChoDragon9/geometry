"use strict";
/**
 * 플러그인 호출시 this로 사용할 객체
 *
 * @param {Object} svgTag svg tag
 */
function SVGGeometryProduct(svgTag) {
  svgTag.setAttributeNS(null, 'draggable', false);

  //Default style
  svgTag.style.cursor = 'normal';

  svgTag.style.userSelect = 'none';
  svgTag.style.mozUserSelect = 'none';
  svgTag.style.webkitUserSelect = 'none';
  svgTag.style.msUserSelect = 'none';


  this.getParentSvg = function () {
    return svgTag;
  };
}

SVGGeometryProduct.prototype = {
  getParentMovedAttr: function () {
    return 'is-moved'
  },
  getIconHiddenDelay: function () {
    return 2000 //ms
  },
  getClickDetectionTime: function () {
    return 100 //ms
  },
  getPageAxis: function (event) {
    var offset = this.parentOffset();
    var xAxis = event.pageX - offset.left;
    var yAxis = event.pageY - offset.top;
    var scroll = CommonUtils.getBodyScroll();

    if (scroll) {
      xAxis -= scroll.left;
      yAxis -= scroll.top;
    }

    return [xAxis, yAxis];
  },
  parentOffset: function () {
    var offset = this.getParentSvg().getBoundingClientRect();
    return {
      top: offset.top,
      left: offset.left,
      width: offset.width,
      height: offset.height
    };
  },
  setParentSvgAttr: function (attrName, val) {
    return ElementController.setAttr(
      this.getParentSvg(),
      attrName,
      val
    );
  },
  getParentSvgAttr: function (attrName) {
    return ElementController.getAttr(
      this.getParentSvg(),
      attrName
    );
  },
  removeParentChild: function (childrenElement) {
    ElementController.removeChild(this.getParentSvg(), childrenElement)
  },
  appendParentChild: function (childrenElement) {
    ElementController.appendChild(this.getParentSvg(), childrenElement)
  }
};