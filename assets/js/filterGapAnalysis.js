// load full table
function loadGapTable(data) {
  window.gapTableData = data;
  let rowsPerPage = $('#gap-analysis-row-number').text();
  paginator = new Paginator(data, keys, table, selectedItems, rowsPerPage);
  // Clear any active gap analysis column filter headers that have been applied
  window.gapAnalysisTableFilterHeader ? window.gapAnalysisTableFilterHeader.clearAllFilters() : undefined;
  loadGapAnalysisTable(paginator);
}

let noData = [];

$(document).ready(async function() {
  // load filtered data
  function loadFilteredTable(tableData) {
    const searchValue = $('#search__activities__gap').val();
    const search = searchValue.replace(/\s+/g, ' ');
    // Clear any active gap analysis column filter headers that have been applied
    window.gapAnalysisTableFilterHeader ? window.gapAnalysisTableFilterHeader.clearAllFilters() : undefined;
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
      $('#gap_message').css({ display: 'block' });
      loadGapTable(noData);
    } else {
      loadGapTable(filteredData);
    }
  }

  // search on click
  $('#btn_search_gap').click(function() {
    $('#gap_message').css({ display: 'none' });
    loadFilteredTable(gapReport);
  });

  // search on enter
  $('#search__activities__gap').keypress(function(e) {
    var key = e.which;
    if (key == 13) {
      $('#gap_message').css({ display: 'none' });
      loadFilteredTable(gapReport);
    }
  });

  // load full table when search field is cleared
  $('#search__activities__gap').keyup(function() {
    if (
      $('#search__activities__gap')
        .val()
        .trim() === ''
    ) {
      $('#gap_message').css({ display: 'none' });
      loadGapTable(gapReport);
    }
  });
});
