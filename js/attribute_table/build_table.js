import {
    WFSfeatures
} from './get_features';

export async function buildTable(url, typename, projection, filter = null) {
    // get all features from a single typename of a WFS
    var features = await WFSfeatures(url, typename, projection, filter)
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

    return [headers, rows];
}

export function drawTable(headers, rows) {
    // start drawing headers
    var table = document.createElement('TABLE');
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

    return table;
}