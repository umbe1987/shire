import { getSiblings } from './init';

// add zoom icon after "elem"
export function zoomIcon(elem) {
    // avoid adding zoom to base layers
    if (elem.firstChild.getAttribute("name") !== "base") {
        var span = document.createElement("SPAN");
        span.classList.add("fas", "fa-search-plus");
        elem.appendChild(span);
    }
}

export function ZoomToExtent(zoom_icons, ol_layers, view) {
    for (let i = 0; i < zoom_icons.length; ++i) {
        zoom_icons[i].addEventListener('click', fn, false);
}

function fn(evt) {
    var siblings = getSiblings(evt.target);
    for (let i = 0; i < siblings.length; ++i) {
        var sibling = siblings[i];
        if (sibling.nodeName === "LABEL") {
            // name of layer within label tag
            var layer_title = sibling.textContent;
            // loop through ol layers
            for (let i = 0; i < ol_layers.length; ++i) {
                var lyr = ol_layers[i];
                // if ol layer name corresponds to label layer name, zoom to its extent
                if (lyr.get("title") === layer_title) {
                    view.fit(lyr.getExtent(), { duration: 1000 });
                }
            }
        }
    }
    if ( this.name == 'link1' ) {

        console.log('This is link1');

    } else if ( this.name == 'link2' ) {

        console.log('This is link2');

    }
}
}
