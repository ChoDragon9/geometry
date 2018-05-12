/**
 * 포인트 추가/삭제 아이콘
 * @example
 var iconHelper = new IconHelper();
  iconHelper.createIcon('+');
  iconHelper.changePosition(10, 10);
  iconHelper.show();

  iconHelper.hide();
  */
function IconHelper (groupHelper) { // eslint-disable-line
  var PLUS_IMAGE = './base/images/plus.svg'
  var MINUS_IMAGE = './base/images/minus.svg'

  var iconText = null
  var icon = null
  var width = 16
  var self = this
  var clickEventHandler = null
  var leaveEventHandler = null
  var contextMenuEventHandler = null

  /**
   * Plus, Minus 아이콘 생성
   * appendDom 시 사용
   *
   * @param {Boolean} iconType true: Plus icon, false: Minus icon
   */
  function createIcon (iconType) {
    var src = iconType ? PLUS_IMAGE : MINUS_IMAGE

    if (icon === null) {
      icon = ElementController.createRect(width, width)
      iconText = ElementController.createImage(src, width, width)[0]

      ElementController.setAttr('fill', '#000000')(icon)

      each(ElementController.style('opacity', 0))([icon, iconText])

      if (clickEventHandler !== null) {

        each(ElementController.style('cursor', 'pointer'))([icon, iconText])

        icon.addEventListener('click', function (event) {
          event.preventDefault()
          event.stopPropagation()
          clickEventHandler(event)
        })
        iconText.addEventListener('click', function (event) {
          event.preventDefault()
          event.stopPropagation()
          if (clickEventHandler !== null) {
            clickEventHandler(event)
          }
        })

        iconText.addEventListener('mouseleave', function (event) {
          event.preventDefault()
          event.stopPropagation()
          if (leaveEventHandler !== null) {
            leaveEventHandler(event)
          }
        })

        iconText.addEventListener('contextmenu', function (event) {
          event.preventDefault()
          event.stopPropagation()
          if (contextMenuEventHandler !== null) {
            contextMenuEventHandler(event)
          }
        })
      }
    }

    groupHelper.appendChild(icon)
    groupHelper.appendChild(iconText)
  };
  function changePosition (x, y) {
    divEq(
      ElementController.setAttr('x', x - width / 2),
      ElementController.setAttr('y', y - width / 2)
    )(icon)
    divEq(
      ElementController.setAttr('x', x - width / 2),
      ElementController.setAttr('y', y - width / 2),
    )(iconText)
  };
  function show () {
    each(ElementController.style('opacity', 1))([icon, iconText])
  };
  function hide () {
    if (icon === null) {
      return
    }

    if (icon.style.opacity === '1') {
      each(ElementController.style('opacity', 0))([icon, iconText])
      self.changePosition(0, 0)
    }
  };
  function onClick (callBack) {
    clickEventHandler = callBack
  };
  function onLeave (callBack) {
    leaveEventHandler = callBack
  };
  function onContextMenu (callBack) {
    contextMenuEventHandler = callBack
  };

  this.createIcon = createIcon
  this.changePosition = changePosition
  this.show = show
  this.hide = hide
  this.onClick = onClick
  this.onLeave = onLeave
  this.onContextMenu = onContextMenu
}
