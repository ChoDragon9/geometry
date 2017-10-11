/**
 * 포인트 추가/삭제 아이콘
 * @example
 var iconHelper = new IconHelper();
  iconHelper.createIcon('+');
  iconHelper.changePosition(10, 10);
  iconHelper.show();

  iconHelper.hide();
  */
function IconHelper(elemCtrl, groupHelper) {
  var PLUS_IMAGE = './base/images/plus.svg';
  var MINUS_IMAGE = './base/images/minus.svg';

  var iconText = null;
  var icon = null;
  var width = 16;
  var delay = 200;
  var self = this;
  var clickEventHandler = null;
  var leaveEventHandler =  null;
  var contextMenuEventHandler = null;

  /**
   * Plus, Minus 아이콘 생성
   * appendDom 시 사용
   * 
   * @param {Boolean} iconType true: Plus icon, false: Minus icon
   */
  this.createIcon = function(iconType) {
    var src = iconType ? PLUS_IMAGE : MINUS_IMAGE;

    if (icon === null) {
      icon = elemCtrl.createRect(width, width);
      iconText = elemCtrl.createImage(src, width, width)[0];

      elemCtrl.setAttr(icon, 'fill', '#000000');

      icon.style.opacity = 0;
      iconText.style.opacity = 0;

      if (clickEventHandler !== null) {
        icon.style.cursor = 'pointer';
        iconText.style.cursor = 'pointer';

        icon.addEventListener('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          clickEventHandler(event);
        });
        iconText.addEventListener('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(clickEventHandler !== null){
            clickEventHandler(event);
          }
        });

        iconText.addEventListener('mouseleave', function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(leaveEventHandler !== null){
            leaveEventHandler(event);
          }
        });

        iconText.addEventListener('contextmenu', function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(contextMenuEventHandler !== null){
            contextMenuEventHandler(event);
          }
        });
      }
    }

    groupHelper.appendChild(icon);
    groupHelper.appendChild(iconText);
  };

  this.changePosition = function(x, y) {
    elemCtrl.setAttr(icon, 'x', x - width / 2);
    elemCtrl.setAttr(icon, 'y', y - width / 2);
    elemCtrl.setAttr(iconText, 'x', x - width / 2);
    elemCtrl.setAttr(iconText, 'y', y - width / 2);
  };

  this.show = function() {
    icon.style.opacity = 1;
    iconText.style.opacity = 1;
  };

  this.hide = function() {
    if (icon === null) {
      return;
    }

    if (icon.style.opacity === '1') {
      icon.style.opacity = 0;
      iconText.style.opacity = 0;
      self.changePosition(0, 0);
    }
  };

  this.onClick = function(callBack) {
    clickEventHandler = callBack;
  };
  
  this.onLeave = function(callBack){
    leaveEventHandler = callBack;
  };
  
  this.onContextMenu = function(callBack){
    contextMenuEventHandler = callBack;
  };
}