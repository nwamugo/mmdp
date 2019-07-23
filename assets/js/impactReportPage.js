$(document).ready(async function() {
  const keys = [
      "organization",
    "focusArea",
    "lga",
    "subtheme",
    "pillar",
    "targetCompletion",
  ];

  // Replace the impactFactorSampleData data with data from API endpoint
  const impactFactorSampleData = [
    {
      "organization": "Misfits Global",
      "focusArea": "Academic Excellence",
      "lga": "Akoko-Edo",
      "subtheme": "Awareness and Education",
      "pillar": "Pillar 1",
      "targetCompletion": "49%" ,
    },
    {
      "organization": "Goethe Global",
      "focusArea": "Academic Excellence",
      "lga": "Akoko-Edo",
      "subtheme": "Awareness and Education",
      "pillar": "Pillar 1",
      "targetCompletion": "3%" ,
    },
    {
      "organization": "Grow Africa Global",
      "focusArea": "Academic Excellence",
      "lga": "Akoko-Edo",
      "subtheme": "Awareness and Education",
      "pillar": "Pillar 1",
      "targetCompletion": "60%" ,
    },
    {
      "organization": "Grow Africa Global",
      "focusArea": "Academic Excellence",
      "lga": "Ovia South-East",
      "subtheme": "Awareness and Education",
      "pillar": "Pillar 1",
      "targetCompletion": "12%" ,
    },
    {
      "organization": "Misfits Global",
      "focusArea": "Academic Excellence, Educated Citizenship, Advanced Technological development",
      "lga": "Akoko-Edo",
      "subtheme": "Awareness and Education via Training and Workshop Sessions",
      "pillar": "Pillar 1",
      "targetCompletion": "49%" ,
    },
    {
      "organization": "Goethe Global",
      "focusArea": "Academic Excellence",
      "lga": "Akoko-Edo",
      "subtheme": "Awareness and Education via Training and Workshop Sessions",
      "pillar": "Pillar 1",
      "targetCompletion": "3%" ,
    },
    {
      "organization": "Grow Africa Global",
      "focusArea": "Structural Excellence, Modern Citizenship, Advanced Technological Investment",
      "lga": "Akoko-Edo",
      "subtheme": "Infrastructure Expansion",
      "pillar": "Pillar 2",
      "targetCompletion": "60%" ,
    },
    {
      "organization": "Grow Africa Global",
      "focusArea": "Academic Excellence",
      "lga": "Ovia South-East",
      "subtheme": "Awareness and Education",
      "pillar": "Pillar 1",
      "targetCompletion": "17.98%" ,
    }

  ];

  let selectedItems = [];

  $('#impact-factor-table').load(
      '/partials/impact-report-table.html',
      function() {

        let impactFactorReport = [];

        let table = 'impactFactor';

        // Replace the impactFactorSampleData data with data from API endpoint
        window.impactFactorTableData = impactFactorSampleData;

        const paginator = new Paginator(impactFactorSampleData, keys, table, selectedItems);
        paginator.potentialPartnershipsTable = true;
        impactFactorTableData = paginator.initialPage();

        $('#impact-factor-data').html(impactFactorTableData);
        $('#impact-factor-mobile').html(impactFactorTableData);
        let n = 5;
        let options = '';
        while (n < 51) {
          if (n === 10) {
            options += `<div class="selected">${n}</div>\n`;
          } else {
            options += `<div class="selected">${n}</div>\n`;
          }
          n += 5;
        }
        $('.impact-factor-dropdown-trigger').dropdown();
        $('#impact-factor-entries-per-page').html(options);

        $('.selected').click(function() {
          const text = $(this).text();
          $('#impact-factor-row-number').text(text);
          paginator.entriesPerPage = $('#impact-factor-row-number').text();
          paginator.refreshTableBody();
        });
        $('#impact-factor-next-page').click(function() {
          paginator.nextPage();
        });
        $('#impact-factor-previous-page').click(function() {
          paginator.previousPage();
        });
      }
  );
});
