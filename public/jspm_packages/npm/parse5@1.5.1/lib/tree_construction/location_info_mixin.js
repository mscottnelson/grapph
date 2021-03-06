/* */ 
'use strict';
var OpenElementStack = require('./open_element_stack'),
    Tokenizer = require('../tokenization/tokenizer'),
    HTML = require('../common/html');
var $ = HTML.TAG_NAMES;
function setEndLocation(element, closingToken, treeAdapter) {
  var loc = element.__location;
  if (!loc)
    return;
  if (!loc.startTag) {
    loc.startTag = {
      start: loc.start,
      end: loc.end
    };
  }
  if (closingToken.location) {
    var tn = treeAdapter.getTagName(element),
        isClosingEndTag = closingToken.type === Tokenizer.END_TAG_TOKEN && tn === closingToken.tagName;
    if (isClosingEndTag) {
      loc.endTag = {
        start: closingToken.location.start,
        end: closingToken.location.end
      };
    }
    loc.end = closingToken.location.end;
  }
}
function patchOpenElementsStack(stack, parser) {
  var treeAdapter = parser.treeAdapter;
  stack.pop = function() {
    setEndLocation(this.current, parser.currentToken, treeAdapter);
    OpenElementStack.prototype.pop.call(this);
  };
  stack.popAllUpToHtmlElement = function() {
    for (var i = this.stackTop; i > 0; i--)
      setEndLocation(this.items[i], parser.currentToken, treeAdapter);
    OpenElementStack.prototype.popAllUpToHtmlElement.call(this);
  };
  stack.remove = function(element) {
    setEndLocation(element, parser.currentToken, treeAdapter);
    OpenElementStack.prototype.remove.call(this, element);
  };
}
exports.assign = function(parser) {
  var parserProto = Object.getPrototypeOf(parser),
      treeAdapter = parser.treeAdapter;
  parser._reset = function(html, document, fragmentContext) {
    parserProto._reset.call(this, html, document, fragmentContext);
    this.attachableElementLocation = null;
    this.lastFosterParentingLocation = null;
    this.currentToken = null;
    patchOpenElementsStack(this.openElements, parser);
  };
  parser._processTokenInForeignContent = function(token) {
    this.currentToken = token;
    parserProto._processTokenInForeignContent.call(this, token);
  };
  parser._processToken = function(token) {
    this.currentToken = token;
    parserProto._processToken.call(this, token);
    if (token.type === Tokenizer.END_TAG_TOKEN && (token.tagName === $.HTML || (token.tagName === $.BODY && this.openElements.hasInScope($.BODY)))) {
      for (var i = this.openElements.stackTop; i >= 0; i--) {
        var element = this.openElements.items[i];
        if (this.treeAdapter.getTagName(element) === token.tagName) {
          setEndLocation(element, token, treeAdapter);
          break;
        }
      }
    }
  };
  parser._setDocumentType = function(token) {
    parserProto._setDocumentType.call(this, token);
    var documentChildren = this.treeAdapter.getChildNodes(this.document),
        cnLength = documentChildren.length;
    for (var i = 0; i < cnLength; i++) {
      var node = documentChildren[i];
      if (this.treeAdapter.isDocumentTypeNode(node)) {
        node.__location = token.location;
        break;
      }
    }
  };
  parser._attachElementToTree = function(element) {
    element.__location = this.attachableElementLocation || null;
    this.attachableElementLocation = null;
    parserProto._attachElementToTree.call(this, element);
  };
  parser._appendElement = function(token, namespaceURI) {
    this.attachableElementLocation = token.location;
    parserProto._appendElement.call(this, token, namespaceURI);
  };
  parser._insertElement = function(token, namespaceURI) {
    this.attachableElementLocation = token.location;
    parserProto._insertElement.call(this, token, namespaceURI);
  };
  parser._insertTemplate = function(token) {
    this.attachableElementLocation = token.location;
    parserProto._insertTemplate.call(this, token);
    var tmplContent = this.treeAdapter.getChildNodes(this.openElements.current)[0];
    tmplContent.__location = null;
  };
  parser._insertFakeRootElement = function() {
    parserProto._insertFakeRootElement.call(this);
    this.openElements.current.__location = null;
  };
  parser._appendCommentNode = function(token, parent) {
    parserProto._appendCommentNode.call(this, token, parent);
    var children = this.treeAdapter.getChildNodes(parent),
        commentNode = children[children.length - 1];
    commentNode.__location = token.location;
  };
  parser._findFosterParentingLocation = function() {
    this.lastFosterParentingLocation = parserProto._findFosterParentingLocation.call(this);
    return this.lastFosterParentingLocation;
  };
  parser._insertCharacters = function(token) {
    parserProto._insertCharacters.call(this, token);
    var hasFosterParent = this._shouldFosterParentOnInsertion(),
        parentingLocation = this.lastFosterParentingLocation,
        parent = (hasFosterParent && parentingLocation.parent) || this.openElements.currentTmplContent || this.openElements.current,
        siblings = this.treeAdapter.getChildNodes(parent),
        textNodeIdx = hasFosterParent && parentingLocation.beforeElement ? siblings.indexOf(parentingLocation.beforeElement) - 1 : siblings.length - 1,
        textNode = siblings[textNodeIdx];
    if (textNode.__location)
      textNode.__location.end = token.location.end;
    else
      textNode.__location = token.location;
  };
};
