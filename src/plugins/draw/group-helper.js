'use strict'

/**
 * Group 태그 Helper
 */
const ElementController = require('../../common/ElementController')
const _ = require('../../common/fp')

module.exports = function GroupHelper (draw, rootSVG) { // eslint-disable-line
  var groupTag = null
  var notUseMoveTopLayer = draw.options.notUseMoveTopLayer

  this.add = function () {
    groupTag = ElementController.createGroup()
  }
  this.remove = function () {
    ElementController.removeChild(rootSVG, groupTag)
  }
  this.moveTopLayer = function () {
    if (notUseMoveTopLayer === true) {
      return
    }
    var lastChild = rootSVG.lastChild

    if (lastChild !== groupTag) {
      rootSVG.insertBefore(
        groupTag,
        lastChild.nextSibling
      )
    }
  }
  this.append = function () {
    ElementController.appendChild(rootSVG, groupTag)
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
