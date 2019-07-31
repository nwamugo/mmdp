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

  $('#potential-partnerships-table').on(
    'click',
    'input[type="checkbox"]',
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
  let entriesPerPage = 10;

  const paginator = new Paginator(tableData, keys, table, selectedItems, entriesPerPage);
  paginator.potentialPartnershipsTable = true;
  potentialPartnershipsTableData = paginator.initialPage();

  $('#partnership-report-data').html(potentialPartnershipsTableData);
  $('#partnership-table-mobile').html(potentialPartnershipsTableData);
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
      let stakeholderServicesArray = getStakeholderServicesArray([
        data.filteredStakeholders
      ]);

      window.partnershipsCsvTableData = dataForTable;
      // add id for row to each item in this map of potential partnerships
      let potentialPartners = potentialPartnershipsByLga(arr);
      const tableData = potentialPartners.map(item => {
        item['ppRowId'] = getPotentialPartnershipRowId(
          item.lga,
          item.subThemeId,
          item.focusAreaId,
          stakeholderServicesArray
        );
        return item;
      });
      createPotentialPartnershipsTable(tableData, stakeholderServicesArray);
    }
  );
});
