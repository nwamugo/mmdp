$(document).ready(async function() {
  $('#gap-analysis-report-button').click(() => {
    $('#partnership-report-button').addClass('disable');
    $('#gap-analysis-report-button').removeClass('disable');
    $('#partnership-report-table').hide();
  })

  $('#partnership-report-button').click(() => {
    $('#gap-analysis-report-button').addClass('disable');
    $('#partnership-report-button').removeClass('disable');
    $('#partnership-report-table').show();
  })
});
