/**
 * DOM 조작 객체
 */
window.ElementController = {
  setAttr: function (element, attrName, val, _ns) {
    var ns = typeof _ns === 'undefined' ? null : _ns
    element.setAttributeNS(ns, attrName, val)
  },
  setHrefAttr: function (element, val) {
    this.setAttr(element, 'href', val, 'http://www.w3.org/1999/xlink')
  },
  getAttr: function (element, attrName) {
    return element.getAttributeNS(null, attrName)
  },
  removeChild: function (parentElement, childrenElement) {
    parentElement.removeChild(childrenElement)
  },
  appendChild: function (parentElement, childrenElement) {
    parentElement.appendChild(childrenElement)
  },
  createSVGElement: function (name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name)
  },
  createLine: function (strokeWidth) {
    var line = this.createSVGElement('line')
    line.setAttributeNS(null, 'stroke-width', strokeWidth)
    line.setAttributeNS(null, 'draggable', false)

    return line
  },
  createCircle: function (circleRadius) {
    var circle = this.createSVGElement('circle')
    circle.setAttributeNS(null, 'r', circleRadius)
    circle.setAttributeNS(null, 'draggable', false)

    return circle
  },
  createRect: function (width, height) {
    var rectangle = this.createSVGElement('rect')
    rectangle.setAttributeNS(null, 'width', width)
    rectangle.setAttributeNS(null, 'height', height)
    rectangle.setAttributeNS(null, 'draggable', false)

    return rectangle
  },
  createText: function (txt) {
    var textTag = this.createSVGElement('text')
    textTag.textContent = txt
    textTag.setAttributeNS(null, 'draggable', false)

    return textTag
  },
  createGroup: function () {
    return this.createSVGElement('g')
  },
  createImage: function (imagePath, width, height) {
    var imageContainner = this.createGroup()
    var image = this.createSVGElement('image')

    this.setHrefAttr(image, imagePath)
    image.setAttributeNS(null, 'width', width)
    image.setAttributeNS(null, 'height', height)
    image.setAttributeNS(null, 'draggable', false)

    imageContainner.appendChild(image)

    return [image, imageContainner]
  },
  createPolygon: function () {
    var polygon = this.createSVGElement('polygon')
    polygon.setAttributeNS(null, 'draggable', false)

    return polygon
  },
  createUse: function () {
    return this.createSVGElement('use')
  }
}
