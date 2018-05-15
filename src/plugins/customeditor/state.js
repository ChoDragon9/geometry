const Draw = require('../draw')


const convertRectanglePoints = (x1, y1, x2, y2) => {
  return [
    [x1, y1], [x1, y2], [x2, y2], [x2, y1]
  ]
}

const callStartEvent = (options, obj) => {
  if ('start' in options.event) {
    options.event.start(obj)
  }
}

const callEndEvent = (options, obj) => {
  if ('end' in options.event) {
    options.event.end(obj)
  }
}

const init = () => {
  return {
    obj: null,
    currentPoint: 0,
    options: null
  }
}

const start = (rootSVG, options, axis, currentPoint) => {
  const obj = new Draw(rootSVG, options)
  callStartEvent(options, obj)
  currentPoint++

  return {
    obj,
    currentPoint
  }
}

const end = (obj, options) => {
  obj.endDraw()
  callEndEvent(options, obj)
  return init()
}

const destroy = (obj) => {
  obj.destory()
  return init()
}

class State {
  constructor(rootSVG) {
    const {
      obj,
      currentPoint,
      options
    } = init()
    this._rootSVG = rootSVG
    this._obj = obj
    this._currentPoint = currentPoint
    this._options = options
  }

  start(options, axis) {
    this._options = options
    const {
      obj, currentPoint
    } = start(this._rootSVG, options, axis, this._currentPoint)
    this._obj = obj
    this._currentPoint = currentPoint
  }

  end() {
    const {
      obj,
      currentPoint,
      options
    } = end(this._obj, this._options)
    this._obj = obj
    this._currentPoint = currentPoint
    this._options = options
  }

  add() {}
  isLast() {}

  isFirst() {
    return this._currentPoint === 0
  }

  destroy() {
    const {
      obj,
      currentPoint,
      options
    } = destroy(this._obj)
    this._obj = obj
    this._currentPoint = currentPoint
    this._options = options
  }

  convertRectanglePoints (...args) {
    return convertRectanglePoints(...args)
  }
}

module.exports = State