$(document).ready(async function() {
  // load filtered data
  function loadFilteredTable(partnershipTableData) {
    const searchValue = $('#search__activities__partnership').val();
    const search = searchValue.replace(/\s+/g, ' ');
    const filteredPartnerData = partnershipTableData.filter(
      partnershipRow =>
        partnershipRow.thematicPillar
          .trim()
          .toLowerCase()
          .includes(
            search
              .toString()
              .trim()
              .toLowerCase()
          ) ||
        partnershipRow.subTheme.trim()
          .toLowerCase()
          .includes(
            search
              .toString()
              .trim()
              .toLowerCase()
          ) ||
        partnershipRow.lga
          .toString()
          .trim()
          .toLowerCase()
          .includes(
            search
              .toString()
              .trim()
              .toLowerCase()
          ) ||
        partnershipRow.organizationName
          .trim()
          .toLowerCase()
          .includes(
            search
              .toString()
              .trim()
              .toLowerCase()
          ) ||
        partnershipRow.focusArea
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
    if (!filteredPartnerData || filteredPartnerData.length === 0) { 
      $('#partner_message').css({ display: 'block' });
      createPotentialPartnershipsTable(noData)
    } else {
      createPotentialPartnershipsTable(filteredPartnerData, stakeholderServicesArray);
    }
  }

  // search on click
  $('#btn_search_partner').click(function() {
    $('#partner_message').css({ display: 'none' });
    loadFilteredTable(partnershipTableData);
  });

  // search on enter
  $('#search__activities__partnership').keypress(function(e) {
    var key = e.which;
    if (key == 13) {
      $('#partner_message').css({ display: 'none' });
      loadFilteredTable(partnershipTableData);
    }
  });

  // load full table when search field is cleared
  $('#search__activities__partnership').keyup(function() {
    if (
      $('#search__activities__partnership')
        .val()
        .trim() === ''
    ) {
      $('#partner_message').css({ display: 'none' });
      createPotentialPartnershipsTable(partnershipTableData, stakeholderServicesArray);
    }
  });
});
