import {
    getSiblings
} from '../init';
import {
    fancyAlert
} from '../fancy_alert';
import {
    buildTable, drawTable
} from '../attribute_table/build_table';

// add table icon after "elem"
export function tableIcon(class_layers) {
    for (var i = 0, len = class_layers.length; i < len; ++i) {
        var elem = class_layers[i];
        // avoid adding table to base layers
        if (elem.firstChild.getAttribute("name") !== "base") {
            var span = document.createElement("SPAN");
            span.classList.add("fas", "fa-table");
            elem.appendChild(span);
        }
    }

}

export function OpenTable(table_icons, ol_layers, projection) {
    for (let i = 0, len = table_icons.length; i < len; ++i) {
        table_icons[i].addEventListener('click', fn, false);
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
                    // if ol layer name corresponds to label layer name, open its table
                    if (lyr.get("title") === layer_title.replace('\t','')) {
                        // get WMS-WFS base URI
                        var url = lyr.get("source")["url_"];
                        // generate headers and record values of the attr table
                        buildTable(url, lyr.get("name"), projection).then(result => {
                            var headers = result[0];
                            var rows = result[1];
                            var getfeature_url = result[2];
                            alert(getfeature_url);
                            // then draw it!
                            var attr_table = drawTable(headers, rows, getfeature_url);
                            var table_content = attr_table[0];
                            var download_btn = attr_table[1];
                            // place the table within a fancyAlert
                            // we need to use XMLSerializer().serializeToString to convert attr_tbl which is a [object HTMLTableElement] to he serialized subtree of a string
                            // (https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
                            fancyAlert(new XMLSerializer().serializeToString(table_content), "info", "Attribute Table", download_btn);
                        }).catch(err => {
                            fancyAlert(err, "error");
                        });

                    }
                }
            }
        }
    }
}
