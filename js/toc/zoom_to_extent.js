import {
    getSiblings
} from './init';

// add zoom icon after "elem"
export function zoomIcon(class_layers) {
    for (var i = 0, len = class_layers.length; i < len; ++i) {
        var elem = class_layers[i];
        // avoid adding zoom to base layers
        if (elem.firstChild.getAttribute("name") !== "base") {
            var span = document.createElement("SPAN");
            span.classList.add("fas", "fa-search-plus");
            elem.appendChild(span);
        }
    }

}

export function ZoomToExtent(zoom_icons, ol_layers, view) {
    for (let i = 0, len = zoom_icons.length; i < len; ++i) {
        zoom_icons[i].addEventListener('click', fn, false);
    }

    function fn(evt) {
        var siblings = getSiblings(evt.target);
        for (var i = 0, len_i = siblings.length; i < len_i; ++i) {
            var sibling = siblings[i];
            if (sibling.nodeName === "LABEL") {
                // name of layer within label tag
                var layer_title = sibling.textContent;
                // loop through ol layers
                for (var j = 0, len_j = ol_layers.length; j < len_j; ++j) {
                    var lyr = ol_layers[j];
                    // if ol layer name corresponds to label layer name, zoom to its extent
                    if (lyr.get("title") === layer_title.replace('\t','')) {
                        view.fit(lyr.getExtent(), {
                            duration: 1000
                        });
                    }
                }
            }
        }
    }
}
