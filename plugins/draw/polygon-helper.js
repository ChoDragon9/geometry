/**
 * Polygon 태그 헬퍼
 */
function PolygonHelper(draw, product) {
  "use strict";
  var elemCtrl = product.elementController;
  var polygon = null;
  function addPolygon() {
    polygon = elemCtrl.createPolygon();
    if (draw.options.useEvent === true) {
      bindEvent(polygon);
    }
    draw.setCursor(polygon);
  }

  function append() {
    if (draw.options.fill === true) {
      elemCtrl.appendChild(draw.groupHelper, polygon);
    }
  }

  function selectPolygon() {
    setSelectColor();
    polygon.isSelected = true;
    draw.groupHelper.moveTopLayer();
  }

  function bindEvent() {
    polygon.onmousedown = selectPolygon;
    /*
    @date: 2016-09-19
    oncontextmenu로 하면 IE에서 정상 동작을 하지 않기 때문에 삭제됨.
    polygon.oncontextmenu = function(event){
      draw.callCustomEvent("polygoncontextmenu", event);
    };
    */
    polygon.onmouseup = function() {
      if (draw.options.customDraw === true) {
        return;
      }
      update();
    };
    polygon.addEventListener('mouseleave', function() {
      if (polygon.isSelected === true) {
        update();
      }
    });
    polygon.addEventListener('contextmenu', function(event) {
      draw.callCustomEvent("polygoncontextmenu", event);
    });
    // polygon.onmouseup = function(){
    // 	draw.callCustomEvent("mouseup", draw.geometryManager.getAll());
    // };
  }

  function remove() {
    if (draw.options.fill === true) {
      elemCtrl.removeChild(draw.groupHelper, polygon);
    }
  }

  function setDefaultColor() {
    if (draw.options.fill === true) {
      polygon.style.fill = draw.options.fillColor;
      polygon.style.opacity = draw.options.fillOpacity;
    }
  }

  function setSelectColor() {
    if (polygon === null) {
      return;
    }

    var opacity = draw.options.fillOpacity;
    if (opacity > 0) {
      opacity = opacity + opacity * 0.5;
    }
    polygon.style.opacity = opacity;
  }

  function update() {
    setTimeout(function() {
      draw.callCustomEvent("mouseup", draw.geometryManager.getAll());
    });
  }

  function getPolygon(){
    return polygon;
  }

  function setPolygon(_polygon){
    polygon = _polygon;
  }

  return {
    addPolygon: addPolygon,
    append: append,
    bindEvent: bindEvent,
    selectPolygon: selectPolygon,
    remove: remove,
    setDefaultColor: setDefaultColor,
    setSelectColor: setSelectColor,
    getPolygon: getPolygon,
    setPolygon: setPolygon
  };
}