/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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

    /**
     * @description - Capture rows that are checked on the table
     */
    $('#impact-factor-table').on('click', 'input[type="checkbox"]', function() {
        // Check the checkbox in the header
        if ($(this).is(':checked') && $(this).attr('data-org') === 'impact-factor-check-all') {
            $('input[name="aaaaa"]').each(function() {
                const selectedRow = $(this).attr('data-org');                                       
                selectedItems.push(selectedRow.replace(/-/g, ' '));
                this.checked = true;
              });
            // Check the individual check boxes
        } else if ($(this).is(':checked') && $(this).attr('data-org') !== 'impact-factor-check-all') {
                const selectedRow = $(this).attr('data-org');                   
                selectedItems.push(selectedRow.replace(/-/g, ' '));
            // Uncheck all checkboxes when header checkbox is unchecked
        } else if ($(this).is(':not(:checked)') && $(this).attr('data-org') === 'impact-factor-check-all') {
            $('input[name="aaaaa"]').each(function() {
            this.checked = false;
            });
            selectedItems.length = 0;
            // Uncheck an individual checkbox when all checkboxes have been checked with the header checkbox
        } else if ($(this).is(':not(:checked)') && $(this).attr('data-org') !== 'impact-factor-check-all') {
            var unSelectedRow = $(this).attr('data-org');  // Get the checked row
            var rowsToDownload = selectedItems.filter(function(value, index, arr){  // Filter to get only the checked rows
              return value !== unSelectedRow.replace(/-/g, ' ');
            });
            selectedItems.splice(0, selectedItems.length, ...rowsToDownload);  // Replace all the items in selectedItems with the content of rowsToDownload
            $('#impact-factor-check-all').prop('checked', false); // Set impact-factor-check-all to false since all are not checked
          }
    });

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
        bindJQueryImpactFactor(selectedItems);
        window.impactFactorData = impactFactorData;
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
      const searchValue = $("#search__activities__impact").val();
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
          $("#impact_message").css({ display: "block" });
          createImpactFactorTable(notFound);
        }
      } else {
        createImpactFactorTable(filteredData, rowsPerPage);
        $("#impact_message").css({ display: "none" });
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
$("#btn_search_impact").click(function() {
  if (
    $("#search__activities__impact")
      .val()
      .trim() === ""
  ) {
    // loadTable();
  } else {
    loadSearchImpactFactorTable();
  }
});

$("#search__activities__impact").keypress(function(e) {
  var key = e.which;
  if (key == 13) {
    if (
      $("#search__activities__impact")
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
$("#search__activities__impact").keyup(function() {
  if (
    $("#search__activities__impact")
      .val()
      .trim() === ""
  ) {
    $("#impact_message").css({ display: "none" });
    loadTable();
  }
});
