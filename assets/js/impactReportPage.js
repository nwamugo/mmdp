/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function createImpactFactorTable(data) {
    $(document).ready(async function() {
        const keys = [
            'organization',
            'focusArea',
            'lga',
            'subtheme',
            'pillar',
            'targetCompletion',
        ];
        const impactFactorData = data;
        let selectedItems = [];
        $('#impact-factor-table').load(
            '/partials/impact-report-table.html',
            function() {
                let table = 'impactFactor';
                // Replace the impactFactorSampleData data with data from API endpoint
                window.impactFactorTableData = impactFactorData;
                const paginator = new Paginator(impactFactorData, keys, table, selectedItems);
                paginator.potentialPartnershipsTable = true;
                impactFactorTableData = paginator.initialPage();
                $('#impact-factor-data').html(impactFactorTableData);
                $('#impact-factor-mobile').html(impactFactorTableData);
                let n = 5;
                let options = '';
                while (n < 51) {
                    if (n === 10) {
                        options += `<div class="selected">${n} </div>\n`;
                    } else {
                        options += `<div class="selected">${n} </div>\n`;
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
}


