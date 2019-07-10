const bindJQuery = (table) => {
  $(document).ready(async function() {
    if (table === 'gapAnalysis') {
      tableData = [...window.gapTableData];
    } else {
      tableData = [...window.tableData];
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
      if (table === 'gapAnalysis') {
        var headers = {
          thematicPillar: 'ThematicPillar',
          subTheme: 'SubTheme',
          lgasWithGaps: 'LGAsWithGaps',
          numberOfFocusAreasWithGaps: 'NumberOfFocusAreasWithGaps',
        };
      } else {
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
      }
      
      itemsNotFormatted = tableData;
  
      var itemsFormatted = [];

      let fileTitle = ''
  
      // format the data
      itemsNotFormatted.forEach(item => {
        if (table === 'gapAnalysis') {
          if (selectedItems.includes('all')) {
            itemsFormatted.push({
              thematicPillar: item.pillar.replace(/,/g, ''),
              subTheme: item.subtheme.replace(/,/g, ''),
              lgasWithGaps: item.LgasWithGaps.replace(/,/g, ''),
              numberOfFocusAreasWithGaps: item.focusAreasWithGapsCount.toString().replace(/,/g, '')
            });
          } else if (selectedItems.includes(item.subtheme.replace(/ /g, ''))) {
            itemsFormatted.push({
              thematicPillar: item.pillar.replace(/,/g, ''),
              subTheme: item.subtheme.replace(/,/g, ''),
              lgasWithGaps: item.LgasWithGaps.replace(/,/g, ''),
              numberOfFocusAreasWithGaps: item.focusAreasWithGapsCount.toString().replace(/,/g, '')
            });
          }
          fileTitle = 'gapAnalysisReport';
        } else {
          if (selectedItems.includes('all')) {
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
          } else if (selectedItems.includes(item.organisationName.replace(/ /g, ''))) {
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
          fileTitle = 'StakeholderDirectoryListing';
        }
      });
      // (itemsFormatted)
      exportCSVFile(headers, itemsFormatted, fileTitle);
    }
  
    let selectedItems = [];

    let all = [];

    let gAll = document.getElementById('check-all');
    let sAll = document.getElementById('check-all-stakeholder');
    
    all.push(gAll);
    all.push(sAll);

    for (const item of all){
      if (item === null) {
        continue;
      } else {
        item.onclick = function () {
          if ($(this).is(':checked')) {
            $('input[name="aaaaa"]').each(function() {
              this.checked = true;
            });
            selectedItems.push('all')  
          } else if ($(this).is(':not(:checked)')) {
            $('input[name="aaaaa"]').each(function() {
              this.checked = false;
              selectedItems.pop('all');
            });
          }
        }
      }
    }

    $('input[type="checkbox"]').click(function() {
      if ($(this).is(':checked') && $(this).attr('data-org') !== 'check-all') {
        var strinn = $(this).attr('data-org');
        selectedItems.push(strinn.replace(/-/g, ' '));
      } else if ($(this).is(':not(:checked)')) {
        return null
      }
    });
    
  
    $('#gap-export, #export').on('click', function() {
      if (selectedItems.length === 0) {
        return null;
      } else {
        download(selectedItems);
        selectedItems.length = 0;
        $('input[name="aaaaa"]').each(function() {
          this.checked = false;
        });
        $('#check-all, #check-all-stakeholder').prop('checked', false);
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
}
