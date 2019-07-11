$(document).ready(async function() {
  const keys = [
    "organisationName",
    "thematicPillars",
    "subThemes",
    "partnership",
    "location",
    "beneficiaryCount",
    "amountInvested"
  ];
  const filter = new Filter();

  const queryNameFromUrl = window.location.search.substring(1).split("=")[1];
  const queryParam = queryNameFromUrl
    ? queryNameFromUrl.charAt(0).toUpperCase() + queryNameFromUrl.slice(1)
    : "Nigeria";
  let query, param;
  switch (window.location.pathname) {
    case "/country.html":
      param = "country";
      query = `country=${queryParam}`;
      break;
    case "/state.html":
      query = `state=${queryParam}`;
      break;
    case "/state-pillars.html":
      query = `state=${queryParam}`;
      break;
    case "/state-report.html":
      query = `state=${queryParam}`;
      break;
    case "/lga.html":
      param = "lga";
      query = `lga=${queryParam}`;
      break;
    case "/active-communities.html":
      query = `lga=${queryParam}`;
      break;
    case "/state-pillars.html":
      query = `state=${queryParam}`;
      break;
    default:
      param = "country";
      query = `country=${queryParam}`;
      break;
  }
  const stakeholderData = await fetch(
    `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName`
  );
  const data = await stakeholderData.json();

  // neededData
  const tableData = handleStakeholdersData(data.filteredStakeholders);
  const beneficiaryCount = tableData.map(item => item.beneficiaryCount);
  const organisationName = tableData.map(item => item.organisationName);

  const allCount = tableData.map(item => item.partnership);

  window.tableData = tableData;
  keys[4] = param === "country" ? "stateLocation" : keys[4];
  const paginator = new Paginator(tableData, keys);

  $("#stakeholder-directory-table").load(
    "/partials/stakeholder-directory-table.html",
    function() {
      fetchLocations();
      filter.displayDataInDropdown(
        [...new Set(beneficiaryCount)],
        "#beneficiary_count_data"
      );
      filter.displayDataInDropdown(
        [...new Set(organisationName)],
        "#organisation_data"
      );
      fetchAmountInvested();
      fetchSubtheme();
      fetchThematicPillars();
      filter.displayDataInDropdown([...new Set(allCount)], "#partnership_data");
      paginator.initialPage();
      let n = 5;
      let options = "";
      while (n < 51) {
        if (n === 10) {
          options += `<div class="selected">${n} </div>\n`;
        } else {
          options += `<div class="selected">${n} </div>\n`;
        }
        n += 5;
      }
      $(".dropdown-trigger").dropdown();
      $("#entries-per-page").html(options);

      $(".selected").click(function() {
        const text = $(this).text();
        $("#row-number").text(text);
        paginator.entriesPerPage = $("#row-number").text();
        paginator.refreshTableBody();
      });
      $("#next-page").click(function() {
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
          stakeholderData.beneficiaries
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

  // uncheck checkboxes
  function uncheckCheckboxes() {
    if ($("table tr .checkBox").is(":checked")) {
      checkBoxValues = [];
    }
    $("table tr .checkBox").prop("checked", false);
    paginator.refreshTableBody();
  }

  //close dropdown
  function closeDropdown() {
    $("[id*='dropdown__icon_']").each(function(i, e) {
      $(this)
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

      $(this)
        .next(".container")
        .find(".partnership_subnav")
        .slideUp();

      $(this)
        .next(".container")
        .find(".organisation_subnav")
        .slideUp();
    });
  }

  // camel case the dropdown names
  function camelize(text) {
    return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(
      match,
      p1,
      p2,
      offset
    ) {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    });
  }

  // toggle dropdown arrow
  let dropdownName;
  $("div").on("click", "table tr #dropdown__icon_", function() {
    dropdownName = camelize($.trim(this.previousSibling.nodeValue));
    if (param === "country" && dropdownName === "location") {
      dropdownName = "stateLocation";
    }
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

    $(this)
      .next(".container")
      .find(".partnership_subnav")
      .slideToggle();

    $(this)
      .next(".container")
      .find(".organisation_subnav")
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
          .catch(err => {
            throw err;
          });
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
        .catch(err => {
          throw err;
        });
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
        .catch(err => {
          throw err;
        });
    });
  }

  // get checkbox values
  let checkBoxValues = [];
  $("div").on("change", "table tr .checkBox", function() {
    if (!isNaN($(this).val())) {
      checkBoxValues.push(parseInt($(this).val()));
    } else if ($(this).is(":checked")) {
      checkBoxValues.push($(this).val());
    } else {
      checkBoxValues = checkBoxValues.filter(loc => loc != $(this).val());
    }
  });

  // clear filter button on click
  $("div").on("click", "table tr #clearFilter", function() {
    uncheckCheckboxes();
    closeDropdown();
  });

  // apply filters button on click
  $("div").on("click", "table tr #applyFilter", function() {
    for (let i = 0; i < tableData.length; i++) {
      const filterName = tableData[i][dropdownName];
      applyFilterData(filterName, i);
    }
    closeDropdown();
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
