import {
    getSiblings
} from '../init';
import {
    FancyAlert
} from '../fancy_alert';
import {
    drawTable
} from '../attribute_table/build_table';
import {
    buildTable
} from '../attribute_table/get_features';
import {
    tableArray,
    GetFeatureCount

} from "../attribute_table/get_features";

// add table icon after "elem"
export function tableIcon(class_layers) {
    // remove table-icons if they exist
    document.querySelectorAll('.fa-table').forEach(e => e.remove());
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

export function OpenTable(table_icons, ol_layers) {
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
                    if (lyr.get("title") === layer_title.replace('\t', '')) {
                        // get WMS-WFS base URI
                        var url = lyr.get("source")["url_"];
                        // get lyr CRS
                        var projection = lyr.getSource().getProjection().getCode();
                        // get lyr name (typename)
                        var typename = lyr.get("name");
                        GetFeatureCount(url, typename).then(tot_feat => {
                            tableArray(url, typename, tot_feat).then(table_arr => {
                                var pNum = table_arr[0];
                                console.log("Number of pages: " + pNum);
                                var gfi_url = table_arr[1];
                                var index = table_arr[2];
                                buildTable(gfi_url[0], typename, projection, index).then(result => {
                                    var headers = result[0];
                                    var rows = result[1];
                                    var getfeature_url = result[2];
                                    // then draw it!
                                    var attr_table = drawTable(headers, rows, getfeature_url);
                                    var table_content = attr_table[0];
                                    var download_btn = attr_table[1];
                                    var switch_page = switchPage(pNum - 1, gfi_url, typename, projection, index, download_btn);
                                    // place the table within a fancyAlert
                                    // we need to use XMLSerializer().serializeToString to convert attr_tbl which is a [object HTMLTableElement] to he serialized subtree of a string
                                    // (https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
                                    if (gfi_url) {
                                        new FancyAlert(new XMLSerializer().serializeToString(table_content), "info", "Attribute Table", switch_page);
                                    }
                                }).catch(err => {
                                    new FancyAlert("buildTable Error FIRST", "error");
                                })
                            }).catch(err => {
                                new FancyAlert("tableArray Error", "error");
                            });
                        }).catch(err => {
                            new FancyAlert("GetFeatureCount Error", "error");
                        });
                    }
                }
            }
        }
    }
}

// build next/prev buttons to switch info page when multiple layers are queried
function switchPage(maxPage, url, typename, projection, index, download_div) {
    console.log(maxPage);
    var currPage = 0;
    var switch_page = document.createElement("DIV");
    if (maxPage > 0) {
        var prevBtn = document.createElement("BUTTON");
        var prevText = document.createTextNode("<");
        prevBtn.appendChild(prevText);
        prevBtn.classList.add("switch");

        var nextBtn = document.createElement("BUTTON");
        var nextText = document.createTextNode(">");
        nextBtn.appendChild(nextText);
        nextBtn.classList.add("switch");

        var pagination = document.createElement("P");
        pagination.id = "info-page";
        var pText = document.createTextNode(String(currPage + 1) + " of " + String(maxPage + 1));
        pagination.appendChild(pText);

        switch_page.appendChild(prevBtn);
        switch_page.appendChild(nextBtn);
        switch_page.appendChild(pagination);

        prevBtn.onclick = function () {
            currPage--;
            if (currPage < 0) currPage = 0;
            document.getElementById("info-page").innerHTML = String(currPage + 1) + " of " + String(maxPage + 1);
            buildTable(url[currPage], typename, projection, index).then(result => {
                var headers = result[0];
                var rows = result[1];
                var getfeature_url = result[2];
                // then draw it!
                var attr_table = drawTable(headers, rows, getfeature_url);
                var table_content = attr_table[0];
                // place the table within a fancyAlert
                // we need to use XMLSerializer().serializeToString to convert attr_tbl which is a [object HTMLTableElement] to he serialized subtree of a string
                // (https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
                new FancyAlert(new XMLSerializer().serializeToString(table_content), "info", "Attribute Table", switch_page);
                // new FancyAlert(pSrc[currPage], "info", "Attribute Table", switch_page);
            }).catch(err => {
                new FancyAlert("buildTable Error", "error");
            });
        }
        nextBtn.onclick = function () {
            currPage++;
            if (currPage > maxPage) currPage -= 1;
            document.getElementById("info-page").innerHTML = String(currPage + 1) + " of " + String(maxPage + 1);
            buildTable(url[currPage], typename, projection, index).then(result => {
                var headers = result[0];
                var rows = result[1];
                var getfeature_url = result[2];
                // then draw it!
                var attr_table = drawTable(headers, rows, getfeature_url);
                var table_content = attr_table[0];
                // place the table within a fancyAlert
                // we need to use XMLSerializer().serializeToString to convert attr_tbl which is a [object HTMLTableElement] to he serialized subtree of a string
                // (https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
                new FancyAlert(new XMLSerializer().serializeToString(table_content), "info", "Attribute Table", switch_page);
                // new FancyAlert(pSrc[currPage], "info", "Attribute Table", switch_page);
            }).catch(err => {
                new FancyAlert("buildTable Error", "error");
            });
        }
    }

    switch_page.appendChild(download_div);

    return switch_page;
}
