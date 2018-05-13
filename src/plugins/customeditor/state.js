const Draw = require('../draw')

class State {
  constructor(rootSVG) {
    this._rootSVG = rootSVG
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }

  start(options, axis) {
    this._options = options
    this._obj = new Draw(this._rootSVG, options)
    this._currentPoint++
    this.callStartEvent()
  }

  end() {
    this._obj.endDraw()
    this.callEndEvent()

    this._obj = null
    this._currentPoint = 0
    this._options = null
  }

  add() {}
  isLast() {}

  isFirst() {
    return this._currentPoint === 0
  }


  destroy() {
    this._obj.destroy()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }

  convertRectanglePoints(x1, y1, x2, y2) {
    return [
      [x1, y1], [x1, y2], [x2, y2], [x2, y1]
    ]
  }

  callStartEvent() {
    if ('start' in this._options.event) {
      this._options.event.start(this._obj)
    }
  }

  callEndEvent() {
    if ('end' in this._options.event) {
      this._options.event.end(this._obj)
    }
  }
}

module.exports = State