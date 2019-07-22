const bindJQueryPartnerships = selectedItems => {
  $(document).ready(async function() {
    collaborationTableData = [...window.partnershipsCsvTableData];

    function convertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
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

    function convertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
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

    function exportCSVFile(headers, items, fileTitle) {
      if (headers) {
        items.unshift(headers);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);

      var csv = convertToCSV(jsonObject);

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

    function download(selectedItems) {
      var headers = {
        thematicPillar: 'Thematic Pillar',
        subTheme: 'Sub Theme',
        focusArea: 'Focus Area',
        lga: 'LGA',
        organizationName: 'Name of Organization'
      };

      itemsNotFormatted = collaborationTableData;

      var itemsFormatted = [];

      let fileTitle = '';

      // format the data
      itemsNotFormatted.forEach(item => {
        if (selectedItems.includes('check all items')) {
          itemsFormatted.push({
            thematicPillar: item.thematicPillar.replace(/,/g, ''),
            subTheme: item.subTheme.replace(/,/g, ''),
            focusArea: item.focusArea.replace(/,/g, ''),
            lga: item.lga.replace(/,/g, ''),
            organizationName: item.organizationName.replace(/,/g, ' - ')
          });
        } else if (selectedItems.includes(item._id)) {
          itemsFormatted.push({
            thematicPillar: item.thematicPillar.replace(/,/g, ''),
            subTheme: item.subTheme.replace(/,/g, ''),
            focusArea: item.focusArea.replace(/,/g, ''),
            lga: item.lga.replace(/,/g, ''),
            organizationName: item.organizationName.replace(/,/g, ' - ')
          });
        }
        fileTitle = 'Partnership:Collaboration';
      });
      // (itemsFormatted)
      exportCSVFile(headers, itemsFormatted, fileTitle);
    }
    var partnershipsExport = document.getElementById('partnerships-export');

    partnershipsExport.onclick = function() {
      if (selectedItems.length === 0) {
        return null;
      } else {
        download(selectedItems);
        selectedItems.length = 0;
        $('input[name="collaboration"]').each(function() {
          this.checked = false;
        });
        $('#partnerships-check-all').prop('checked', false);
      }
    };
  });
};
