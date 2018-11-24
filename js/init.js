export const CORS_PREFIX = 'https://cors-anywhere.herokuapp.com/';

// Insert an element after another (https://stackoverflow.com/a/4793630/1979665)
export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function getSiblings(elem) {
    var siblings = elem.parentNode.childNodes;

    return siblings;
}
