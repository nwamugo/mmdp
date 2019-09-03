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
  $('#gap-analysis-report-button').click(() => {
    $('#partnership-report-button').addClass('disable'); // set the partnership report button to disabled
    $('#impact-factor-report-button').addClass('disable'); // set the impact factor button to disabled
    $('#gap-analysis-report-button').removeClass('disable'); // enable the gap analysis button
    $('#gap-analysis-report-table').show(); // Show the gap analysis table
    $('#search__activities__gap').show(); //show gap analysis search field
    $('#btn_search_gap').show(); //show gap analysis search button
    $('#search__activities__impact').hide(); //hide impact search
    $('#btn_search_impact').hide(); //hide impact button
    $('#search__activities__partnership').hide(); //hide partner search
    $('#btn_search_partner').hide(); //hide partner button
    $('#partnership-report-table').hide(); // Hide the partnerships table
    $('#impact-factor-table').hide(); // Hide the impact factor table
    $('#search__activities__impact').val('');
    $('#impact_message').hide();
    $('#search__activities__partnership').val('');
    $('#partner_message').hide();
    $('#thematic-pillars__heading').html(gapAnalysisHeader); // Set the header for the table
    $('#gap-previous-page').unbind();
    $('#gap-next-page').unbind(); // Remove all event handlers for all #gap-next-page element
    window.partnershipsTableHeaderFilter ? window.partnershipsTableHeaderFilter.clearAllFilters() : undefined;
    window.gapAnalysisTableFilterHeader ? window.gapAnalysisTableFilterHeader.clearAllFilters() : undefined;
    window.impactFactorTableFilterHeader ? window.impactFactorTableFilterHeader.clearAllFilters() : undefined ;
    loadGapTable(gapReport);
  });

  $('#partnership-report-button').click(() => {
    $('#gap-analysis-report-button').addClass('disable'); // set the gap analysis button to disabled
    $('#impact-factor-report-button').addClass('disable'); // set the impact factor button to disabled
    $('#partnership-report-button').removeClass('disable');
    $('#partnership-report-table').show();
    $('#gap-analysis-report-table').hide();
    $('#impact-factor-table').hide(); // Hide the impact factor table
    $('#search__activities__gap').hide(); //hide gap analysis search field
    $('#btn_search_gap').hide(); //hide gap analysis search button
    $('#search__activities__impact').hide(); //hide impact search
    $('#btn_search_impact').hide(); //hide impact button
    $('#search__activities__partnership').show(); //show partner search
    $('#btn_search_partner').show(); //show partner button
    $('#search__activities__gap').val('');
    $('#search__activities_impact').val('');
    $('#impact_message').hide();
    $('#thematic-pillars__heading').html(partnershipHeader);
    $('#gap_message').hide();
    $('#search__activities').val('');
    $('#potential-previous-page').unbind();
    $('#potential-next-page').unbind();
    window.partnershipsTableHeaderFilter ? window.partnershipsTableHeaderFilter.clearAllFilters() : undefined;
    window.gapAnalysisTableFilterHeader ? window.gapAnalysisTableFilterHeader.clearAllFilters() : undefined;
    window.impactFactorTableFilterHeader ? window.impactFactorTableFilterHeader.clearAllFilters() : undefined ;
    createPotentialPartnershipsTable(partnershipTableData);
  });

  $('#impact-factor-report-button').click(() => {
    $('#gap-analysis-report-button').addClass('disable');
    $('#partnership-report-button').addClass('disable'); // set the partnership report button to disabled
    $('#impact-factor-report-button').removeClass('disable');
    $('#impact-factor-table').show();
    $('#gap-analysis-report-table').hide();
    $('#partnership-report-table').hide();
    $('#search__activities__gap').hide();
    $('#btn_search_gap').hide(); //hide gap analysis search button
    $('#search__activities__impact').show(); //show impact search
    $('#btn_search_impact').show(); //show impact button
    $('#search__activities__partnership').hide(); //hide partner search
    $('#btn_search_partner').hide(); //hide partner button
    $('#thematic-pillars__heading').html(impactRefactorHeader);
    $('#gap_message').hide();
    $('#search__activities__gap').val('');
    $('#search__activities__partnership').val('');
    $('#partner_message').hide();
    $('#impact-factor-previous-page').unbind();
    $('#impact-factor-next-page').unbind();
    window.partnershipsTableHeaderFilter ? window.partnershipsTableHeaderFilter.clearAllFilters() : undefined;
    window.gapAnalysisTableFilterHeader ? window.gapAnalysisTableFilterHeader.clearAllFilters() : undefined;
    window.impactFactorTableFilterHeader ? window.impactFactorTableFilterHeader.clearAllFilters() : undefined;
    loadImpactFactorTable(window.impactFactorTableData);
  });
});
