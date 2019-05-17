$(document).ready(async function() {
  tableData = [...window.tableData];

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

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement('a');
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  function download(selectedItems) {
    var headers = {
      organisationName: 'OrganisationName',
      thematicPillars: 'ThematicPillars',
      subThemes: 'SubThemes',
      partnership: 'Partnership',
      location: 'Location',
      beneficiaryCount: 'BeneficiaryCount',
      amountInvested: 'AmountInvested',
      beneficiaryService: 'BeneficiaryService',
      duration: 'Duration',
      focusArea: 'FocusArea',
      fundingSources: 'FundingSources',
      notes: 'Notes',
      founder: 'Founder',
      organisationType: 'OrganisationTypes'
    };

    itemsNotFormatted = tableData;

    var itemsFormatted = [];

    // format the data
    itemsNotFormatted.forEach(item => {
      if (selectedItems.includes(item.organisationName)) {
        itemsFormatted.push({
          organisationName: item.organisationName.replace(/,/g, ''),
          thematicPillars: item.thematicPillars.replace(/,/g, ''),
          subThemes: item.subThemes.replace(/,/g, ''),
          partnership: item.partnership.replace(/,/g, ''),
          location: item.location.replace(/,/g, ''),
          beneficiaryCount: item.beneficiaryCount,
          amountInvested: item.amountInvested,
          beneficiaryService: item.beneficiaryService.replace(/,/g, ''),
          duration: item.duration.replace(/,/g, ''),
          focusArea: item.focusArea.replace(/,/g, ''),
          fundingSources: item.fundingSources.replace(/,/g, ''),
          notes: item.notes.replace(/,/g, ''),
          founder: item.founder.replace(/,/g, ''),
          organisationType: item.organisationType.replace(/,/g, '')
        });
      }
    });

    var fileTitle = 'StakeholderDirectoryListing';
    exportCSVFile(headers, itemsFormatted, fileTitle);
  }

  let selectedItems = [];

  $(document).ready(function() {
    $('input[type="checkbox"]').click(function() {
      if ($(this).is(':checked')) {
        var strinn = $(this).attr('data-org');
        selectedItems.push(strinn.replace(/-/g, ' '));
      } else if ($(this).is(':not(:checked)')) {
        return null
      }
    });
  });

  $('#export').click(function() {
    if (selectedItems.length === 0) {
      return null;
    } else {
      download(selectedItems);
      selectedItems.length = 0;
      $('input[name="aaaaa"]').each(function() {
        this.checked = false;
      });
    }
  });

  $('td').ready(function() {
    var row_index = 0;
    $('.focusTable').ready(function() {
      var elementList = $('.focusTable');
      for (var i = 0; i <= elementList.length; i++) {
        $(elementList[i]).attr('id', 'subtheme_data' + i);
        $(`#subtheme_data${row_index++}`)
          .mouseover(function(e) {
            var focus = $(this).html();
            var str1 = '';
            tableData.map(item => {
              if (item.subThemes == focus) {
                str1 = item.focusArea;
              }
            });
            $(
              '<div class="info_panel">' +
                '<h1 class="info-panel-item">' +
                'Focus Areas' +
                '</h1>' +
                "<div class='info-panel-item-data'>" +
                str1 +
                '</div>' +
                '</div>'
            ).appendTo('body');
          })
          .mouseleave(function() {
            $('.info_panel').remove();
          })
          .mousemove(function(e) {
            var mouseX = e.pageX,
              mouseY = e.pageY;

            $('.info_panel').css({
              top: mouseY - 50,
              left: mouseX - $('.info_panel').width() / 2
            });
          });
      }
    });
  });
});
