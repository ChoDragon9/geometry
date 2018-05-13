/**
 * 공통 함수 객체
 */
const _ = require('./fp')

module.exports = {
  cloneObject: function (obj) {
    if (typeof (obj) !== 'object') {
      return obj
    }

    var copiedObj = obj.constructor()

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copiedObj[attr] = this.cloneObject(obj[attr])
      }
    }

    return copiedObj
  },
  getOptions: function (defaultOptions, _options) {
    var newOptions = this.cloneObject(_options)

    for (var keyName in defaultOptions) {
      if (_.isUndefined(newOptions[keyName])) {
        newOptions[keyName] = defaultOptions[keyName]
      }
    }

    return newOptions
  }
}
