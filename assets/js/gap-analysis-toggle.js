const partnershipHeader = `<div class="thematic-pillars__title">
                            Partnership / Collaboration Report
                          </div>
                          <div class="thematic-pillars__desc">
                            Search through our listing to quickly get information about 
                            the various stakeholders/ organizations carrying out similar activities 
                            in contiguous local governement areas
                          </div>`

const gapAnalysisHeader = `<div class="thematic-pillars__title">
                            Gap Analysis
                          </div>
                          <div class="thematic-pillars__desc">
                              Search through our listing to quickly get information about gaps
                              identified across all the local government areas relative to the
                              services offered by various stakeholders / organisations
                          </div>`

$(document).ready(async function() {
  $('#gap-analysis-report-button').click(() => {
    $('#partnership-report-button').addClass('disable');
    $('#gap-analysis-report-button').removeClass('disable');
    $('#partnership-report-table').hide();
    $('#thematic-pillars__heading').html(gapAnalysisHeader)
  })

  $('#partnership-report-button').click(() => {
    $('#gap-analysis-report-button').addClass('disable');
    $('#partnership-report-button').removeClass('disable');
    $('#partnership-report-table').show();
    $('#thematic-pillars__heading').html(partnershipHeader)
  })
});
