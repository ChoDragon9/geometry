/**
 * Polygon 태그 헬퍼
 */
const ElementController = require('../../common/ElementController')
const _ = require('../../common/fp')

module.exports = function PolygonHelper (draw, rootSVG) { // eslint-disable-line
  'use strict'

  var polygon = null
  function addPolygon () {
    polygon = ElementController.createPolygon()
    if (draw.options.useEvent === true) {
      bindEvent(polygon)
    }
    draw.drawView.setCursor(polygon)
  }

  function append () {
    if (draw.options.fill === true) {
      draw.groupHelper.appendChild(polygon)
    }
  }

  function selectPolygon () {
    setSelectColor()
    polygon.isSelected = true
    draw.groupHelper.moveTopLayer()
  }

  function bindEvent () {
    polygon.onmousedown = selectPolygon
    /*
    @date: 2016-09-19
    oncontextmenu로 하면 IE에서 정상 동작을 하지 않기 때문에 삭제됨.
    polygon.oncontextmenu = function(event){
      draw.callCustomEvent("polygoncontextmenu", event);
    };
    */
    polygon.onmouseup = function () {
      if (draw.options.customDraw === true) {
        return
      }
      update()
    }
    polygon.addEventListener('mouseleave', function () {
      if (polygon.isSelected === true) {
        update()
      }
    })
    polygon.addEventListener('contextmenu', function (event) {
      draw.callCustomEvent('polygoncontextmenu', event)
    })
  }

  function remove () {
    if (draw.options.fill === true) {
      draw.groupHelper.removeChild(polygon)
    }
  }

  function setDefaultColor () {
    if (draw.options.fill === true) {
      _.divEq(
        ElementController.style('fill', draw.options.fillColor),
        ElementController.style('opacity', draw.options.fillOpacity)
      )(polygon)
    }
  }

  function setSelectColor () {
    if (polygon === null) {
      return
    }

    var opacity = draw.options.fillOpacity
    if (opacity > 0) {
      opacity = opacity + opacity * 0.5
    }
    ElementController.style('opacity', opacity)
  }

  function update () {
    setTimeout(function () {
      draw.callCustomEvent('mouseup', draw.getData())
    })
  }

  function getPolygon () {
    return polygon
  }

  function setPolygon (_polygon) {
    polygon = _polygon
  }

  this.addPolygon = addPolygon
  this.append = append
  this.bindEvent = bindEvent
  this.selectPolygon = selectPolygon
  this.remove = remove
  this.setDefaultColor = setDefaultColor
  this.setSelectColor = setSelectColor
  this.getPolygon = getPolygon
  this.setPolygon = setPolygon
}
