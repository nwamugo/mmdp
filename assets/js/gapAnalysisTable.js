$(document).ready(async function() {
    const keys = [
        "pillar",
        "subtheme",
        "LgasWithGaps",
        "focusAreasWithGapsCount",
    ];

    const queryNameFromUrl = window.location.search.substring(1).split('=')[1];
  
    const gapAnalysisReportData = await fetch(
      `${MMDP_BASE_URL}/api/v1/gapAnalysis/${queryNameFromUrl}`
    );
    const data = await gapAnalysisReportData.json();

    let selectedItems = [];
    $('#gap-analysis-table').on('click', 'input[type="checkbox"]', function() {
      if ($(this).is(':checked') && $(this).attr('data-org') !== 'check-all') {
        var strinn = $(this).attr('data-org');
        selectedItems.push(strinn.replace(/-/g, ' '));
      } else if ($(this).is(':checked') && $(this).attr('data-org') === 'check-all') {
        $('input[name="aaaaa"]').each(function() {
          var strinn = this.id;
          selectedItems.push(strinn.replace(/-/g, ' '));
          this.checked = true;
        });
      } else if ($(this).is(':not(:checked)') && $(this).attr('data-org') !== 'check-all') {
        var strinn = $(this).attr('data-org');
        var filtered = selectedItems.filter(function(value, index, arr){
          return value !== strinn.replace(/-/g, ' ');
        });
        selectedItems.splice(0, selectedItems.length, ...filtered);
        $('#check-all').prop('checked', false);
      } else if ($(this).is(':not(:checked)') && $(this).attr('data-org') === 'check-all') {
        $('input[name="aaaaa"]').each(function() {
          this.checked = false;
        });
        selectedItems.length = 0;
      }
    })
  
    $('#gap-analysis-table').load(
      '/partials/gap-analysis-table.html',
      function() {
        let gapReport = [];
        const focusAreaGaps = [];

        for (const report of data.report){
            for (const item of report.data){
              if (item.AllLgasWithGaps.length !== 0) {
                const row = {};
                const modalRow = {};
                let pillarObject = {};
                let focusAreaWithGaps = [];

                for (const focusArea of item.focusAreas) {
                  if (typeof(focusArea) === 'object') {
                    if (focusArea.lgasWithGaps.length !== 0) {
                        focusAreaWithGaps.push(focusArea.focusArea)
                        
                    }
                  } else {
                    focusAreaWithGaps.push(focusArea)
                  }
                }

                modalRow.focusArea = item.focusAreas;
                row.id = item.subThemeName;
                row.pillar = report.pillarName;
                row.subtheme = item.subThemeName;
                row.focusAreasWithGapsCount = item.focusAreasWithGapsCount;
                row.focusAreasWithGaps = focusAreaWithGaps;
                var lgas = item.AllLgasWithGaps;
                var LgasWithGaps = lgas.filter(Boolean);
                row.LgasWithGaps = LgasWithGaps.join(', ');
                modalRow.focusAreaCount = item.focusAreaCount;
                modalRow.pillarDescription = report.pillarDescription;
                
                  pillarObject = {
                    ...row,
                    ...modalRow
                  }
                gapReport.push(row);
                focusAreaGaps.push(pillarObject);
              }      
            }
        }
        let table = 'gapAnalysis';

        window.gapTableData = gapReport;

        const paginator = new Paginator(gapReport, keys, table, selectedItems);
        paginator.potentialPartnershipsTable = true;
        potentialPartnershipsTableData = paginator.initialPage();
  
        $('#gap-analysis-data').html(potentialPartnershipsTableData);
        $('#gap-analysis-table-mobile').html(potentialPartnershipsTableData);
        let n = 5;
        let options = '';
        while (n < 51) {
          if (n === 10) {
            options += `<div class="selected">${n}</div>\n`;
          } else {
            options += `<div class="selected">${n}</div>\n`;
          }
          n += 5;
        }
        $('.gap-analysis-dropdown-trigger').dropdown();
        $('#gap-analysis-entries-per-page').html(options);
        
        $('.selected').click(function() {
          const text = $(this).text();
          $('#gap-analysis-row-number').text(text);
          paginator.entriesPerPage = $('#gap-analysis-row-number').text();
          paginator.refreshTableBody();
        });
        $('#gap-next-page').click(function() {
          paginator.nextPage();
        });
        $('#gap-previous-page').click(function() {
          paginator.previousPage();
        });
        bindGapAnalysisModalJQuery(focusAreaGaps);
        window.focusAreaGaps = focusAreaGaps;
      }
    );
  });
