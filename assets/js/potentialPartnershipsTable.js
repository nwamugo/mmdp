let partnershipTableData;
let stakeholderServicesArray;

/**
 *@description Method that shows the number of filtered options on the partnership/collaboration table header
  @params : columnHeaderOptionsCount
  @returns : undefined*/
function setFilteredOptionsCountOnPartnershipTable(columnHeaderOptionsCount) {
  let thematicPillar = $('#thematicPillar').attr('id');
  let subTheme = $('#subTheme').attr('id');
  let lga = $('#lga').attr('id');
  let organizationName = $('#organizationName').attr('id');
  for (let item in columnHeaderOptionsCount) {
    if (columnHeaderOptionsCount[item] !== 0) {
      if (item === thematicPillar) {
        $(
          '<span class="selected-options-count selected-thematic-pillars">' +
            columnHeaderOptionsCount[item] +
            '</span>'
        ).appendTo('#selectedThematicPillarsCount');
      } else if (item === subTheme) {
        $(
          '<span class="selected-options-count selected-sub-themes">' +
            columnHeaderOptionsCount[item] +
            '</span>'
        ).appendTo('#selectedSubThemesCount');
      } else if (item === lga) {
        $(
          '<span class="selected-options-count selected-lgas">' +
            columnHeaderOptionsCount[item] +
            '</span>'
        ).appendTo('#selectedLgasCount');
      } else if (item === organizationName) {
        $(
          '<span class="selected-options-count selected-organizations">' +
            columnHeaderOptionsCount[item] +
            '</span>'
        ).appendTo('#selectedOrganizationsCount');
      }
    }
  }
}

/**
 *@description Method that removes each of the filtered options count depending on the clicked button
  @params : targetButton
  @returns : undefined*/
function removeEachFilteredOptionsCountOnPartnershipTable(targetButton) {
  if (targetButton === 'clearThematicPillars') {
    $('.header-row')
      .find('.selected-thematic-pillars')
      .remove();
  } else if (targetButton === 'clearSubThemes') {
    $('.header-row')
      .find('.selected-sub-themes')
      .remove();
  } else if (targetButton === 'clearLgas') {
    $('.header-row')
      .find('.selected-lgas')
      .remove();
  } else if (targetButton === 'clearOrganizations') {
    $('.header-row')
      .find('.selected-organizations')
      .remove();
  }
}
/**
 *@description Do some clean up: Method that removes all the filtered options count collectively on the partnership/collaboration table header
  @params : none
  @returns : undefined*/
function removeAllFilteredOptionsCountOnPartnershipTable() {
  $('.header-row')
    .find('.selected-options-count')
    .remove();
}

