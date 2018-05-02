'use strict'

/**
 * Group 태그 Helper
 */
function GroupHelper (draw, product) { // eslint-disable-line
  var groupTag = null

  var parentSvg = product.getParentSvg()
  var notUseMoveTopLayer = draw.options.notUseMoveTopLayer

  this.add = function () {
    groupTag = ElementController.createGroup()
  }
  this.remove = function () {
    product.removeParentChild(groupTag)
  }
  this.moveTopLayer = function () {
    if (notUseMoveTopLayer === true) {
      return
    }
    var lastChild = parentSvg.lastChild

    if (lastChild !== groupTag) {
      parentSvg.insertBefore(
        groupTag,
        lastChild.nextSibling
      )
    }
  }
  this.append = function () {
    product.appendParentChild(groupTag)
  }
  this.appendChild = function (child) {
    ElementController.appendChild(groupTag, child)
  }
  this.removeChild = function (child) {
    ElementController.removeChild(groupTag, child)
  }
  this.insertBefore = function () {
    groupTag.insertBefore.apply(groupTag, arguments)
  }
}
