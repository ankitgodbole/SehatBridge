// replaceText.js
export function replaceTextInDOM() {
    function replaceTextInNode(node) {
      if (node.nodeType === 3) {
        node.nodeValue = node.nodeValue.replace(/med[- ]space/gi, 'SehatBridge');
      } else {
        node.childNodes.forEach(replaceTextInNode);
      }
    }
  
    replaceTextInNode(document.body);
  }
  