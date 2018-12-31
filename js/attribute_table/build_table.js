import {
    GetFeatureURL, WFSfeatures
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
        var row =features[i].values_;
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
    for (var j = 0, len_j = headers.length; j < len_j; ++j){
        var th = document.createElement('TH');
        var cell = document.createTextNode(headers[j]);
        th.appendChild(cell);
        t_row.appendChild(th);
    }
    table.appendChild(t_row);

    // then draw the records with their values
    for (var z = 0, len_z = rows.length; z < len_z; ++z){
        var t_row = table.insertRow(z + 1);
        for (var y = 0, len_y = rows[z].length; y < len_y; ++y){
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
    function toggleBtn(btn, dropdown_list) {
        btn.onclick = function() {
            dropdown_list.classList.toggle("show");
            };
    }

    function drawBtn() {
        var dropdown = document.createElement("DIV");
        //  create the button
        dropdown.classList.add("dropdown");
        var btn = document.createElement("BUTTON");
        btn.classList.add("dropbtn");
        var t = document.createTextNode("Download");
        btn.appendChild(t);
        dropdown.appendChild(btn);
        // format list for conversion with ogr2ogr
        var format_list = ["ESRI Shapefile"];
        // create the list
        var list = document.createElement("DIV");
        list.id = "myDropdown";
        list.classList.add("dropdown-content");
        // create list of formats and attach onclick events to perform download with php
        for (var i = 0, len = format_list.length; i < len; ++i){
            var anchor = document.createElement("A");
            anchor.href = "#";
            // Prevent a link from opening the URL
            anchor.addEventListener("click", function(event){
                // event.preventDefault();
                // (https://w3epic.com/how-to-pass-variable-from-php-to-javascript-javascript-to-php/)
                var xhr;
                if (window.XMLHttpRequest) xhr = new XMLHttpRequest(); // all browsers
                else xhr = new ActiveXObject("Microsoft.XMLHTTP"); // for IE

                // window.location.hostname for (e.g.) http://www.mysite.com/somepage is www.mysite.com
                // window.location.protocol for (e.g.) http://www.mysite.com/somepage is http
                // NOTE: in my url there's already a "&" at the end (../project.qgs&)
                var php_url = '/shire/php/export_wfs.php' // ?wfs_url=' + url + 'format=' + format_list[0];
                // (https://stackoverflow.com/a/53982364/1979665)
                var formData = new FormData();
                formData.append('wfs_url', url);
                formData.append('format', format_list[0]);
                xhr.open('POST', php_url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState===4 && xhr.status===200) {
                        alert('Server reply: ' + xhr.responseText);
                    }
                }
                xhr.send(formData);

                return false;
            });
            var format = document.createTextNode(format_list[i]);
            anchor.appendChild(format);
            list.appendChild(anchor);
        }
        dropdown.appendChild(list);

        toggleBtn(btn, list);

        return dropdown;
        }

    var download_btn = drawBtn();

    return download_btn;
}
