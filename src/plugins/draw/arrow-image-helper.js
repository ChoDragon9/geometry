/**
 * 화살표 이미지 Helper
 */
const ElementController = require('../../common/ElementController')
const FunnyMath = require('../../common/FunnyMath')
const _ = require('../../common/fp')

module.exports = function ArrowImageHelper (draw, product) { // eslint-disable-line
  'use strict'

  var IMAGE_WIDTH = 25
  var IMAGE_HEIGHT = 33

  var NORMAL_IMAGE = require('../../images/btn_in-out_normal.png')
  var PRESS_IMAGE = require('../../images/btn_in-out_press.png')

  var NORMAL_ALL_IMAGE = require('../../images/btn_all_normal.png')
  var PRESS_ALL_IMAGE = require('../../images/btn_all_press.png')

  var arrowImageContainner = null
  var arrowImage = null
  var halfArrowWidth = IMAGE_WIDTH / 2
  var halfArrowHeight = IMAGE_HEIGHT / 2
  var arrowTextContainner = null
  var arrowText = []

  var arrowQueue = ['L', 'R', 'LR']
  var arrowQueueLength = arrowQueue.length
  var arrowScope = []
  var currentArrow = null

  // set Scope of Arrow
  // @ArrowImageView
  function setArrowScope () {
    var startIndex = _.findIndex(arrow => arrow === draw.options.arrow.min)(arrowQueue)
    var endIndex = _.findIndex(arrow => arrow === draw.options.arrow.max)(arrowQueue)

    for (var i = startIndex; i <= endIndex; i++) {
      arrowScope.push(arrowQueue[i])
    }
  }

  // @ArrowImageView
  function getNextArrow (arrow) {
    var nextIndex = _.findIndex((item, index, list) => {
      return item === arrow && list.length - 1 !== index
    })(arrowScope) + 1

    return arrowQueue[nextIndex]
  }

  // @ArrowImageView
  function addArrowGuideText () {
    if (draw.options.arrow === null) {
      return
    }
    if (_.negate(_.isUndefined(draw.options.arrow.text)) && draw.options.arrow.text === true) {
      arrowTextContainner = ElementController.createGroup()
      arrowText[0] = ElementController.createText('A')
      arrowText[1] = ElementController.createText('B')
      ElementController.appendChild(arrowTextContainner, arrowText[0])
      ElementController.appendChild(arrowTextContainner, arrowText[1])
    }
  }

  function show () {
    _.each(ElementController.style('display', 'inline'))([
      arrowImage, arrowTextContainner
    ])
  }

  function hide () {
    _.each(ElementController.style('display', 'none'))([
      arrowImage, arrowTextContainner
    ])
  }

  function changeArrowGuideText (xAxis, yAxis, angle) {
    var radius = halfArrowWidth + 20
    var textHalfWidth = 4
    var textHalfHeight = 6
    var getXAxisOfText = function (angle) {
      return FunnyMath.getCosine(angle) * radius - textHalfWidth
    }

    var getYAxisOfText = function (angle) {
      return FunnyMath.getSine(angle) * radius + textHalfHeight
    }

    var axis = [{
      x: getXAxisOfText(angle + 180),
      y: getYAxisOfText(angle + 180)
    },
    {
      x: getXAxisOfText(angle),
      y: getYAxisOfText(angle)
    }]

    if (arrowTextContainner !== null) {
      _.divEq(
        ElementController.setAttr('x', xAxis + axis[0].x),
        ElementController.setAttr('y', yAxis + axis[0].y)
      )(arrowText[0])
      _.divEq(
        ElementController.setAttr('x', xAxis + axis[1].x),
        ElementController.setAttr('y', yAxis + axis[1].y)
      )(arrowText[1])
    }
  }

  function addImage () {
    if (draw.useArrow === true) {
      var imagePath = draw.options.arrow.mode === arrowQueue[arrowQueueLength - 1] ? NORMAL_ALL_IMAGE : NORMAL_IMAGE
      var createdImage = ElementController.createImage(imagePath, IMAGE_WIDTH, IMAGE_HEIGHT, true)
      arrowImage = createdImage[0]
      arrowImageContainner = createdImage[1]

      addArrowGuideText()
      draw.drawView.setCursor(arrowImage)
      bindEvent()
      changeArrow(draw.options.arrow.mode)
    }
  }

  function changeArrow (arrow) {
    currentArrow = arrow
    changeArrowImage()
    changeArrowImagePath()
  }

  function getArrow () {
    return currentArrow
  }

  function changeArrowImage () {
    var startAxis = draw.drawModel.getAxis(0)
    var endAxis = draw.drawModel.getAxis(1)
    var angle = FunnyMath.getAngle(startAxis[0], startAxis[1], endAxis[0], endAxis[1])
    var textAngle = angle
    var degree = currentArrow === arrowQueue[1] ? 90 : 270

    var lineCenter = FunnyMath.getLineCenter(startAxis[0], startAxis[1], endAxis[0], endAxis[1])

    var xAxis = lineCenter[0]
    var yAxis = lineCenter[1]

    _.divEq(
      ElementController.setAttr('x', xAxis),
      ElementController.setAttr('y', yAxis)
    )(arrowImage)

    if (draw.options.notUseAutoChangeOfArrow !== true) {
      if (Math.abs(angle) > 90) {
        degree = degree === 90 ? 270 : 90
        textAngle -= 180
      }
    }

    changeArrowGuideText(xAxis, yAxis, textAngle)

    angle += degree

    ElementController.setAttr(
      'transform',
      `rotate(${angle} ${xAxis} ${yAxis}) translate(${halfArrowWidth * -1},${halfArrowHeight * -1})`
    )(arrowImageContainner)
  }

  function changeArrowImagePath () {
    var imagePath = currentArrow === arrowQueue[arrowQueueLength - 1] ? NORMAL_ALL_IMAGE : NORMAL_IMAGE
    ElementController.setHrefAttr(imagePath)(arrowImage)
  }

  function bindEvent () {
    if (draw.options.useEvent === true) {
      arrowImage.onclick = function (event) {
        event.stopPropagation()
      }

      arrowImage.onmousedown = function (event) {
        event.stopPropagation()

        var imagePath = currentArrow === arrowQueue[arrowQueueLength - 1] ? PRESS_ALL_IMAGE : PRESS_IMAGE

        arrowImage.isSelected = true
        ElementController.setHrefAttr(imagePath)(arrowImage)
      }

      arrowImage.onmouseup = function (event) {
        event.stopPropagation()

        if (arrowImage.isSelected === true) {
          var arrow = getNextArrow(currentArrow)

          arrowImage.isSelected = false

          changeArrow(arrow)

          draw.callCustomEvent('mouseup', draw.getData())
        }
      }

      arrowImage.onmouseleave = function (event) {
        event.stopPropagation()

        if (arrowImage.isSelected === true) {
          arrowImage.onmouseup(event)
        }
      }
    }
  }

  function remove () {
    if (draw.useArrow === true) {
      arrowImageContainner.removeChild(arrowImage)
      draw.groupHelper.removeChild(arrowImageContainner)

      if (arrowTextContainner !== null) {
        arrowTextContainner.removeChild(arrowText[0])
        arrowTextContainner.removeChild(arrowText[1])

        draw.groupHelper.removeChild(arrowTextContainner)
      }
    }
  }

  function append () {
    if (arrowImageContainner !== null) {
      arrowImageContainner.appendChild(arrowImage)
      draw.groupHelper.appendChild(arrowImageContainner)
    }

    if (arrowTextContainner !== null) {
      arrowTextContainner.appendChild(arrowText[0])
      arrowTextContainner.appendChild(arrowText[1])

      draw.groupHelper.appendChild(arrowTextContainner)
    }
  }

  if (draw.useArrow === true) {
    setArrowScope()
  }

  function resetData () {
    arrowImageContainner = null
    arrowImage = null
    arrowTextContainner = null
    arrowText = []
  }

  this.addImage = addImage
  this.append = append
  this.remove = remove
  this.getArrow = getArrow
  this.changeArrowImage = changeArrowImage
  this.changeArrow = changeArrow
  this.show = show
  this.hide = hide
  this.resetData = resetData
}
