const impactFactorTableUrl = "/partials/impact-report-table.html";
const impactFactorTableName = "impactFactor";

let impactFactorTableSelectedItems = [];
const impactFactorRowsPerPage = 10;
let impactPaginator;

// the prefix ift- is simply a convention used in the html id naming to distinguish that this belongs to the impact factor table
const impactFactorTableColumnKeys = [
  "organization",
  "focusArea",
  "lga",
  "subtheme",
  "pillar",
  "targetCompletion"
];

function getImpactFactorTableData() {
  const impactFactorTableData = [];
  for (const item of window.stakeholderData.filteredStakeholders) {
    for (const beneficiary of item.beneficiaries) {
      let impactFactorRow = {};
      impactFactorRow.organization = item.organisationName;
      impactFactorRow.focusArea =
        beneficiary.focusArea.focusAreaName.focusAreaName;

      const uniqueLgas = new Set();
      for (const community of beneficiary.communities) {
        lgaName = community.lgaId.lgaName;
        uniqueLgas.add(lgaName);
      }

      impactFactorRow.lga = [...uniqueLgas].join(", ");
      impactFactorRow.subtheme =
        beneficiary.focusArea.subThemeName.subThemeName;
      impactFactorRow.pillar =
        beneficiary.focusArea.thematicPillarName.pillarName;

      const focusAreaTarget = beneficiary.focusArea.target;
      const totalBeneficiaries = beneficiary.totalNumberOfBeneficiaries;

      if (focusAreaTarget > totalBeneficiaries) {
        impactFactorRow.targetCompletion =
          (totalBeneficiaries / focusAreaTarget) * 100 + "%";
      } else {
        impactFactorRow.targetCompletion = 100 + "%";
      }

      impactFactorTableData.push(impactFactorRow);
    }
  }
  return impactFactorTableData;
}

function loadTable(impactPaginator) {
  impactPaginator.potentialPartnershipsTable = true;
  const paginatedImpactFactorTableData = impactPaginator.initialPage();

  /*
  NOTE: Please note the order of the filterTableColumnKeys array should match the order for your table columns from left to right. The filterDropdownOptionsParentSelectors should then follow the same order array
  */

  const filterDropdownOptionsParentSelectors = [
    "#ift-organizationFilterData",
    "#ift-focusAreaFilterData",
    "#ift-lgaFilterData",
    "#ift-subthemeFilterData",
    "#ift-thematicPillarFilterData",
    "#ift-targetCompletionFilterData"
  ];

  let columnKeysMap = new Map();
  impactFactorTableColumnKeys.forEach(columnKey => {
    let currentColumnEntriesSet = new Set();
    for (
      let tableRowIndex = 0;
      tableRowIndex < window.impactFactorTableData.length;
      tableRowIndex++
    ) {
      currentColumnEntriesSet.add(
        window.impactFactorTableData[tableRowIndex][columnKey]
      );
    }
    columnKeysMap.set(columnKey, currentColumnEntriesSet);
  });

  // Create html string message displayed when the table filter has no results
  const noFilterResultsHtmlMessage = `
    <main id="table" class="table-row body">
      <h6 class="impact-row">
        <b>No Results found for the selected column filters.</b>
      </h6>
    </main>`;

  $("#impact-factor-data").html(paginatedImpactFactorTableData);
  $("#impact-factor-mobile").html(paginatedImpactFactorTableData);
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
  $(".impact-factor-dropdown-trigger").dropdown();
  $("#impact-factor-entries-per-page").html(options);

  $(".selected").click(function() {
    const text = $(this).text();
    $("#impact-factor-row-number").text(text);
    impactPaginator.entriesPerPage = $("#impact-factor-row-number").text();
    impactPaginator.refreshTableBody();
  });
  $("#impact-factor-next-page").click(function() {
    impactPaginator.nextPage();
  });
  $("#impact-factor-previous-page").click(function() {
    impactPaginator.previousPage();
  });
  bindJQueryImpactFactor(impactFactorTableSelectedItems);

  if (!window.impactFactorTableFilterHeader) {
    // Create an instance of the TableFilterHeader class for the potential partnerships table
    window.impactFactorTableFilterHeader = new TableFilterHeader(
      impactFactorTableName,
      "impact-dropdown-icon",
      window.impactFactorTableData,
      impactFactorTableColumnKeys,
      filterDropdownOptionsParentSelectors,
      {
        filterIconSelector: ".impact-filter-icon",
        filterCheckboxItemSelector:
          'input[type="checkbox"].impact-filter-checkbox',
        filterCheckboxItemClass: "impact-filter-checkbox",
        applyFiltersButtonSelector: ".impact-table-apply-filter",
        clearFiltersButtonSelector: ".impact-table-clear-filter",
        filterIconSiblingSelector: ".table-filter-container",
        filterDropdownSubnavSelector: ".impact_table_filter_subnav",
        itemSpanClass: '.if-table-filter-item',
      },
      columnKeysMap,
      {
        tablePaginator: impactPaginator,
        tableRootElementSelector: "#impact-factor-data"
      },
      noFilterResultsHtmlMessage
    );
  }
}

