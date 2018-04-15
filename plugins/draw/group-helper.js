"use strict";

/**
 * Group 태그 Helper
 */
function GroupHelper(draw){
  var groupId = null;
  var groupTag = null;
  var elemCtrl = draw.elementController;
  var parentSvg = draw.getParentSvg();
  var notUseMoveTopLayer = draw.options.notUseMoveTopLayer;

  return {
    add: function() {
      groupTag = elemCtrl.createGroup();
      groupId = 'group_' + Math.ceil(Math.random() * 1000000);
      elemCtrl.setAttr(groupTag, 'id', groupId);
    },
    remove: function() {
      draw.removeParentChild(groupTag);
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
      draw.appendParentChild(groupTag);
    },
    appendChild: function(child) {
      elemCtrl.appendChild(groupTag, child);
    },
    removeChild: function(child) {
      elemCtrl.removeChild(groupTag, child);
    },
    insertBefore: function() {
      groupTag.insertBefore.apply(groupTag, arguments);
    }
  };
}