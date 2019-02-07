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
        'INFO_FORMAT': 'text/html'
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
    var switch_page = switchPage(pNum, pSrc);
    if (pSrc) {
        alert(pNum);
        fancyAlert(pSrc[0], 'info', 'Layer Info', switch_page);
	}
}

// build next/prev buttons to switch info page when multiple layers are queried
function switchPage(pNum, pSrc) {
    var maxPage = pNum-1;
    var switch_page = document.createElement("DIV");

    var prevBtn = document.createElement("BUTTON");
    var prevText = document.createTextNode("<");
    prevBtn.appendChild(prevText);
    prevBtn.classList.add("switch");

    var nextBtn = document.createElement("BUTTON");
    var nextText = document.createTextNode(">");
    nextBtn.appendChild(nextText);
    nextBtn.classList.add("switch");

    switch_page.appendChild(prevBtn);
    switch_page.appendChild(nextBtn);

    prevBtn.onclick = function() {
        pNum--;
        if (pNum < 0) pNum = 0;
        alert(pNum);
        alert(maxPage);
        fancyAlert(pSrc[pNum], 'info', 'Layer Info', switch_page);
    }
    nextBtn.onclick = function() {
        pNum++;
        if (pNum > maxPage) pNum = 0;
        alert(pNum);
        alert(maxPage);
        fancyAlert(pSrc[pNum], 'info', 'Layer Info', switch_page);
    }

    return switch_page;
}
