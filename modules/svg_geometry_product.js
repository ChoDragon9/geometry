'use strict'
/**
 * 플러그인 호출시 this로 사용할 객체
 *
 * @param {Object} svgTag svg tag
 */
function SVGGeometryProduct (svgTag) {
  divEq(
    ElementController.setAttr('draggable', false),
    ElementController.style('cursor', 'normal'),
    ElementController.style('userSelect', 'none'),
    ElementController.style('mozUserSelect', 'none'),
    ElementController.style('webkitUserSelect', 'none'),
    ElementController.style('msUserSelect', 'none')
  )(svgTag)

  this.getParentSvg = function () {
    return svgTag
  }
}

SVGGeometryProduct.prototype = {
  getParentMovedAttr: () => 'is-moved',
  getIconHiddenDelay: () => 2000,
  getClickDetectionTime: () => 100,
  getPageAxis: function (event) {
    return pipe(
      ({left, top}) => {
        return [
          event.pageX - left,
          event.pageY - top
        ]
      },
      ([xAxis, yAxis]) => {
        const scroll = CommonUtils.getBodyScroll()

        if (scroll) {
          xAxis -= scroll.left
          yAxis -= scroll.top
        }

        return [xAxis, yAxis]
      }
    )(this.parentOffset())
  },
  getParentSvgSize: function () {
    var parentSvg = this.getParentSvg()

    var width = this.getParentSvgAttr('width') || parentSvg.clientWidth
    var height = this.getParentSvgAttr('height') || parentSvg.clientHeight

    return {
      width: parseInt(width),
      height: parseInt(height)
    }
  },
  parentOffset: function () {
    return ElementController.getSVGOffset(this.getParentSvg())()
  },
  setParentSvgAttr: function (attrName, val) {
    return ElementController.setAttr(attrName, val)(this.getParentSvg())
  },
  getParentSvgAttr: function (attrName) {
    return ElementController.getAttr(attrName)(this.getParentSvg())
  },
  removeParentChild: function (childrenElement) {
    ElementController.removeChild(this.getParentSvg(), childrenElement)
  },
  appendParentChild: function (childrenElement) {
    ElementController.appendChild(this.getParentSvg(), childrenElement)
  }
}
