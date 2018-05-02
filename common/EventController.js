/**
 * 이벤트 조작 객체
 */
window.EventController = {
  bindEvent: function (element, name, callback) {
    element.addEventListener(name, callback)
  },
  unbindEvent: function (element, name, callback) {
    element.removeEventListener(name, callback)
  },
  bindBodyEvent: function (name, callback) {
    this.bindEvent(document.body, name, callback)
  },
  unbindBodyEvent: function (name, callback) {
    this.unbindEvent(document.body, name, callback)
  }
}
