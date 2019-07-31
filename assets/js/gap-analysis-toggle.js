const partnershipHeader = `<div class="thematic-pillars__title">
                            Partnership / Collaboration Report
                          </div>
                          <div class="thematic-pillars__desc">
                            Search through our listing to quickly get information about 
                            the various stakeholders / organizations carrying out similar activities 
                            in contiguous local government areas
                          </div>`;

const gapAnalysisHeader = `<div class="thematic-pillars__title">
                            Gap Analysis
                          </div>
                          <div class="thematic-pillars__desc">
                              Search through our listing to quickly get information about gaps
                              identified across all the local government areas relative to the
                              services offered by various stakeholders / organisations
                          </div>`;

const impactRefactorHeader = `<div class="thematic-pillars__title">
                            Impact Factor
                          </div>
                          <div class="thematic-pillars__desc impact_factor_thematic-pillars__desc">
                            Search through our listing to view the information about various <br>
                              stakeholders / organisations 
                            and their impacts relative to the specific focus areas
                          </div>`;

$(document).ready(async function() {
  $("#gap-analysis-report-button").click(() => {
    $("#partnership-report-button").addClass("disable"); // set the partnership report button to disabled
    $("#impact-factor-report-button").addClass("disable"); // set the impact factor button to disabled
    $("#gap-analysis-report-button").removeClass("disable"); // enable the gap analysis button
    $("#gap-analysis-report-table").show(); // Show the gap analysis table
    $("#partnership-report-table").hide(); // Hide the partnerships table
    $("#impact-factor-table").hide(); // Hide the impact factor table
    $("#search__impact__factor").val("");
    $(".search__messages").hide();
    $("#thematic-pillars__heading").html(gapAnalysisHeader); // Set the header for the table
  });

  $("#partnership-report-button").click(() => {
    $("#gap-analysis-report-button").addClass("disable"); // set the gap analysis button to disabled
    $("#impact-factor-report-button").addClass("disable"); // set the impact factor button to disabled
    $("#partnership-report-button").removeClass("disable");
    $("#partnership-report-table").show();
    $("#gap-analysis-report-table").hide();
    $("#impact-factor-table").hide(); // Hide the impact factor table
    $("#search__impact__factor").val("");
    $(".search__messages").hide();
    $("#thematic-pillars__heading").html(partnershipHeader);
  });

  $("#impact-factor-report-button").click(() => {
    $("#gap-analysis-report-button").addClass("disable");
    $("#partnership-report-button").addClass("disable"); // set the partnership report button to disabled
    $("#impact-factor-report-button").removeClass("disable");
    $("#impact-factor-table").show();
    $("#gap-analysis-report-table").hide();
    $("#partnership-report-table").hide();
    $("#thematic-pillars__heading").html(impactRefactorHeader);
    if (!paginator.data.length) {
      loadTable();
    }
  });
});
