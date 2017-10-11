"use strict";

/**
 * Group 태그 Helper
 */
function GroupHelper(){
  var groupId = null;
  var groupTag = null;
  var elemCtrl = this.elementController;
  var parentSvg = elemCtrl.getParentSvg();
  var notUseMoveTopLayer = this.options.notUseMoveTopLayer;

  return {
    add: function() {
      groupTag = elemCtrl.createGroup();
      groupId = 'group_' + Math.ceil(Math.random() * 1000000);
      elemCtrl.setAttr(groupTag, 'id', groupId);
    },
    remove: function() {
      elemCtrl.removeParentChild(groupTag);
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
      elemCtrl.appendParentChild(groupTag);
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