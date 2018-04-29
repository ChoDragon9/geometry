"use strict";

/**
 * Group 태그 Helper
 */
function GroupHelper(draw, product){
  var groupId = null;
  var groupTag = null;

  var parentSvg = product.getParentSvg();
  var notUseMoveTopLayer = draw.options.notUseMoveTopLayer;

  return {
    add: function() {
      groupTag = ElementController.createGroup();
      groupId = 'group_' + Math.ceil(Math.random() * 1000000);
      ElementController.setAttr(groupTag, 'id', groupId);
    },
    remove: function() {
      product.removeParentChild(groupTag);
    },
    moveTopLayer: function() {
      if (notUseMoveTopLayer === true) {
        return;
      }
      var lastChild = parentSvg.lastChild;

      if (lastChild.id !== groupId) {
        parentSvg.insertBefore(
          groupTag,
          lastChild.nextSibling
        );
      }
    },
    append: function() {
      product.appendParentChild(groupTag);
    },
    appendChild: function(child) {
      ElementController.appendChild(groupTag, child);
    },
    removeChild: function(child) {
      ElementController.removeChild(groupTag, child);
    },
    insertBefore: function() {
      groupTag.insertBefore.apply(groupTag, arguments);
    }
  };
}