function createPotentialPartnershipsTable(tableData, stakeholderServicesArray) {
  const keys = [
    'thematicPillar',
    'focusArea',
    'subTheme',
    'lga',
    'organizationName',
    '_id'
  ];

  let selectedItems = [];

  $('#potential-partnerships-table-container').on(
    'click',
    'input[type="checkbox"].check, input[type="checkbox"].check-all',
    function() {
      if (
        $(this).is(':checked') &&
        $(this).attr('data-org') !== 'check-all-items'
      ) {
        var strinn = $(this).attr('data-org');
        selectedItems.push(strinn.replace(/-/g, ' '));
      } else if (
        $(this).is(':checked') &&
        $(this).attr('data-org') === 'check-all-items'
      ) {
        $('input[name="collaboration"]').each(function() {
          var strinn = $(this).attr('data-org');
          selectedItems.push(strinn.replace(/-/g, ' '));
          this.checked = true;
        });
      } else if (
        $(this).is(':not(:checked)') &&
        $(this).attr('data-org') !== 'check-all-items'
      ) {
        var strinn = $(this).attr('data-org');
        var filtered = selectedItems.filter(function(value, index, arr) {
          return value !== strinn.replace(/-/g, ' ');
        });
        selectedItems.splice(0, selectedItems.length, ...filtered);

        $('#partnerships-check-all').prop('checked', false);
      } else if (
        $(this).is(':not(:checked)') &&
        $(this).attr('data-org') === 'check-all-items'
      ) {
        $('input[name="collaboration"]').each(function() {
          this.checked = false;
        });
        selectedItems.length = 0;
      }
    }
  );
  let table = 'potentialPartnerships';
  window.table = table;
  let entriesPerPage = 10;

  const paginator = new Paginator(
    tableData,
    keys,
    table,
    selectedItems,
    entriesPerPage
  );
  paginator.potentialPartnershipsTable = true;

  const potentialPartnershipsTableData = paginator.initialPage();

  $('#partnership-report-data').html(potentialPartnershipsTableData);
  $('#partnership-table-mobile').html(potentialPartnershipsTableData);

  // NOTE: Please note the order of the filterTableColumnKeys array
  //    should match the order for your table columns from left to right
  //    the filterDropdownOptionsParentSelectors should then follow the same order array

  const filterTableColumnKeys = [
    'thematicPillar',
    'subTheme',
    'lga',
    'organizationName'
  ];

  const filterDropdownOptionsParentSelectors = [
    '#thematicPillarFilterData',
    '#subThemeFilterData',
    '#lgaFilterData',
    '#organizationNameFilterData'
  ];

  let columnKeysMap = new Map();
  filterTableColumnKeys.map(columnKey => {
    let currentColumnEntriesSet = new Set();
    for (
      let tableRowIndex = 0;
      tableRowIndex < tableData.length;
      tableRowIndex++
    ) {
      currentColumnEntriesSet.add(tableData[tableRowIndex][columnKey]);
    }
    columnKeysMap.set(columnKey, currentColumnEntriesSet);
  });

  let n = 5;
  let options = '';
  while (n < 51) {
    if (n === 10) {
      options += `<div class="selected">${n}</div>\n`;
    } else {
      options += `<div class="selected">${n}</div >\n`;
    }
    n += 5;
  }
  $('.partnership-dropdown-trigger').dropdown();
  $('#partnership-entries-per-page').html(options);

  $('.selected').click(function() {
    const text = $(this).text();
    $('#partnership-row-number').text(text);
    paginator.entriesPerPage = $('#partnership-row-number').text();
    paginator.refreshTableBody();
  });
  $('#potential-next-page').click(function() {
    paginator.nextPage();
  });
  $('#potential-previous-page').click(function() {
    paginator.previousPage();
  });
  const potentialPartnershipsModalData = getPartnershipDetailsByFocusArea(
    stakeholderServicesArray
  );
  bindPotentialPartnershipModalJQuery(potentialPartnershipsModalData);
  window.potentialPartnershipsModalData = potentialPartnershipsModalData;

  // Create html string message displayed when the table filter has no results
  const noFilterResultsHtmlMessage = `
  <main id="table" class="table-row body">
    <h6 class="partnership-row">
      <b>No Results found for the selected column filters.</b>
    </h6>
  </main>`;

  if(!window.partnershipsTableHeaderFilter){
    // Create an instance of the TableFilterHeader class for the potential partnerships table
    window.partnershipsTableHeaderFilter = new TableFilterHeader(
      table,
      'partnership-dropdown-icon',
      tableData,
      filterTableColumnKeys,
      filterDropdownOptionsParentSelectors,
      {
        filterIconSelector: '.partnership-filter-icon',
        filterCheckboxItemSelector: 'input[type="checkbox"].partnership-filter-checkbox',
        filterCheckboxItemClass: 'partnership-filter-checkbox',
        applyFiltersButtonSelector: '.partnership-table-apply-filter',
        clearFiltersButtonSelector: '.partnership-table-clear-filter',
        filterIconSiblingSelector: '.table-filter-container',
        filterDropdownSubnavSelector:'.partner_table_filter_subnav',
      },
      columnKeysMap,
      {
        'tablePaginator': paginator,
        'tableRootElementSelector': '#partnership-report-data' ,
      },
      noFilterResultsHtmlMessage,
      {
        'bindModalEventListener': bindPotentialPartnershipModalJQuery,
        'currentTableModalData': potentialPartnershipsModalData,
      }
    );
  }

  
}

$(document).ready(async function() {
  const dataForTable = await getPartnershipData();
  const queryNameFromUrl = window.location.search.substring(1).split('=')[1];
  const queryParam = queryNameFromUrl
    ? queryNameFromUrl.charAt(0).toUpperCase() + queryNameFromUrl.slice(1)
    : 'Nigeria';
  const stakeholderData = await fetch(
    `${MMDP_BASE_URL}/api/v1/location?state=${queryParam}&focusAreaName`
  );
  const data = await stakeholderData.json();

  $('#potential-partnerships-table').load(
    '/partials/potential-partnerships-table.html',
    function() {
      let arr = getLgas(data);
      stakeholderServicesArray= getStakeholderServicesArray([
        data.filteredStakeholders
      ]);

      window.partnershipsCsvTableData = dataForTable;
      // add id for row to each item in this map of potential partnerships
      let potentialPartners = potentialPartnershipsByLga(arr);
      partnershipTableData = potentialPartners.map(item => {
        item['ppRowId'] = getPotentialPartnershipRowId(
          item.lga,
          item.subThemeId,
          item.focusAreaId,
          stakeholderServicesArray
        );
        return item;
      });
      createPotentialPartnershipsTable(partnershipTableData, stakeholderServicesArray);

    }
  );
});
