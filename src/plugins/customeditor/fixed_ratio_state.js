const State = require('./state')

function FixedRatioState (rootSVG) {
  State.call(this, rootSVG)
}
FixedRatioState.prototype = Object.create(State.prototype)
FixedRatioState.prototype.start = function (options, axis) {
  var points = []
  if (options.minSize === false) {
    points = this.convertRectanglePoints(
      axis[0], axis[1],
      axis[0] + options.ratio[0], axis[1] + options.ratio[1]
    )
  } else {
    points = this.convertRectanglePoints(
      axis[0], axis[1],
      axis[0] + options.minSize.width, axis[1] + options.minSize.height
    )
  }
  options.points = points

  State.prototype.start.call(this, options, axis)
}
FixedRatioState.prototype.end = function () {
  State.prototype.end.call(this)
}
FixedRatioState.prototype.isLast = function () {
  return this._currentPoint !== 0
}
FixedRatioState.prototype.constructor = FixedRatioState

module.exports = FixedRatioState
