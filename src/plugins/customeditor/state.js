const Draw = require('../draw')

function State (product) {
  this._product = product
  this._obj = null
  this._currentPoint = 0
  this._options = null
}

State.prototype = {
  start: function (options, axis) {
    this._options = options
    this._obj = new Draw(this._product, options)
    this._currentPoint++
    this.callStartEvent()
  },
  end: function () {
    this._obj.endDraw()
    this.callEndEvent()

    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  add: function () {},
  isFirst: function () {
    return this._currentPoint === 0
  },
  isLast: function () {},
  destroy: function () {
    this._obj.destroy()
    this._obj = null
    this._currentPoint = 0
    this._options = null
  },
  convertRectanglePoints: function (x1, y1, x2, y2) {
    return [
      [x1, y1], [x1, y2], [x2, y2], [x2, y1]
    ]
  },
  callStartEvent: function () {
    if ('start' in this._options.event) {
      this._options.event.start(this._obj)
    }
  },
  callEndEvent: function () {
    if ('end' in this._options.event) {
      this._options.event.end(this._obj)
    }
  }
}

module.exports = State