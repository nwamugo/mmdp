$(document).ready(async function() {
  const keys = [
    'organisationName',
    'thematicPillars',
    'subThemes',
    'partnership',
    'location',
    'beneficiaryCount',
    'amountInvested'
  ];

  const queryNameFromUrl = window.location.search.substring(1).split('=')[1];
  const queryParam = queryNameFromUrl ?
    queryNameFromUrl.charAt(0).toUpperCase() + queryNameFromUrl.slice(1) : 'Nigeria';
  let queryURL;
  switch (window.location.pathname) {
    case '/country.html':
      query = `country=${queryParam}`;
      break;
    case '/state.html':
      query = `state=${queryParam}`;
      break;
    case '/lga.html':
      query = `lga=${queryParam}`;
      break;
    default:
      query = `country=${queryParam}`;
      break;
  }

  const stakeholderData = await fetch(
    `http://0.0.0.0:3000/api/v1/location?${query}`
  );
  const data = await stakeholderData.json();
  // neededData
  const tableData = handleStakeholdersData(data.data);

  const paginator = new Paginator(tableData, keys);

  $('#stakeholder-directory-table').load(
    '/partials/stakeholder-directory-table.html',
    function() {
      paginator.initialPage();
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
      $('.modal').modal();

      async function getSHDetails(stakeholderName) {
        const response = await fetch(
          `http://0.0.0.0:3000/api/v1/stakeholders-directory?organisationName=${stakeholderName}`
        );
        $('.modal h5')
          .html(`<div>${stakeholderName} <a href="#!" class="modal-close waves-effect waves-green btn-flat"
        >X</a></div><hr class="sh-hr">`);
        const stakeholderDataJson = await response.json();
        const stakeholderData = stakeholderDataJson.data[0];
        const beneficiaryData = handleBeneficiaries(
          stakeholderData.beneficiaries
        );
        const requiredDetails = {
          'Year of Registration': stakeholderData.yearOfCacREG,
          'RC Number': stakeholderData.cacRcNumber,
          Category: stakeholderData.organisationTypeId.typeName,
          'Founder Name': stakeholderData.founder,
          "Founder's Phone Number": stakeholderData.phoneNumber,
          Location: stakeholderData.adresses[0].address,
          'Thematic Pillar (s)': beneficiaryData.thematicPillars,
          'Sub Theme (s)': beneficiaryData.subThemes,
          'Focus Area (s)': beneficiaryData.focusArea,
          'Service (s)': beneficiaryData.beneficiaryService,
          'Source (s) of Funding': beneficiaryData.fundingSources,
          'Amount Invested till date': beneficiaryData.amountInvested,
          'Local Communities': beneficiaryData.localCommunities,
          'LGA of Operation': beneficiaryData.lgas,
          'Partners (Local and International)': [
            ...new Set(
              stakeholderData.partnerships.map(
                partner => partner.stakeholder2Id.organisationName
              )
            )
          ].join(', '),
          'Gender distribution of beneficiaries (in percentage) Male % Female%': `male: ${
            beneficiaryData.malePercent
          }%, female: ${beneficiaryData.femalePercent}%`,
          'Total Number of Beneficiary':
            beneficiaryData.totalNumberOfBeneficiaries,
          'Beneficiary Type': beneficiaryData.beneficiaryTypes,
          'Target Audience (s)': beneficiaryData.targetAudience,
          'Number of Staff': stakeholderData.staffStrengthRangeId
            ? stakeholderData.staffStrengthRangeId.staffStrength
            : '',
          'Number of Volunteers': stakeholderData.volunteersCount
        };
        let shDetailsTableData = '';
        const keys = Object.keys(requiredDetails);
        while (keys.length > 0) {
          const rowKeys = keys.splice(0, 3);
          const newRow = `
          <tr>
              <td>
                <div class="row__title">${rowKeys[0]}</div>
                <div class="row__value">${requiredDetails[rowKeys[0]] ||
                  '-'}</div>
              </td>
              <td>
                <div class="row__title">${rowKeys[1]}</div>
                <div class="row__value">${requiredDetails[rowKeys[1]] ||
                  '-'}</div>
              </td>
              <td>
                <div class="row__title">${rowKeys[2]}</div>
                <div class="row__value">${requiredDetails[rowKeys[2]] ||
                  '-'}</div>
              </td>
          </tr>
          `;
          shDetailsTableData += newRow;
        }
        $('.stakeholder__details__table tbody').html(shDetailsTableData);
      }
      window.getSHDetails = getSHDetails;
    }
  );
});
