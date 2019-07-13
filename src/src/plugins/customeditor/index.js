'use strict'
const EventController = require('../../common/EventController')
const ElementController = require('../../common/ElementController')
const _ = require('../../common/fp')
const FixedRatioState = require('./fixed_ratio_state')
const RectangleState = require('./ractangle_state')
const LineState = require('./line_state')
const {MOVED_ATTR} = require('../../modules/constants')

/**
 * 하고 싶은 것
 * OOP -> FP
 * 1. 모두 순수 함수로 변경
 * 2. 클로저 사용으로 변경
 * 
 * 함수 실행 => 역할부여
 * 1. create instance
 * 2. bindevent
 * 3. trigger click
 * 4. bind cancel event
 * 5. trigger click
 * 6. unbind cancel event
 */

const getState = (options) => {
  if (options.useOnlyRectangle === true) {
    if (options.fixedRatio === true) {
      return FixedRatioState
    }
    return RectangleState
  }
  return LineState
}

const calibrateOptions = (options) => {
  const newOptions = _.merge({
    minPoint: 4,
    event: {},
    fixedRatio: false,
    useOnlyRectangle: false,
    ratio: false,
    minLineLength: 20,
    minSize: false
  }, options)

  newOptions.fixedRatio && (newOptions.useOnlyRectangle = true)
  newOptions.customDraw = true

  return newOptions
}

const addEventListener = (element, eventName, eventListener) => {
  EventController.bindEvent(eventName, eventListener)(element)

  return () => {
    EventController.unbindEvent(eventName, eventListener)(element)
  }
}

const bindEvent = (rootSVG, state, options) => {
  let unbindContextMenu
  let unbindESCkeyEvent
  const bindContextMenu = () => {
    return addEventListener(rootSVG, 'contextmenu', stopDrawing)
  }
  const bindESCkeyEvent = () => {
    return addEventListener(document, 'keyup', ({keyCode}) => {
      keyCode === 27 && (stopDrawing())
    })
  }
  const stopDrawing  = () => {
    if (state.isFirst() === false) {
      state.destroy()
      endDraw()
    }
  }

  const startDraw = () => {
    unbindContextMenu = bindContextMenu()
    unbindESCkeyEvent = bindESCkeyEvent()
  }

  const endDraw = () => {
    unbindContextMenu()
    unbindESCkeyEvent()
  }

  return addEventListener(rootSVG, 'click', (event) => {
    if (ElementController.getAttr(MOVED_ATTR)(rootSVG) === 'true') {
      return
    }
    const axis = ElementController.getPageAxis(rootSVG, event)

    if (state.isFirst()) {
      startDraw()
      state.start(options, axis)
    } else if (state.isLast()) {
      endDraw()
      state.end()
    } else {
      state.add(axis)
    }
  })
}

module.exports = (rootSVG, _options) => {
  const options = calibrateOptions(_options)
  const StateConstructor = getState(options)
  const state = new StateConstructor(rootSVG)
  const unbindEvent = bindEvent(rootSVG, state, options)

  return {
    destroy: unbindEvent
  }
}
