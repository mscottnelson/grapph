/* */ 
var parse5 = require('parse5');
var htmlparser2 = require('htmlparser2');

function HtmlToDom(parser, parsingMode) {
  if (!parser) {
    if (parsingMode === "xml") {
      parser = htmlparser2;
    } else {
      parser = parse5;
    }
  }

  if (parser.DefaultHandler || (parser.Parser && parser.TreeAdapters)) {

    // Forgiving HTML parser

    if (parser.DefaultHandler){
      // fb55/htmlparser2

      parser.ParseHtml = function(rawHtml) {
        var handler = new parser.DefaultHandler();
        // Check if document is XML
        var isXML = parsingMode === "xml";
        var parserInstance = new parser.Parser(handler, {
          xmlMode: isXML,
          lowerCaseTags: !isXML,
          lowerCaseAttributeNames: !isXML,
          decodeEntities: true
        });

        parserInstance.includeLocation = false;
        parserInstance.parseComplete(rawHtml);
        return handler.dom;
      };
    } else if (parser.Parser && parser.TreeAdapters) {
      parser.ParseHtml = function (rawHtml) {
        if (parsingMode === 'xml') {
          throw new Error('Can\'t parse XML with parse5, please use htmlparser2 instead.');
        }
        var instance = new parser.Parser(parser.TreeAdapters.htmlparser2);
        var dom = instance.parse(rawHtml);
        return dom.children;
      };
    }

    this.appendHtmlToElement = function(html, element) {

      if (typeof html !== 'string') {
        html +='';
      }

      var parsed = parser.ParseHtml(html);

      for (var i = 0; i < parsed.length; i++) {
        setChild(element, parsed[i]);
      }

      return element;
    };
    this.appendHtmlToDocument = this.appendHtmlToElement;

    if (parser.Parser && parser.TreeAdapters) {
      this.appendHtmlToElement = function (html, element) {

        if (typeof html !== 'string') {
          html += '';
        }

        var instance = new parser.Parser(parser.TreeAdapters.htmlparser2);
        var parentElement = parser.TreeAdapters.htmlparser2.createElement(element.tagName.toLowerCase(), element.namespaceURI, []);
        var dom = instance.parseFragment(html, parentElement);
        var parsed = dom.children;

        for (var i = 0; i < parsed.length; i++) {
          setChild(element, parsed[i]);
        }

        return element;
      };
    }

  } else if (parser.moduleName == 'HTML5') { /* HTML5 parser */
    this.appendHtmlToElement = function(html, element) {

      if (typeof html !== 'string') {
        html += '';
      }
      if (html.length > 0) {
        if (element.nodeType == 9) {
          new parser.Parser({document: element}).parse(html);
        }
        else {
          var p = new parser.Parser({document: element.ownerDocument});
          p.parse_fragment(html, element);
        }
      }
    };
  } else {
    this.appendHtmlToElement = function () {
      console.log('');
      console.log('###########################################################');
      console.log('#  WARNING: No compatible HTML parser was given.');
      console.log('#  Element.innerHTML setter support has been disabled');
      console.log('#  Element.innerHTML getter support will still function');
      console.log('###########################################################');
      console.log('');
    };
  }
};

// utility function for forgiving parser
function setChild(parent, node) {

  var c, newNode, currentDocument = parent._ownerDocument || parent;

  switch (node.type)
  {
    case 'tag':
    case 'script':
    case 'style':
      try {
        newNode = currentDocument._createElementNoTagNameValidation(node.name);
        newNode._namespaceURI = node.namespace || "http://www.w3.org/1999/xhtml";
        if (node.location) {
          newNode.sourceLocation = node.location;
          newNode.sourceLocation.file = parent.sourceLocation.file;
        }
      } catch (err) {
        currentDocument.raise('error', 'invalid markup', {
          exception: err,
          node : node
        });

        return null;
      }
    break;

    case 'text':
      // HTML entities should already be decoded by the parser, so no need to decode them
      newNode = currentDocument.createTextNode(node.data);
    break;

    case 'comment':
      newNode = currentDocument.createComment(node.data);
    break;

    default:
      return null;
    break;
  }

  if (!newNode)
    return null;

  newNode._localName = node.name;

  if (node.attribs) {
    for (c in node.attribs) {
      var prefix = node['x-attribsPrefix'] && node['x-attribsPrefix'][c] ? node['x-attribsPrefix'][c] + ':' : '';
      // catchin errors here helps with improperly escaped attributes
      // but properly fixing parent should (can only?) be done in the htmlparser itself
      try {
        newNode.setAttribute(prefix + c, node.attribs[c]);
        newNode.attributes[prefix + c]._namespaceURI = node['x-attribsNamespace'][c] || null;
        newNode.attributes[prefix + c]._prefix = node['x-attribsPrefix'][c] || null;
        newNode.attributes[prefix + c]._localName = c;
      } catch(e2) { /* noop */ }
    }
  }

  if (node.children) {
    for (c = 0; c < node.children.length; c++) {
      setChild(newNode, node.children[c]);
    }
  }

  try{
    return parent.appendChild(newNode);
  }catch(err){
    currentDocument.raise('error', err.message, {
          exception: err,
          node : node
        });
    return null;
  }
}

exports.HtmlToDom = HtmlToDom;
