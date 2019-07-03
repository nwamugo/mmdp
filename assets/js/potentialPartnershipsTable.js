$(document).ready(async function() {
  const keys = [
    'thematicPillar',
    'focusArea',
    'subTheme',
    'lga',
    'organizationName',
    '_id'
  ];

  const queryNameFromUrl = window.location.search.substring(1).split('=')[1];
  const queryParam = queryNameFromUrl
    ? queryNameFromUrl.charAt(0).toUpperCase() + queryNameFromUrl.slice(1)
    : 'Nigeria';
  const stakeholderData = await fetch(
    `${MMDP_BASE_URL}/api/v1/location?state=${queryParam}&focusAreaName`
  );
  const data = await stakeholderData.json();

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

  $('#potential-partnerships-table').load(
    '/partials/potential-partnerships-table.html',
    function() {
      let arr = getLgas(data);
      let potentialPartners = potentialPartnershipsByLga(arr);
      const tableData = potentialPartners.map(item => {
        return item;
      });

      let table = 'potentialPartnerships';
      window.partnershipsCsvTableData = tableData;
      const paginator = new Paginator(tableData, keys, table, selectedItems);
      paginator.potentialPartnershipsTable = true;
      potentialPartnershipsTableData = paginator.initialPage();

      $('#partnership-report-data').html(potentialPartnershipsTableData);
      $('#partnership-table-mobile').html(potentialPartnershipsTableData);
      let n = 5;
      let options = '';
      while (n < 51) {
        if (n === 10) {
          options += `<option selected>${n}</option>\n`;
        } else {
          options += `<option>${n}</option>\n`;
        }
        n += 5;
      }
      $('select#entries-per-page').html(options);
      $('select#entries-per-page').change(function() {
        paginator.entriesPerPage = this.value;
        paginator.refreshTableBody();
      });
      $('#potential-next-page').click(function() {
        paginator.nextPage();
      });
      $('#potential-previous-page').click(function() {
        paginator.previousPage();
      });
    }
  );
});