$(document).ready(async function() {
  /**
   * @description - Capture rows that are checked on the table
   */
  $("#impact-factor-table-container").on(
    "click",
    'input[type="checkbox"].check, input[type="checkbox"].check-all',
    function() {
      // Check the checkbox in the header
      if (
        $(this).is(":checked") &&
        $(this).attr("data-org") === "impact-factor-check-all"
      ) {
        $('input[name="aaaaa"]').each(function() {
          const selectedRow = $(this).attr("data-org");
          impactFactorTableSelectedItems.push(selectedRow.replace(/-/g, " "));
          this.checked = true;
        });
        // Check the individual check boxes
      } else if (
        $(this).is(":checked") &&
        $(this).attr("data-org") !== "impact-factor-check-all"
      ) {
        const selectedRow = $(this).attr("data-org");
        impactFactorTableSelectedItems.push(selectedRow.replace(/-/g, " "));
        // Uncheck all checkboxes when header checkbox is unchecked
      } else if (
        $(this).is(":not(:checked)") &&
        $(this).attr("data-org") === "impact-factor-check-all"
      ) {
        $('input[name="aaaaa"]').each(function() {
          this.checked = false;
        });
        impactFactorTableSelectedItems.length = 0;
        // Uncheck an individual checkbox when all checkboxes have been checked with the header checkbox
      } else if (
        $(this).is(":not(:checked)") &&
        $(this).attr("data-org") !== "impact-factor-check-all"
      ) {
        var unSelectedRow = $(this).attr("data-org"); // Get the checked row
        var rowsToDownload = impactFactorTableSelectedItems.filter(function(
          value,
          index,
          arr
        ) {
          // Filter to get only the checked rows
          return value !== unSelectedRow.replace(/-/g, " ");
        });
        impactFactorTableSelectedItems.splice(
          0,
          impactFactorTableSelectedItems.length,
          ...rowsToDownload
        ); // Replace all the items in impactFactorTableSelectedItems with the content of rowsToDownload
        $("#impact-factor-check-all").prop("checked", false); // Set impact-factor-check-all to false since all are not checked
      }
    }
  );
  $("#impact-factor-table").load(impactFactorTableUrl);
});

async function loadImpactFactorTable(data, action) {
  if (!impactPaginator ||  action === 'impactSearch' || window.impactSearchStatus) {
    impactPaginator = new Paginator(
      data,
      impactFactorTableColumnKeys,
      impactFactorTableName,
      impactFactorTableSelectedItems,
      impactFactorRowsPerPage
    );
  }
  loadTable(impactPaginator);
  if (action !== 'impactSearch') window.impactSearchStatus = false;
}

const impactAction = 'impactSearch';

async function loadSearchImpactFactorTable() {
  let notFound = [];
  $("#impact-factor-table").load(impactFactorTableUrl, function() {
    const searchValue = $("#search__activities__impact").val();
    const search = searchValue.replace(/\s+/g, " ");
    const filteredData = window.impactFactorTableData.filter(
      item =>
        item.organization
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        item.focusArea
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        item.lga
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        item.pillar
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        item.subtheme
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    );
    if (!filteredData || filteredData.length === 0) {
      if ($("#impact-factor-table").is(":visible")) {
        $("#impact_message").css({ display: "block" });
        loadImpactFactorTable(notFound, impactAction);
      }
    } else {
      loadImpactFactorTable(filteredData, impactAction);
      $("#impact_message").css({ display: "none" });
    }
  });
}

/**
 * @description - Search onclicking search button
 */
$("#btn_search_impact").click(function() {
  if (
    $("#search__activities__impact")
      .val()
      .trim() !== ""
  ) {
    window.impactSearchStatus = true;
    loadSearchImpactFactorTable();
  }
});

$("#search__activities__impact").keypress(function(e) {
  var key = e.which;
  if (key == 13) {
    if (
      $("#search__activities__impact")
        .val()
        .trim() !== ""
    ) {
      window.impactSearchStatus = true;
      loadSearchImpactFactorTable();
    }
  }
});

/**
 * @description - Load full table when search field is cleared
 */
$("#search__activities__impact").keyup(function() {
  if (
    $("#search__activities__impact")
      .val()
      .trim() === ""
  ) {
    window.impactSearchStatus = false;
    $("#impact_message").css({ display: "none" });
    loadImpactFactorTable(window.impactFactorTableData, impactAction);
  }
});
