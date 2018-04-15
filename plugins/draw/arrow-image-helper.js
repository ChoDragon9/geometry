/**
 * 화살표 이미지 Helper
 */
function ArrowImageHelper(draw, product) {
  "use strict";
  var elemCtrl = product.elementController;
  var funnyMath = product.funnyMath;

  var IMAGE_WIDTH = 25;
  var IMAGE_HEIGHT = 33;

  var NORMAL_IMAGE = './base/images/btn_in-out_normal.png';
  var PRESS_IMAGE = './base/images/btn_in-out_press.png';

  var NORMAL_ALL_IMAGE = './base/images/btn_all_normal.png';
  var PRESS_ALL_IMAGE = './base/images/btn_all_press.png';

  var arrowImageContainner = null;
  var arrowImage = null;
  var halfArrowWidth = IMAGE_WIDTH / 2;
  var halfArrowHeight = IMAGE_HEIGHT / 2;
  var arrowTextContainner = null;
  var arrowText = [];

  var arrowQueue = ['L', 'R', 'LR'];
  var arrowQueueLength = arrowQueue.length;
  var arrowScope = [];
  var currentArrow = null;

  //set Scope of Arrow
  function setArrowScope() {
    var startIndex = 0;
    var endIndex = 0;
    for (var idx = 0; idx < arrowQueueLength; idx++) {
      if (arrowQueue[idx] === draw.options.arrow.min) {
        startIndex = idx;
      }
      if (arrowQueue[idx] === draw.options.arrow.max) {
        endIndex = idx;
      }
    }

    for (var i = startIndex; i <= endIndex; i++) {
      arrowScope.push(arrowQueue[i]);
    }
  }

  function getNextArrow(arrow) {
    var nextIndex = 0;
    var arrowScopeLength = arrowScope.length;

    for (var i = 0, len = arrowScope.length; i < len; i++) {
      if (arrowScope[i] === arrow && arrowScopeLength - 1 !== i) {
        nextIndex = i + 1;
        break;
      }
    }

    return arrowQueue[nextIndex];
  }

  function addArrowGuideText() {
    if (draw.options.arrow !== null) {
      if ('text' in draw.options.arrow) {
        if (draw.options.arrow.text === true) {
          arrowTextContainner = elemCtrl.createGroup();
          arrowText[0] = elemCtrl.createText('A');
          elemCtrl.appendChild(arrowTextContainner, arrowText[0]);
          arrowText[1] = elemCtrl.createText('B');
          elemCtrl.appendChild(arrowTextContainner, arrowText[1]);
        }
      }
    }
  }

  function show() {
    arrowTextContainner.style.display = 'inline';
    arrowImage.style.display = 'inline';
  }

  function hide() {
    arrowTextContainner.style.display = 'none';
    arrowImage.style.display = 'none';
  }

  function changeArrowGuideText(xAxis, yAxis, angle) {
    var radius = halfArrowWidth + 20;
    var textHalfWidth = 4;
    var textHalfHeight = 6;
    var getXAxisOfText = function(angle) {
      return funnyMath.getCosine(angle) * radius - textHalfWidth;
    };

    var getYAxisOfText = function(angle) {
      return funnyMath.getSine(angle) * radius + textHalfHeight;
    };

    var axis = [{
        x: getXAxisOfText(angle + 180),
        y: getYAxisOfText(angle + 180)
      },
      {
        x: getXAxisOfText(angle),
        y: getYAxisOfText(angle)
      }
    ];

    if (arrowTextContainner !== null) {
      elemCtrl.setAttr(arrowText[0], 'x', xAxis + axis[0].x);
      elemCtrl.setAttr(arrowText[0], 'y', yAxis + axis[0].y);

      elemCtrl.setAttr(arrowText[1], 'x', xAxis + axis[1].x);
      elemCtrl.setAttr(arrowText[1], 'y', yAxis + axis[1].y);
    }
  }

  function addImage() {
    if (draw.useArrow === true) {
      var imagePath = draw.options.arrow.mode === arrowQueue[arrowQueueLength - 1] ? NORMAL_ALL_IMAGE : NORMAL_IMAGE;
      var createdImage = elemCtrl.createImage(imagePath, IMAGE_WIDTH, IMAGE_HEIGHT, true);
      arrowImage = createdImage[0];
      arrowImageContainner = createdImage[1];

      addArrowGuideText();
      draw.setCursor(arrowImage);
      bindEvent();
      changeArrow(draw.options.arrow.mode);
    }
  }

  function changeArrow(arrow) {
    currentArrow = arrow;
    changeArrowImage();
    changeArrowImagePath();
  }

  function getArrow() {
    return currentArrow;
  }

  function changeArrowImage() {
    var startAxis = draw.geometryManager.getAxis(0);
    var endAxis = draw.geometryManager.getAxis(1);
    var angle = funnyMath.getAngle(startAxis[0], startAxis[1], endAxis[0], endAxis[1]);
    var textAngle = angle;
    var degree = currentArrow === arrowQueue[1] ? 90 : 270;

    var lineCenter = funnyMath.getLineCenter(startAxis[0], startAxis[1], endAxis[0], endAxis[1]);

    var xAxis = lineCenter[0];
    var yAxis = lineCenter[1];

    elemCtrl.setAttr(arrowImage, 'x', xAxis);
    elemCtrl.setAttr(arrowImage, 'y', yAxis);

    if (draw.options.notUseAutoChangeOfArrow !== true) {
      if (Math.abs(angle) > 90) {
        degree = degree === 90 ? 270 : 90;
        textAngle -= 180;
      }
    }

    changeArrowGuideText(xAxis, yAxis, textAngle);

    angle += degree;

    elemCtrl.setAttr(arrowImageContainner, 'transform', 'rotate(' + angle + ' ' + xAxis + ' ' + yAxis + ') translate(' + (halfArrowWidth * -1) + ',' + (halfArrowHeight * -1) + ')');
  }

  function changeArrowImagePath() {
    var imagePath = currentArrow === arrowQueue[arrowQueueLength - 1] ? NORMAL_ALL_IMAGE : NORMAL_IMAGE;
    elemCtrl.setHrefAttr(arrowImage, imagePath);
  }

  function bindEvent() {
    if (draw.options.useEvent === true) {
      arrowImage.onclick = function(event) {
        event.stopPropagation();
      };

      arrowImage.onmousedown = function(event) {
        event.stopPropagation();

        var imagePath = currentArrow === arrowQueue[arrowQueueLength - 1] ? PRESS_ALL_IMAGE : PRESS_IMAGE;

        arrowImage.isSelected = true;
        elemCtrl.setHrefAttr(arrowImage, imagePath);
      };

      arrowImage.onmouseup = function(event) {
        event.stopPropagation();

        if (arrowImage.isSelected === true) {
          var arrow = getNextArrow(currentArrow);

          arrowImage.isSelected = false;

          changeArrow(arrow);

          draw.callCustomEvent("mouseup", draw.geometryManager.getAll());
        }
      };

      arrowImage.onmouseleave = function(event) {
        event.stopPropagation();

        if (arrowImage.isSelected === true) {
          arrowImage.onmouseup(event);
        }
      };
    }
  }

  function remove() {
    if (draw.useArrow === true) {
      arrowImageContainner.removeChild(arrowImage);
      draw.groupHelper.removeChild(arrowImageContainner);


      if (arrowTextContainner !== null) {
        arrowTextContainner.removeChild(arrowText[0]);
        arrowTextContainner.removeChild(arrowText[1]);

        draw.groupHelper.removeChild(arrowTextContainner);
      }
    }
  }

  function append() {
    if (arrowImageContainner !== null) {
      arrowImageContainner.appendChild(arrowImage);
      draw.groupHelper.appendChild(arrowImageContainner);
    }

    if (arrowTextContainner !== null) {
      arrowTextContainner.appendChild(arrowText[0]);
      arrowTextContainner.appendChild(arrowText[1]);

      draw.groupHelper.appendChild(arrowTextContainner);
    }
  }

  if (draw.useArrow === true) {
    setArrowScope();
  }

  function resetData(){
    arrowImageContainner = null;
    arrowImage = null;
    arrowTextContainner = null;
    arrowText = [];
  }

  return {
    addImage: addImage,
    append: append,
    remove: remove,
    getArrow: getArrow,
    changeArrowImage: changeArrowImage,
    changeArrow: changeArrow,
    show: show,
    hide: hide,
    resetData: resetData
  };
}