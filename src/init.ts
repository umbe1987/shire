import {
    registerProjection
} from './projection';

// IMPORTANT: ADD PROJECTION DEFINITIONS IN THE PROJECTION FILE IF YOU HAVE ISSUES!!!
// register projections (defined in /js/projection.js)
registerProjection();

export const CORS_PREFIX = '';

// Insert an element after another (https://stackoverflow.com/a/4793630/1979665)
export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function getSiblings(elem) {
    var siblings = elem.parentNode.childNodes;

    return siblings;
}

// from https://github.com/johndugan/javascript-debounce
// Create JD Object
// ----------------
export var JD = {};

// Debounce Method
// ---------------
JD.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if ( !immediate ) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 200);
        if ( callNow ) { 
            func.apply(context, args);
        }
    };
};

export function toggleTitle() {
    var toggle_title = document.getElementsByClassName("arrow-down")[0];
    var title_bar = document.getElementById("mapTitle");

    toggle_title.addEventListener("click", function() {
        if (title_bar.classList.contains("hidden")) {
            title_bar.classList.remove("hidden");
        } else {
            title_bar.classList.add("hidden");
        }
    });
}
