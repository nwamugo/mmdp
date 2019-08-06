const bindJQueryImpactFactor = selectedItems => {
  $(document).ready(async function() {

    const impactFactorData = window.impactFactorData

    function download(selectedItems) {
      const headers = {
        organization: 'Organization',
        focusArea: 'FocusArea',
        lga: 'LGA',
        subtheme: 'Subtheme',
        thematicPillar: 'Thematic Pillar',
        targetCompletion: 'Target Completion'
      };

      let allRows = impactFactorData;

      let rowsToDownload = [];

      const fileTitle = 'Impact Factor Table';

      allRows.forEach(row => {
        if (selectedItems.includes(row.organization.replace(/ /g, ''))) {
          rowsToDownload.push({
            organization: row.organization.replace(/,/g, ''),
            focusArea: row.focusArea.replace(/,/g, ''),
            lga: row.lga.replace(/,/g, ''),
            subtheme: row.subtheme.replace(/,/g, ''),
            thematicPillar: row.pillar.replace(/,/g, ' - '),
            targetCompletion: row.targetCompletion.replace(/,/g, ' - ')
          });
        }
      });
      exportCSVFile(headers, rowsToDownload, fileTitle);
    }

    $('#impact-factor-export').click(function() {
      if (selectedItems.length === 0) {
        return null;
      } else {
        download(selectedItems);
        selectedItems.length = 0;
        $('input[name="aaaaa"]').each(function() {
          this.checked = false;
        });
        $('#impact-factor-check-all').prop('checked', false);
      }
    })
  });
};
