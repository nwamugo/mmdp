/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let paginator;
function createImpactFactorTable(data, rowsPerPage) {
  $(document).ready(async function() {
    const keys = [
      "organization",
      "focusArea",
      "lga",
      "subtheme",
      "pillar",
      "targetCompletion"
    ];
    const impactFactorData = data;
    let selectedItems = [];

    $("#impact-factor-table").load(
      "/partials/impact-report-table.html",
      function() {
        let table = "impactFactor";
        // Replace the impactFactorSampleData data with data from API endpoint
        window.impactFactorTableData = impactFactorData;
        paginator = new Paginator(
          impactFactorData,
          keys,
          table,
          selectedItems,
          rowsPerPage
        );
        paginator.potentialPartnershipsTable = true;
        impactFactorTableData = paginator.initialPage();
        $("#impact-factor-data").html(impactFactorTableData);
        $("#impact-factor-mobile").html(impactFactorTableData);
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
          paginator.entriesPerPage = $("#impact-factor-row-number").text();
          paginator.refreshTableBody();
        });
        $("#impact-factor-next-page").click(function() {
          paginator.nextPage();
        });
        $("#impact-factor-previous-page").click(function() {
          paginator.previousPage();
        });
      }
    );
  });
}

async function loadSearchImpactFactorTable() {
  const impactFactorData = await fetchStakeholderInformation();
  let notFound = [];
  let rowsPerPage = $("#impact-factor-row-number").text();
  $("#impact-factor-table").load(
    "/partials/impact-report-table.html",
    function() {
      const searchValue = $("#search__impact__factor").val();
      const search = searchValue.replace(/\s+/g, " ");
      const filteredData = impactFactorData.filter(
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
          $(".search__messages").css({ display: "block" });
          createImpactFactorTable(notFound);
        }
      } else {
        createImpactFactorTable(filteredData, rowsPerPage);
        $(".search__messages").css({ display: "none" });
      }
    }
  );
}

async function loadTable() {
  const impactFactorData = await fetchStakeholderInformation();
  $("#impact-factor-table").load(
    "/partials/impact-report-table.html",
    function() {
      createImpactFactorTable(impactFactorData);
    }
  );
}

/**
 * @description - Search onclicking search button
 */
$("#btn_search").click(function() {
  if (
    $("#search__impact__factor")
      .val()
      .trim() === ""
  ) {
    // loadTable();
  } else {
    loadSearchImpactFactorTable();
  }
});

$("#search__impact__factor").keypress(function(e) {
  var key = e.which;
  if (key == 13) {
    if (
      $("#search__impact__factor")
        .val()
        .trim() === ""
    ) {
      loadTable();
    } else {
      loadSearchImpactFactorTable();
    }
  }
});

/**
 * @description - Load full table when search field is cleared
 */
$("#search__impact__factor").keyup(function() {
  if (
    $("#search__impact__factor")
      .val()
      .trim() === ""
  ) {
    $(".search__messages").css({ display: "none" });
    loadTable();
  }
});
