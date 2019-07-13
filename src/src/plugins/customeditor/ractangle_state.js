const State = require('./state')

class RectangleState extends State {
  constructor(rootSVG) {
    super(rootSVG)
  }

  start(options, axis) {
    options.points = this.convertRectanglePoints(axis[0], axis[1], axis[0], axis[1])
    super.start(options, axis)
  }

  end() {
    super.end()
  }

  isLast() {
    return this._currentPoint !== 0
  }
}

module.exports = RectangleState