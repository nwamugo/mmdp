$(document).ready(async function() {
  const keys = [
    'organisationName',
    'thematicPillars',
    'subThemes',
    'partnership',
    'location',
    'beneficiaryCount',
    'amountInvested',
  ];
  const filter = new Filter();

  const queryNameFromUrl = window.location.search.substring(1).split("=")[1];
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

  let MMDP_BASE_URL;

  if (
    window.location.host.includes('127.0.0.1') ||
    window.location.host.includes('localhost')
  ) {
    MMDP_BASE_URL = 'http://localhost:3000';
  } else {
    MMDP_BASE_URL = 'http://cms-staging.mmdp.ng:3000';
  }

  const stakeholderData = await fetch(
    `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName=${''}`,
  );

  const data = await stakeholderData.json();

  // neededData
  const tableData = handleStakeholdersData(data.filteredStakeholders);
  const beneficiaryCount = tableData.map(item => item.beneficiaryCount);
  beneficiaryCount.sort((a, b) => {
    if (a >= b) {
      return 1;
    }
  ];

  function createTableRow(data) {
    return `
        <tr>
            <td class="organisation__name">
                <input name="aaaaa" value="aaaaa" type="checkbox" /> 
                <div>${data[keys[0]]}</div>
            </td>
            <td>${data[keys[1]]}</td>
            <td>${data[keys[2]]}</td>
            <td>${data[keys[3]]}</td>
            <td id=${data.id}>${data[keys[4]]}</td>
            <td>${data[keys[5]]}</td>
            <td>${data[keys[6]]}</td>
    </tr>
        `;
  }

  function loadTableData() {
    const rows = stakeholderDataMock.map(stakeholder =>
      createTableRow(stakeholder)
    );
    $("tbody.table__body").html(rows);
  }

  const handleChange = () => {
    var x = document.getElementById('search__activities').value;
    if (x === '' || x === null) {
      paginator.empData = false;
      paginator.setTableTempData();
    }
  };

  const handleSearch = async () => {
    var searchQuery = document.getElementById('search__activities').value;
    if (searchQuery) {
      const stakeholderData = await fetch(
        `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName=${searchQuery ||
          ''}`,
      );
      const data = await stakeholderData.json();
      // neededData
      const tableData = handleStakeholdersData(data.filteredStakeholders);
      paginator.setTableTempData(tableData);
      paginator.empData = true;
    } else {
      paginator.empData = false;
      paginator.setTableTempData();
    }
  };

  $('#search__activities').keyup(handleChange);
  $('#btn_search').click(handleSearch);

  $('#stakeholder-directory-table').load(
    '/partials/stakeholder-directory-table.html',
    function() {
      fetchLocations();
      filter.displayDataInDropdown(beneficiaryCount, "#beneficiary_count_data");
      fetchAmountInvested();
      fetchSubtheme();
      fetchThematicPillars();
      paginator.initialPage();
      let n = 5;
      let options = "";
      while (n < 51) {
        if (n === 10) {
          options += `<option selected>${n}</option>\n`;
        } else {
          options += `<option>${n}</option>\n`;
        }
        n += 5;
      }
      $("select#entries-per-page").html(options);
      $("select#entries-per-page").change(function() {
        paginator.entriesPerPage = this.value;
        paginator.refreshTableBody();
      });
      $('#next-page').click(function() {
        paginator.nextPage();
      });
      $("#previous-page").click(function() {
        paginator.previousPage();
      });
      $(".modal").modal();

      async function getSHDetails(stakeholderName) {
        const response = await fetch(
          `${MMDP_BASE_URL}/api/v1/stakeholders-directory?organisationName=${stakeholderName}`
        );
        $(".modal h5")
          .html(`<div>${stakeholderName} <a href="#!" class="modal-close waves-effect waves-green btn-flat"
        >X</a></div><hr class="sh-hr">`);
        const stakeholderDataJson = await response.json();
        const stakeholderData = stakeholderDataJson.data[0];
        const beneficiaryData = handleBeneficiaries(
          stakeholderData.beneficiaries,
        );

        const requiredDetails = {
          "Year of Registration": stakeholderData.yearOfCacREG,
          "RC Number": stakeholderData.cacRcNumber,
          Category: stakeholderData.organisationTypeId.typeName,
          "Founder Name": stakeholderData.founder,
          "Founder's Phone Number": stakeholderData.phoneNumber,
          Location:
            stakeholderData.beneficiaries[0].communities[0].lgaId.lgaName,
          "Thematic Pillar (s)": beneficiaryData.thematicPillars,
          "Sub Theme (s)": beneficiaryData.subThemes,
          "Focus Area (s)": beneficiaryData.focusArea,
          "Service (s)": beneficiaryData.beneficiaryService,
          "Source (s) of Funding": beneficiaryData.fundingSources,
          "Amount Invested till date": beneficiaryData.amountInvested,
          "Local Communities": beneficiaryData.localCommunities,
          "LGA of Operation": beneficiaryData.lgas,
          "Partners (Local and International)": [
            ...new Set(
              stakeholderData.partnerships.map(
                partner => partner.stakeholder2Id.organisationName
              )
            )
          ].join(", "),
          "Gender distribution of beneficiaries (in percentage) Male % Female%": `male: ${
            beneficiaryData.malePercent
          }%, female: ${beneficiaryData.femalePercent}%`,
          "Total Number of Beneficiary":
            beneficiaryData.totalNumberOfBeneficiaries,
          "Beneficiary Type": beneficiaryData.beneficiaryTypes,
          "Target Audience (s)": beneficiaryData.targetAudience,
          "Number of Staff": stakeholderData.staffStrengthRangeId
            ? stakeholderData.staffStrengthRangeId.staffStrength
            : "",
          "Number of Volunteers": stakeholderData.volunteersCount
        };
        let shDetailsTableData = "";
        const keys = Object.keys(requiredDetails);
        while (keys.length > 0) {
          const rowKeys = keys.splice(0, 3);
          const newRow = `
          <tr>
              <td>
                <div class="row__title">${rowKeys[0]}</div>
                <div class="row__value">${requiredDetails[rowKeys[0]] ||
                  "-"}</div>
              </td>
              <td>
                <div class="row__title">${rowKeys[1]}</div>
                <div class="row__value">${requiredDetails[rowKeys[1]] ||
                  "-"}</div>
              </td>
              <td>
                <div class="row__title">${rowKeys[2]}</div>
                <div class="row__value">${requiredDetails[rowKeys[2]] ||
                  "-"}</div>
              </td>
          </tr>
          `;
          shDetailsTableData += newRow;
        }
        $(".stakeholder__details__table tbody").html(shDetailsTableData);
      }
      window.getSHDetails = getSHDetails;
    }
  );

  function uncheckCheckboxes() {
    if ($("table tr .checkBox").is(":checked")) {
      locationValues = [];
    }
    $("table tr .checkBox").prop("checked", false);
    loadTableData();
  }

  function closeLocationDropdown() {
    return $("table tr #location_dropdown__icon", function() {
      $("table tr #location_dropdown__icon")
        .next(".container")
        .find(".subnav")
        .slideUp();

      $(this)
        .next(".container")
        .find(".amount_subnav")
        .slideUp();

      $(this)
        .next(".container")
        .find(".beneficiary_subnav")
        .slideUp();

      $(this)
        .next(".container")
        .find(".subtheme_subnav")
        .slideUp();

      $(this)
        .next(".container")
        .find(".thematic_subnav")
        .slideUp();
    });
  }

  $(function() {
    fetchStates();
  });

  // display location header dropdown
  $("div").on("click", "table tr #location_dropdown__icon", function() {
    $(this)
      .next(".container")
      .find(".subnav")
      .slideToggle();

    $(this)
      .next(".container")
      .find(".amount_subnav")
      .slideToggle();

    $(this)
      .next(".container")
      .find(".beneficiary_subnav")
      .slideToggle();

    $(this)
      .next(".container")
      .find(".subtheme_subnav")
      .slideToggle();

    $(this)
      .next(".container")
      .find(".thematic_subnav")
      .slideToggle();
  });

  function fetchLocations() {
    lgasArray = window.variable;
    let stateArray = [];
    if (!lgasArray) {
      client(`state`).then(res => {
        res
          .json()
          .then(res => {
            statesArray = res.data.data;
            for (let i = 0; i < statesArray.length; i++) {
              stateArray.push(statesArray[i].stateName);
            }
            filter.displayDataInDropdown(stateArray, "#data");
          })
          .catch(err => console.log(err));
      });
      return;
    }
    filter.displayDataInDropdown(lgasArray, "#data");
  }

  function fetchAmountInvested() {
    let amountsInvestedArray = [];
    client(`amount-invested`).then(res => {
      res
        .json()
        .then(res => {
          amountInvestedArray = res.data;
          for (let i = 0; i < amountInvestedArray.length; i++) {
            amountsInvestedArray.push(
              amountInvestedArray[i].amountInvestedRange
            );
          }
          filter.displayDataInDropdown(amountsInvestedArray, "#data_amount");
        })
        .catch(err => console.log(err));
    });
  }

  function fetchThematicPillars() {
    let thematicPillars = [];
    client(`thematic-pillars`).then(res => {
      res
        .json()
        .then(res => {
          let thematicData = res.data.data;
          for (let i = 0; i < thematicData.length; i++) {
            thematicPillars.push(thematicData[i].pillarTitle);
          }
          filter.displayDataInDropdown(thematicPillars, "#thematic_data");
        })
        .catch(err => {
          return err;
        });
    });
  }

  function fetchSubtheme() {
    let subthemeArray = [];
    client(`sub-theme`).then(res => {
      res
        .json()
        .then(res => {
          subthemesArray = res.data.data;
          for (let i = 0; i < subthemesArray.length; i++) {
            subthemeArray.push(subthemesArray[i].subThemeName);
          }
          filter.displayDataInDropdown(subthemeArray, "#data_subtheme");
        })
        .catch(err => console.log(err));
    });
  }

  // get location checkbox values
  let locationValues = [];
  $("div").on("change", "table tr .checkBox", function() {
    if ($(this).is(":checked")) {
      locationValues.push($(this).val());
    } else {
      locationValues = locationValues.filter(loc => loc != $(this).val());
    }
  });

  // clear filter button
  $("div").on("click", "table tr #clearFilter", function() {
    uncheckCheckboxes();
    closeLocationDropdown();
  });

  // apply location filters
  $("div").on("click", "table tr #applyFilter", function() {
    for (let i = 0; i < stakeholderDataMock.length; i++) {
      const stateName = stakeholderDataMock[i].stateName;
      if ($.inArray(stateName, locationValues) === -1) {
        $(`table tbody.table__body td#${stakeholderDataMock[i].id}`)
          .parent()
          .hide();
      } else {
        $(`table tbody.table__body td#${stakeholderDataMock[i].id}`)
          .parent()
          .show();
      }
    }
    closeLocationDropdown();
  });

  // function to display apply filter data
  function applyFilterData(filterByName, index) {
    if ($.inArray(filterByName, checkBoxValues) === -1) {
      $(`#stakeholder td#${tableData[index].id}`)
        .parent()
        .hide();
    } else {
      $(`#stakeholder td#${tableData[index].id}`)
        .parent()
        .show();
    }
  }
});
