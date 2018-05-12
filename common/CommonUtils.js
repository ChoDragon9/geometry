/**
 * 공통 함수 객체
 */
window.CommonUtils = {
  getBodyScroll: function () {
    var scroll = false
    var body = document.body
    var html = document.documentElement

    if (body.scrollTop !== 0 || body.scrollLeft !== 0) {
      // For Chrome, Safari, Opera
      scroll = {
        left: body.scrollLeft,
        top: body.scrollTop
      }
    } else if (html.scrollTop !== 0 || html.scrollLeft !== 0) {
      // Firefox, IE
      scroll = {
        left: html.scrollLeft,
        top: html.scrollTop
      }
    }

    return scroll
  },
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
      if (isUndefined(newOptions[keyName])()) {
        newOptions[keyName] = defaultOptions[keyName]
      }
    }

    return newOptions
  }
}
