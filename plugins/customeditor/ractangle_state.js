function RectangleState (svgGeometry) {
  State.call(this, svgGeometry)
}
RectangleState.prototype = Object.create(State.prototype)
RectangleState.prototype.start = function (options, axis) {
  options.points = this.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1])
  State.prototype.start.call(this, options, axis)
}
RectangleState.prototype.end = function () {
  State.prototype.end.call(this)
}
RectangleState.prototype.isLast = function () {
  return this._currentPoint !== 0
}
RectangleState.prototype.constructor = RectangleState
