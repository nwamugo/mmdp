/**
 * @description - Convert input to csv
 * @param {any} objArray 
 */
function convertToCSV(jsonString) {
  var array = typeof jsonString != 'object' ? JSON.parse(jsonString) : jsonString;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ',';
      line += array[i][index];
    }
    str += line + '\r\n';
  }
  return str;
}

/**
 * @description - Format the selected rows and export as csv
 * @param {object} headers 
 * @param {array} rowsToDownload 
 * @param {string} fileTitle 
 */
function exportCSVFile(headers, rowsToDownload, fileTitle) {
  if (headers) {
    rowsToDownload.unshift(headers);
  }

  var jsonString = JSON.stringify(rowsToDownload);

  var csv = convertToCSV(jsonString);

  var exportedFilename = fileTitle + '.csv' || 'export.csv';

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    var link = document.createElement('a');
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportedFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
