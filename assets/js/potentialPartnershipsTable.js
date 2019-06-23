$(document).ready(async function() {
  const keys = ['thematicPillar', 'subTheme', 'lga', 'organizationName'];

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
      let potentialPartners = potentialPartnershipsByLga(arr);
      const tableData = potentialPartners.map(item => {
        return item[0];
      });

      let table = 'potential partnerships';

      const paginator = new Paginator(tableData, keys, table);
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
      $('#next-page').click(function() {
        paginator.nextPage();
      });
      $('#previous-page').click(function() {
        paginator.previousPage();
      });
    }
  );
});
