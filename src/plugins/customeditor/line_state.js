const State = require('./state')
const FunnyMath = require('../../common/FunnyMath')
const _ = require('../../common/fp')

class LineState extends State {
  constructor(rootSVG) {
    super(rootSVG)
    this._obj = null
    this._currentPoint = 0
    this._options = null
  }

  start(options, axis) {
    options.points = [axis, axis]
    super.start(options, axis)
    this._currentPoint = 2
  }

  end() {
    super.end()
  }

  add(axis) {
    if (this.validateAllAxis(this._options.minLineLength) === false) {
      return
    }

    if (this._currentPoint > 2) {
      if (this._obj.validateStabilization() === false) {
        return
      }
    }

    this._obj.addPoint(axis[0], axis[1])
    this._currentPoint++
  }

  isLast() {
    if (this._currentPoint === this._options.minPoint) {
      if (this.validateAllAxis(this._options.minLineLength) === false || this._obj.validateStabilization() === false) {
        return false
      }
      return true
    }
    return false
  }

  validateAllAxis() {
    var points = this._obj.getData().points
    var pythagoreanTheorem = FunnyMath.pythagoreanTheorem

    return !_.find((startAxis, index, points) => {
      var endAxis = index === points.length - 1 ?
        points[0] : points[index + 1]

      if (pythagoreanTheorem(startAxis[0], startAxis[1], endAxis[0], endAxis[1]) < this._options.minLineLength) {
        return true
      }
    })(points)
  }
}


module.exports = LineState