const bindJQueryPartnerships = selectedItems => {
  $(document).ready(async function() {
    collaborationTableData = [...window.partnershipsCsvTableData];

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
