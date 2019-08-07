function visibility(elem) {
  return !!(
    elem.offsetWidth ||
    elem.offsetHeight ||
    elem.getClientRects().length
  );
}

// load full table
function loadTable(data) {
  window.gapTableData = data;
  let rowsPerPage = $('#gap-analysis-row-number').text();
  paginator = new Paginator(data, keys, table, selectedItems, rowsPerPage);
  loadGapAnalysisTable(paginator);
}

function filterGapAnalysisTable() {
  var targetElement = document.getElementById('gap-analysis-report-table');
  if (!targetElement) {
    //The node we need does not exist yet.
    //Wait 1000ms and try again
    window.setTimeout(filterGapAnalysisTable, 1000);
    return;
  }
  let hidden = visibility(targetElement);

  let noData = [];

  var observer = new MutationObserver(function() {
    if (!hidden) {
      $(document).ready(async function() {
        // load filtered data
        function loadFilteredTable(tableData) {
          const searchValue = $('#search__activities').val();
          const search = searchValue.replace(/\s+/g, ' ');
          const filteredData = tableData.filter(
            gapRow =>
              gapRow.subtheme
                .trim()
                .toLowerCase()
                .includes(
                  search
                    .toString()
                    .trim()
                    .toLowerCase()
                ) ||
              gapRow.LgasWithGaps.trim()
                .toLowerCase()
                .includes(
                  search
                    .toString()
                    .trim()
                    .toLowerCase()
                ) ||
              gapRow.focusAreasWithGapsCount
                .toString()
                .trim()
                .toLowerCase()
                .includes(
                  search
                    .toString()
                    .trim()
                    .toLowerCase()
                ) ||
              gapRow.pillar
                .trim()
                .toLowerCase()
                .includes(
                  search
                    .toString()
                    .trim()
                    .toLowerCase()
                ) ||
              gapRow.focusAreasWithGaps
                .toString()
                .trim()
                .toLowerCase()
                .includes(
                  search
                    .toString()
                    .trim()
                    .toLowerCase()
                )
          );
          if (!filteredData || filteredData.length === 0) {
            if ($('#gap-analysis-report-table').is(':visible')) {
              $('#gap_message').css({ display: 'block' });
            }
            loadTable(noData);
          } else {
            loadTable(filteredData);
          }
        }

        // search on click
        $('#btn_search').click(function() {
          $('#gap_message').css({ display: 'none' });
          loadFilteredTable(gapReport);
        });

        // search on enter
        $('#search__activities').keypress(function(e) {
          var key = e.which;
          if (key == 13) {
            $('#gap_message').css({ display: 'none' });
            loadFilteredTable(gapReport);
          }
        });

        // load full table when search field is cleared
        $('#search__activities').keyup(function() {
          if (
            $('#search__activities')
              .val()
              .trim() === ''
          ) {
            $('#gap_message').css({ display: 'none' });
            loadTable(gapReport);
          }
        });
      });
    }
  });

  observer.observe(targetElement, { attributes: true, childList: true });
}

filterGapAnalysisTable();
