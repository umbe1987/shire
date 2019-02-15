import {
    GetFeatureURL,
    WFSfeatures
} from './get_features';

export async function buildTable(lyr_source, typename, projection, filter = null) {
    var getfeature_url = GetFeatureURL(lyr_source, typename);
    // get all features from a single typename of a WFS
    var features = await WFSfeatures(getfeature_url, projection, filter)
    // get the FILEDS of the table from the first record (FIELDS are shared by each feature)
    var headers = Object.keys(features[0].values_);
    // initilaize rows for inserting the fileds' values
    var rows = [];

    // build the rows for the table, filling with the values from each field of each record
    for (var i = 0, len = features.length; i < len; ++i) {
        var row = features[i].values_;
        var rowToPush = [];
        // fill the single row and then push in the final table
        for (const key of Object.keys(row)) {
            rowToPush.push(row[key]);
        }
        rows.push(rowToPush);
    }

    return [headers, rows, getfeature_url];
}

export function drawTable(headers, rows, url) {
    // start drawing headers
    var table = document.createElement('TABLE');
    table.classList.add('tableFixHead');
    var t_row = table.insertRow(0);
    for (var j = 0, len_j = headers.length; j < len_j; ++j) {
        var th = document.createElement('TH');
        var cell = document.createTextNode(headers[j]);
        th.appendChild(cell);
        t_row.appendChild(th);
    }
    table.appendChild(t_row);

    // then draw the records with their values
    for (var z = 0, len_z = rows.length; z < len_z; ++z) {
        var t_row = table.insertRow(z + 1);
        for (var y = 0, len_y = rows[z].length; y < len_y; ++y) {
            t_row.insertCell(y).innerHTML = rows[z][y];
        }
    }

    // finally creates the download button (to be placed in the footer)
    var button = downloadBtn(url);

    return [table, button];
}

// draw a dropdown button with export functionality to be placed in the table footer
// works with a php (it passes its params to a php to execute download)
function downloadBtn(url) {
    function toggleBtn(btn, dropdown) {
        btn.onclick = function() {
            // format list for conversion with ogr2ogr
            var format_list = ["ESRI Shapefile",
                               "CSV",
                               "KML",
                               "DXF"];
            // create the list
            var list = document.createElement("DIV");
            list.id = "myDropdown";
            list.classList.add("dropdown-content");
            // create list of formats and attach onclick events to perform download with php
            for (var i = 0, len = format_list.length; i < len; ++i) {
                var anchor = document.createElement("A");
                anchor.href = "#";
                // Prevent a link from opening the URL
                anchor.addEventListener("click", function(event) {
                    // event.preventDefault();
                    // (https://w3epic.com/how-to-pass-variable-from-php-to-javascript-javascript-to-php/)
                    var xhr;
                    if (window.XMLHttpRequest) xhr = new XMLHttpRequest(); // all browsers
                    else xhr = new ActiveXObject("Microsoft.XMLHTTP"); // for IE

                    // build a URL to the php (e.g. https://localhost/wondermap/php/export_wfs.php)
                    // window.location (https://www.w3schools.com/js/js_window_location.asp)
                    // (https://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/)
                    var php_url = window.location.protocol + "//" + window.location.host;
                    var root_path =  window.location.pathname.split("/");
                    for (var j = 0, len_j = root_path.length; j < len_j - 1; ++j) {
                        // this is to avoid placing "/" in case of empty part
                        if (root_path[j]) {
                            php_url += '/';
                            php_url += root_path[j];
                        }
                    }
                    php_url += '/php/export_wfs.php';
                    // (https://stackoverflow.com/a/53982364/1979665)
                    var formData = new FormData();
                    formData.append('wfs_url', url);
                    formData.append('format', this.text);
                    xhr.open('POST', php_url, true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            // (https://stackoverflow.com/a/47418911/1979665)
                            var blob = new Blob([xhr.response], {
                                type: "application/zip"
                            });
                            var filename = "wondermap.zip";
                            if (navigator.msSaveOrOpenBlob) {
                                navigator.msSaveOrOpenBlob(blob, filename);
                            } else {
                                var a = document.createElement("a");
                                document.body.appendChild(a);
                                a.style = "display:none";
                                var url = window.URL.createObjectURL(blob);
                                a.href = url;
                                a.download = filename;
                                a.click();
                                window.URL.revokeObjectURL(url);
                                a.remove();
                            }
                        }
                    }
                    xhr.responseType = "arraybuffer";
                    xhr.send(formData);

                    return false;
                });
                var format = document.createTextNode(format_list[i]);
                anchor.appendChild(format);
                list.appendChild(anchor);
            }
            dropdown.appendChild(list);
            list.classList.toggle("show");
        };
    }

    function drawBtn() {
        var dropdown = document.createElement("DIV");
        //  create the button
        dropdown.classList.add("dropdown");
        var btn = document.createElement("BUTTON");
        btn.classList.add("wm-btn");
        var t = document.createTextNode("Download");
        btn.appendChild(t);
        dropdown.appendChild(btn);

        toggleBtn(btn, dropdown);

        return dropdown;
    }

    var download_btn = drawBtn();

    return download_btn;
}
