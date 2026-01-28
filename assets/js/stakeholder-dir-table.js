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
  const queryParam = queryNameFromUrl
    ? queryNameFromUrl.charAt(0).toUpperCase() + queryNameFromUrl.slice(1)
    : 'Nigeria';
  let query, param;
  switch (window.location.pathname) {
    case '/country.html':
      param = 'country';
      query = `country=${queryParam}`;
      break;
    case '/state.html':
      query = `state=${queryParam}`;
      break;
    case '/state-pillars.html':
      query = `state=${queryParam}`;
      break;
    case '/state-report.html':
      query = `state=${queryParam}`;
      break;
    case '/lga.html':
      param = 'lga';
      query = `lga=${queryParam}`;
      break;
    case '/active-communities.html':
      query = `lga=${queryParam}`;
      break;
    case '/state-pillars.html':
      query = `state=${queryParam}`;
      break;
    default:
      param = 'country';
      query = `country=${queryParam}`;
      break;
  }
  const stakeholderData = await fetch(
    `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName`
  );
  const data = await stakeholderData.json();

  // neededData
  const tableData = handleStakeholdersData(data.filteredStakeholders);

  tableData.sort((a, b) => (a.thematicPillars > b.thematicPillars) ? 1 : (a.thematicPillars === b.thematicPillars) ? ((a.organisationName > b.organisationName) ? 1 : -1) : -1);
  window.tableData = tableData;
  table = 'stakeholder';

  keys[4] = param === 'country' ? 'stateLocation' : keys[4];
  let selectedItems = [];

  let entriesPerPage = 10;

  $('#stakeholder-directory-table').on(
    'click',
    'input[type="checkbox"]',
    function() {
      if (
        $(this).is(':checked') &&
        $(this).attr('data-org') !== 'check-all-stakeholder'
      ) {
        var strinn = $(this).attr('data-org');
        strinn && selectedItems.push(strinn.replace(/-/g, ' '));
      } else if (
        $(this).is(':checked') &&
        $(this).attr('data-org') === 'check-all-stakeholder'
      ) {
        $('input[name="aaaaa"]').each(function() {
          var strinn = this.id;
          selectedItems.push(strinn.replace(/-/g, ' '));
          this.checked = true;
        });
      } else if (
        $(this).is(':not(:checked)') &&
        $(this).attr('data-org') !== 'check-all-stakeholder'
      ) {
        var strinn = $(this).attr('data-org');
        var filtered = selectedItems.filter(function(value, index, arr) {
          return value !== strinn.replace(/-/g, ' ');
        });
        selectedItems.splice(0, selectedItems.length, ...filtered);
        $('#check-all-stakeholder').prop('checked', false);
      } else if (
        $(this).is(':not(:checked)') &&
        $(this).attr('data-org') === 'check-all-stakeholder'
      ) {
        $('input[name="aaaaa"]').each(function() {
          this.checked = false;
        });
        selectedItems.length = 0;
      }
    }
  );

  /**
   * @description - Search on pressing Enter
   */
  $('#search__activities').keypress(function(e) {
    var key = e.which;
    if (key == 13) {
      if (
        $('#search__activities')
          .val()
          .trim() === ''
      ) {
        loadStakeholderTable();
      } else {
        loadSearchStakeholderTable();
      }
    }
  });

  /**
   * @description - Search on search button click
   */
  $('#search_stakeholder').click(function() {
    if (
      $('#search__activities')
        .val()
        .trim() === ''
    ) {
      loadStakeholderTable();
    } else {
      loadSearchStakeholderTable();
    }
  });

  /**
   * @description - Load full table when search field is cleared
   */
  $('#search__activities').keyup(function() {
    if (
      $('#search__activities')
        .val()
        .trim() === ''
    ) {
      $('#stakeholder_message').css({ display: 'none' });
      loadStakeholderTable();
    }
  });

  /**
   * @description - Load the stakeholder table when filtered with search value
   */
  function loadSearchStakeholderTable() {
    $('#stakeholder-directory-table').load(
      'partials/stakeholder-directory-table.html',
      function() {
        const search = $('#search__activities').val();
        const filteredData = tableData.filter(organization =>
          organization.organisationName
            .trim()
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        );
        if (!filteredData || filteredData.length === 0) {
          $('#stakeholder_message').css({ display: 'block' });
        } else {
          const paginator = new Paginator(
            filteredData,
            keys,
            table,
            selectedItems,
            entriesPerPage
          );
          loadDropdownFilter(paginator);
          loadStakeholderDetails(paginator);
        }
      }
    );
  }

  /**
   * @description - Load the stakeholder table
   */
  function loadStakeholderTable() {
    $('#stakeholder-directory-table').load(
      'partials/stakeholder-directory-table.html',
      function() {
        const paginator = new Paginator(
          tableData,
          keys,
          table,
          selectedItems,
          entriesPerPage
        );
        loadDropdownFilter(paginator);
        loadStakeholderDetails(paginator);
      }
    );
  }

  /**
   * @description - Every other operation that is to be done on the stakeholder table and rows
   */
  function loadStakeholderDetails(paginator) {
    if (window.location.pathname === "/index-cordination-matrix.html") {
      $("#location-header").html("State");
      $("#responsive-table-location").html("State")
      $("#location-name").text("State Filters");
    } else if (window.location.pathname === "/state.html") {
      $("#location-header").html("LGA");
      $("#responsive-table-location").html("LGA")
      $("#location-name").text("LGA Filters");
    } else if (window.location.pathname === "/active-communities.html") {
      $("#location-header").html("Communities");
      $("#responsive-table-location").html("Communities")
      $("#location-name").text("Community Filters");
    }
    paginator.initialPage();
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
    $('.dropdown-trigger').dropdown();
    $('#entries-per-page').html(options);

    $('.selected').click(function() {
      const text = $(this).text();
      $('#row-number').text(text);
      paginator.entriesPerPage = $('#row-number').text();
      paginator.refreshTableBody();
    });
    $('#next-page').click(function() {
      paginator.nextPage();
    });
    $('#previous-page').click(function() {
      paginator.previousPage();
    });
    $('#responsive-next-page').click(function() {
      paginator.nextPage();
    });
    $('#responsive-previous-page').click(function() {
      paginator.previousPage();
    });
    $('.modal').modal();

    /**
     * @description - Load Modal on row click
     * @param {string} stakeholderName
     */
    async function getSHDetails(stakeholderName) {
      const response = await fetch(
        `${MMDP_BASE_URL}/api/v1/stakeholders-directory?organisationName=${stakeholderName}`
      );
      $(
        '.modal h5'
      ).html(`<div>${stakeholderName} <a href="#!" class="modal-close waves-effect waves-green btn-flat"
        >X</a></div><hr class="sh-hr">`);
      const stakeholderDataJson = await response.json();
      const stakeholderData = stakeholderDataJson.data[0];
      const beneficiaryData = handleBeneficiaries(
        stakeholderData.beneficiaries
      );

      let maleDistribution =
        stakeholderData.beneficiaries[0].beneficiaryTypes[0]
          .noOfMaleBeneficiaries;

      let femaleDistribution =
        stakeholderData.beneficiaries[0].beneficiaryTypes[0]
          .noOfFemaleBeneficiaries;

      let malePercentage;
      let femalePercentage;
      if (maleDistribution === 0 && femaleDistribution === 0) {
        malePercentage = 0;
        femalePercentage = 0;
      } else {
        malePercentage = Math.round(
          (maleDistribution / (maleDistribution + femaleDistribution)) * 100
        );
        femalePercentage = Math.round(
          (femaleDistribution / (maleDistribution + femaleDistribution)) * 100
        );
      }

      const requiredDetails = {
        'Year of Registration': stakeholderData.yearOfCacREG,
        'RC Number': stakeholderData.cacRcNumber,
        Category: stakeholderData.organisationTypeId.typeName,
        'Founder Name': stakeholderData.founder,
        "Founder's Phone Number": stakeholderData.phoneNumber,
        Location: stakeholderData.beneficiaries[0].communities[0].lgaId.lgaName,
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
        'Gender distribution of beneficiaries (in percentage)': `Male: ${malePercentage}%, Female: ${femalePercentage}%`,
        'Total Number of Beneficiaries':
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
    let tableColumnKeys = [
      'thematicPillars',
      'subThemes',
      'partnership',
      'location',
      'beneficiaryCount',
      'amountInvested'
    ];

    if ($(window).width() <= 600  && window.location.pathname === '/state.html') {
      tableColumnKeys[3] = 'location';
    } else {
      tableColumnKeys[3] = 'stateLocation';
    }

    const responsiveFilterDropdownOptionsParentSelectors = [
      '#responsiveStakeholderThematicPillars',
      '#responsiveStakeholderSubThemes',
      '#responsiveStakeholderPartnership',
      '#responsiveStakeholderLocation',
      '#responsiveStakeholderBeneficiaryCount',
      '#responsiveStakeholderAmountInvested'
    ];

    // Create html string message displayed when the table filter has no results
    const noFilterResultsHtmlMessage = `
    <span id="" class="">
      <h6 class="">
        <b>No Results found for the selected column filters.</b>
      </h6>
    </span>`;

    window.responsiveStakeholderTableFilter = new ResponsiveTableFilterHeader(
      table,
      tableData,
      tableColumnKeys,
      responsiveFilterDropdownOptionsParentSelectors,
      {
        filterIconSelector: '.btn-accordion-table',
        tableFiltersPanelSelector: '.responsive-filters-panel',
        singleFilterButtonSelector: '.dropbtn',
        singleFilterPanelSelector: '.responsive-dropdown-content',
        singleFilterActiveClass: 'show',
        singleFilterInactiveClass: 'dropdown-content',
        filterCheckboxItemSelector: 'input[type="checkbox"].checkedBox',
        filterCheckboxItemClass: 'checkedBox',
        applyFiltersButtonSelector: '.applyFilter_btn',
        clearFiltersButtonSelector: '.clearFilter_btn',
        itemSpanClass: '.sh-table-filter-item'
      },
      {
        tablePaginator: paginator,
        tableRootElementSelector: '.table-sm'
      },
      noFilterResultsHtmlMessage
    );
  }

  /**
   *
   * @description - Function to load and instantiate the dopdown filter class
   */
  function loadDropdownFilter(paginator) {
    let filterStakeholderTableColumnKeys;
    if (window.location.pathname === '/state.html' || window.location.pathname === '/active-communities.html') {
      filterStakeholderTableColumnKeys = [
        'organisationName',
        'thematicPillars',
        'subThemes',
        'partnership',
        'location',
        'beneficiaryCount',
        'amountInvested'
      ];
    } else {
      filterStakeholderTableColumnKeys = [
        'organisationName',
        'thematicPillars',
        'subThemes',
        'partnership',
        'stateLocation',
        'beneficiaryCount',
        'amountInvested'
      ];
    }

    const filterStakeholderDropdownSelectors = [
      '#organisationNameStakeholderFilterData',
      '#thematicPillarStakeholderFilterData',
      '#subThemeStakeholderFilterData',
      '#partnershipStakeholderFilterData',
      '#locationStakeholderFilterData',
      '#beneficiaryCountStakeholderFilterData',
      '#amountInvestedStakeholderFilterData'
    ];

    let stakeholderColumnKeysMap = new Map();
    filterStakeholderTableColumnKeys.map(columnKey => {
      let stakeholderCurrentColumnEntriesSet = new Set();
      for (
        let tableRowIndex = 0;
        tableRowIndex < tableData.length;
        tableRowIndex++
      ) {
        stakeholderCurrentColumnEntriesSet.add(
          tableData[tableRowIndex][columnKey]
        );
      }
      stakeholderColumnKeysMap.set(
        columnKey,
        stakeholderCurrentColumnEntriesSet
      );
    });

    const noFilterResultsHtmlMessage = `
    <tr class="stakeholder-filter-error">
      <td colspan="7">No Results found for the selected column filters.</td>
    </tr>`;

    window.stakeholderTableHeaderFilter = new TableFilterHeader(
      table,
      tableData,
      filterStakeholderTableColumnKeys,
      filterStakeholderDropdownSelectors,
      {
        filterIconSelector: '.stakeholder-filter-icon',
        filterCheckboxItemSelector:
          'input[type="checkbox"].stakeholder-filter-checkbox',
        filterCheckboxItemClass: 'stakeholder-filter-checkbox',
        applyFiltersButtonSelector: '.stakeholder-table-apply-filter',
        clearFiltersButtonSelector: '.stakeholder-table-clear-filter',
        filterIconSiblingSelector: '.stakeholder-filter-container',
        filterDropdownSubnavSelector: '.stakeholder_table_filter_subnav',
        itemSpanClass: '.sh-table-filter-item',
      },
      stakeholderColumnKeysMap,
      {
        tablePaginator: paginator,
        tableRootElementSelector: '#activities__table__body'
      },
      noFilterResultsHtmlMessage
    );
    // Add the class that fixes the css styling issues on the state page stakeholder table
    (window.location.pathname === "/state.html")
      ? $('.stakeholder_table_filter_subnav').addClass('state_stakeholder_table_filter_subnav')
      : false;


  }

  // Should always load the default table on page load
  loadStakeholderTable();
  $(window).resize(() => loadStakeholderTable());
});
