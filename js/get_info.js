import {
    CORS_PREFIX
    } from './init';
import {
    fancyAlert
} from './fancy_alert';

// get url for GetFeatureInfo request
function getInfoUrl(evt, view, lyr) {
    var coordinate = evt.coordinate;
    var url = CORS_PREFIX;
    var viewResolution = /** @type {number} */ (view.getResolution());
    url += lyr.get('source').getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
        'INFO_FORMAT': 'text/html',
        'FI_POINT_TOLERANCE': 10,
        'FI_LINE_TOLERANCE': 10,
        'FI_POLYGON_TOLERANCE': 0,
    });

    return url;
}

// https://stackoverflow.com/a/53897629/1979665
function getHTML(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'document';
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.response.documentElement.innerHTML);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
}

async function infoArray(evt, view, ol_layers) {
    // initialyze page numbers and iframe array
    var pNum = 0;
    var iframeArr = [];
    // display info in fancyAlert at map's 'singleclick' events
    for (let i = 0; i < ol_layers.length; ++i) {
        let layer = ol_layers[i];
        // only get info for operational layers
        if (layer.get('type') != 'base') {
            // only get info for ovisible layers
            var visible = layer.getVisible();
            if (visible) {
                let gfi_url = getInfoUrl(evt, view, layer);
                if (gfi_url) {
                    var remoteCode = await getHTML(gfi_url);
                    if (remoteCode.indexOf('</table>') != remoteCode.lastIndexOf('</table>')) {
                        // fancyAlert(remoteCode, 'info', 'Layer Info');
                        iframeArr[pNum] = remoteCode;
                        pNum += 1;
                    }
                }
            }
        }
    }

    return [pNum, iframeArr];
}

export async function getInfo(evt, view, ol_layers) {
    var info_arr = await infoArray(evt, view, ol_layers);
    var pNum = info_arr[0];
    var pSrc = info_arr[1];
    var switch_page = switchPage(pNum-1, pSrc);
    if (pSrc) {
        fancyAlert(pSrc[0], 'info', 'Layer Info', switch_page);
	}
}

// build next/prev buttons to switch info page when multiple layers are queried
function switchPage(maxPage, pSrc) {
    var currPage = 0;
    var switch_page = document.createElement("DIV");

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
    var pText = document.createTextNode(String(currPage+1) + " of " + String(maxPage+1));
    pagination.appendChild(pText);

    switch_page.appendChild(prevBtn);
    switch_page.appendChild(nextBtn);
    switch_page.appendChild(pagination);

    prevBtn.onclick = function() {
        currPage--;
        if (currPage < 0) currPage = 0;
        document.getElementById("info-page").innerHTML = String(currPage+1) + " of " + String(maxPage+1);
        fancyAlert(pSrc[currPage], 'info', 'Layer Info', switch_page);
    }
    nextBtn.onclick = function() {
        currPage++;
        if (currPage > maxPage) currPage -= 1;
        document.getElementById("info-page").innerHTML = String(currPage+1) + " of " + String(maxPage+1);
        fancyAlert(pSrc[currPage], 'info', 'Layer Info', switch_page);
    }

    return switch_page;
}
