export const CORS_PREFIX = 'https://cors-anywhere.herokuapp.com/';

// Insert an element after another (https://stackoverflow.com/a/4793630/1979665)
export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// add zoom icon after "elem"
export function zoomIcon(elem) {
    var span = document.createElement("SPAN");
    span.classList.add("fas", "fa-search-plus");
    elem.appendChild(span);
}
