const State = require('./state')

class FixedRatioState extends State {
  constructor(rootSVG) {
    super(rootSVG)
  }

  start(options, axis) {
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

    super.start(options, axis)
  }

  end() {
    super.end()
  }

  isLast() {
    return this._currentPoint !== 0
  }
}


module.exports = FixedRatioState
