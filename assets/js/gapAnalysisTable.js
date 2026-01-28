let url = 'partials/gap-analysis-table.html';
let gapReport = [];
const focusAreaGaps = [];

const keys = ['pillar', 'subtheme', 'LgasWithGaps', 'focusAreasWithGapsCount'];

let table = 'gapAnalysis';
let gapPaginator;

let selectedItems = [];

let entriesPerPage = 10;

function loadGapAnalysisTable(gapPaginator) {
  gapPaginator.potentialPartnershipsTable = true;
  const gapAnalysisTableData = gapPaginator.initialPage();

  // Table Filter Header Instance
  const filterTableColumnHeaders = [
    'pillar',
    'subtheme',
    'LgasWithGaps',
    'focusAreasWithGapsCount'
  ];

  const filterDropdownOptionsParentSelectors = [
    '#thematic_data',
    '#subtheme_data',
    '#lga_gap_data',
    '#gap_count_data'
  ];

  let columnKeysMap = new Map();
  filterTableColumnHeaders.forEach(columnHeader => {
    let currentColumnEntriesSet = new Set();
    for (
      let tableRowIndex = 0;
      tableRowIndex < gapReport.length;
      tableRowIndex++
    ) {
      currentColumnEntriesSet.add(gapReport[tableRowIndex][columnHeader]);
    }
    columnKeysMap.set(columnHeader, currentColumnEntriesSet);
  });

  // Create html string message displayed when the table filter has no results
  const noFilterResultsHtmlMessage = `
        <main class="table-row body">
          <h6 >
            <b>No Gap Analysis Results found for the selected column filters.</b>
           </h6>
        </main>`;

  $('#gap-analysis-data').html(gapAnalysisTableData);
  $('#gap-analysis-table-mobile').html(gapAnalysisTableData);
  let n = 5;
  let options = '';
  while (n < 51) {
    if (n === 10) {
      options += `<div class="selected">${n} </div>\n`;
    } else {
      options += `<div class="selected">${n} </div>\n`;
    }
    n += 5;
  }
  $('.gap-analysis-dropdown-trigger').dropdown();
  $('#gap-analysis-entries-per-page').html(options);

  $('.selected').click(function() {
    const text = $(this).text();
    $('#gap-analysis-row-number').text(text);
    gapPaginator.entriesPerPage = $('#gap-analysis-row-number').text();
    gapPaginator.refreshTableBody();
  });
  $('#gap-next-page').click(function() {
    gapPaginator.nextPage();
  });
  $('#gap-previous-page').click(function() {
    gapPaginator.previousPage();
  });
  bindGapAnalysisModalJQuery(focusAreaGaps);
  window.focusAreaGaps = focusAreaGaps;

  if(!window.gapAnalysisTableFilterHeader){
    // Create an instance of the TableFilterHeader class for the potential partnerships table
    window.gapAnalysisTableFilterHeader = new TableFilterHeader(
      table,
      gapReport,
      filterTableColumnHeaders,
      filterDropdownOptionsParentSelectors,
      {
        filterIconSelector: '.gap-analysis-filter-icon',
        filterCheckboxItemSelector:
          'input[type="checkbox"].gap-analysis-filter-checkbox',
        filterCheckboxItemClass: 'gap-analysis-filter-checkbox',
        filterCountSpanClass:'active-column-filters-count',
        filterCountIconCustomClassesArray: [
          'gap-thematic-pillar-filter-count',
          'gap-sub-theme-filter-count',
          'gap-lga-with-gaps-filter-count',
          'gap-focus-area-gaps-filter-count'
        ],
        applyFiltersButtonSelector: '.gap-analysis-table-apply-filter',
        clearFiltersButtonSelector: '.gap-analysis-table-clear-filter',
        filterIconSiblingSelector: '.table-filter-container',
        filterDropdownSubnavSelector: '.gap_analysis_table_filter_subnav',
        itemSpanClass: '.ga-table-filter-item',
      },
      columnKeysMap,
      {
        tablePaginator: gapPaginator,
        tableRootElementSelector: '#gap-analysis-data'
      },
      noFilterResultsHtmlMessage,
      {
        bindModalEventListener: bindGapAnalysisModalJQuery,
        currentTableModalData: focusAreaGaps
      }
    );
  }
}

$(document).ready(async function() {
  const queryNameFromUrl = window.location.search.substring(1).split('=')[1];

  const gapAnalysisReportData = await fetch(
    `${MMDP_BASE_URL}/api/v1/gapAnalysis/${queryNameFromUrl}`
  );
  const data = await gapAnalysisReportData.json();

  $('#gap-analysis-table-container').on(
    'click',
    'input[type="checkbox"].check, input[type="checkbox"].check-all',
    function() {
      if ($(this).is(':checked') && $(this).attr('data-org') !== 'check-all') {
        var strinn = $(this).attr('data-org');
        strinn && selectedItems.push(strinn.replace(/-/g, ' '));
      } else if (
        $(this).is(':checked') &&
        $(this).attr('data-org') === 'check-all'
      ) {
        $('input[name="aaaaa"]').each(function() {
          var strinn = this.id;
          selectedItems.push(strinn.replace(/-/g, ' '));
          this.checked = true;
        });
      } else if (
        $(this).is(':not(:checked)') &&
        $(this).attr('data-org') !== 'check-all'
      ) {
        var strinn = $(this).attr('data-org');
        var filtered = selectedItems.filter(function(value, index, arr) {
          return value !== strinn.replace(/-/g, ' ');
        });
        selectedItems.splice(0, selectedItems.length, ...filtered);
        $('#check-all').prop('checked', false);
      } else if (
        $(this).is(':not(:checked)') &&
        $(this).attr('data-org') === 'check-all'
      ) {
        $('input[name="aaaaa"]').each(function() {
          this.checked = false;
        });
        selectedItems.length = 0;
      }
    }
  );

  $('#gap-analysis-table-container').on('click', '.moreLess', function() {
    const thisElement = $(this);
    const truncate = thisElement.closest('.truncate-text');
    const truncateText = '.truncate-text';
    if (thisElement.hasClass('less')) {
      truncate.prev(truncateText).toggle();
      truncate.hide();
    } else {
      truncate.toggle();
      truncate.next(truncateText).toggle();
    }
    return false;
  });

  for (const report of data.report) {
    for (const item of report.data) {
      if (item.AllLgasWithGaps.length !== 0) {
        const row = {};
        const modalRow = {};
        let pillarObject = {};
        let focusAreaWithGaps = [];

        for (const focusArea of item.focusAreas) {
          if (typeof focusArea === 'object') {
            if (focusArea.lgasWithGaps.length !== 0) {
              focusAreaWithGaps.push(focusArea.focusArea);
            }
          } else {
            focusAreaWithGaps.push(focusArea);
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
        };
        gapReport.push(row);
        focusAreaGaps.push(pillarObject);
      }
    }
  }

  $('#gap-analysis-table').load(url, function() {
    window.gapTableData = gapReport;
    gapPaginator = new Paginator(
      gapReport,
      keys,
      table,
      selectedItems,
      entriesPerPage
    );
  });
});
