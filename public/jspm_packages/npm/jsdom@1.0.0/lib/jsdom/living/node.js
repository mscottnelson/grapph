/* */ 
var core = Object.create(require('../level3/core').dom.level3.core);
var defineGetter = require('../utils').defineGetter;
var DOCUMENT_POSITION_DISCONNECTED = core.Node.DOCUMENT_POSITION_DISCONNECTED;
var DOCUMENT_POSITION_PRECEDING = core.Node.DOCUMENT_POSITION_PRECEDING;
var DOCUMENT_POSITION_FOLLOWING = core.Node.DOCUMENT_POSITION_FOLLOWING;
var DOCUMENT_POSITION_CONTAINS = core.Node.DOCUMENT_POSITION_CONTAINS;
var DOCUMENT_POSITION_CONTAINED_BY = core.Node.DOCUMENT_POSITION_CONTAINED_BY;
var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = core.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
function isObsoleteNodeType(node) {
  return node.nodeType === core.Node.ENTITY_NODE || node.nodeType === core.Node.ENTITY_REFERENCE_NODE || node.nodeType === core.Node.NOTATION_NODE || node.nodeType === core.Node.CDATA_SECTION_NODE;
}
function getNodeParent(node) {
  if (!node) {
    return node;
  }
  switch (node.nodeType) {
    case core.Node.DOCUMENT_NODE:
    case core.Node.DOCUMENT_FRAGMENT_NODE:
      return null;
    case core.Node.COMMENT_NODE:
    case core.Node.DOCUMENT_TYPE_NODE:
    case core.Node.ELEMENT_NODE:
    case core.Node.PROCESSING_INSTRUCTION_NODE:
    case core.Node.TEXT_NODE:
      return node.parentNode;
    case core.Node.ATTRIBUTE_NODE:
      return node._parentNode;
    default:
      throw new Error('Unknown node type:' + node.nodeType);
  }
}
function findNodeRoot(node) {
  if (!getNodeParent(node)) {
    return node;
  }
  return findNodeRoot(getNodeParent(node));
}
function isAncestor(node, otherNode) {
  var parentNode = node.nodeType === node.ATTRIBUTE_NODE ? node._parentNode : node.parentNode;
  if (!parentNode) {
    return false;
  }
  if (parentNode === otherNode) {
    return true;
  }
  return isAncestor(parentNode, otherNode);
}
function followingOrPreceding(current, node, otherNode) {
  if (current === node) {
    return core.Node.DOCUMENT_POSITION_FOLLOWING;
  }
  if (current === otherNode) {
    return core.Node.DOCUMENT_POSITION_PRECEDING;
  }
  var i = 0,
      len = current.childNodes.length,
      child,
      result;
  for (; i < len; i += 1) {
    child = current.childNodes.item(i);
    if ((result = followingOrPreceding(child, node, otherNode)) !== 0) {
      return result;
    }
  }
  return 0;
}
core.Node.prototype.compareDocumentPosition = function compareDocumentPosition(other) {
  var reference = this;
  if (!(other instanceof core.Node)) {
    throw Error("Comparing position against non-Node values is not allowed");
  }
  if (isObsoleteNodeType(reference) || isObsoleteNodeType(other)) {
    throw new Error('Obsolete Node Type');
  }
  if (reference.isSameNode(other)) {
    return 0;
  }
  if (findNodeRoot(reference) !== findNodeRoot(other)) {
    return DOCUMENT_POSITION_DISCONNECTED + DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DOCUMENT_POSITION_FOLLOWING;
  }
  if (isAncestor(reference, other)) {
    return DOCUMENT_POSITION_CONTAINS + DOCUMENT_POSITION_PRECEDING;
  }
  if (isAncestor(other, reference)) {
    return DOCUMENT_POSITION_CONTAINED_BY + DOCUMENT_POSITION_FOLLOWING;
  }
  return followingOrPreceding(findNodeRoot(reference), reference, other);
};
core.Node.prototype.contains = function(other) {
  return other instanceof core.Node && (this.isSameNode(other) || !!(this.compareDocumentPosition(other) & DOCUMENT_POSITION_CONTAINED_BY));
};
defineGetter(core.Node.prototype, "parentElement", function() {
  return this._parentNode !== null && this._parentNode.nodeType === core.Node.ELEMENT_NODE ? this._parentNode : null;
});
