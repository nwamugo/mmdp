$(document).ready(function() {
  const keys = [
    'organisationName',
    'thematicPillars',
    'subThemes',
    'partnership',
    'location',
    'beneficiaryCount',
    'amountInvested'
  ];
  let queryURL;
  switch (window.location.pathname) {
    case '/state.html':
      queryURL = '';
      break;
    default:
      break;
  }
  
  const stakeholderDataMock = [
    {
      organisationName: '1Mary Joan Foundation',
      thematicPillars: 'PILLAR 3: Eradicating Human Trafificking',
      subThemes: 'Skill Development and Employability',
      partnership: 'CoNGOs',
      location: 'Ovia North East, Orego & Egor',
      beneficiaryCount: '678',
      amountInvested: '6,100,000.00'
    },
    {
      organisationName: 'Forum of Nigeria Women in Politics(FONWIP)',
      thematicPillars: 'PILLAR 3: Eradicating Human Trafificking2',
      subThemes: 'Skill Development and Employability',
      partnership: 'CoNGOs',
      location: 'Ovia North East, Orego & Egor',
      beneficiaryCount: '678',
      amountInvested: '6,200,000.00'
    },
    {
      organisationName: 'Mary Joan Foundation',
      thematicPillars: 'PILLAR 3: Eradicating Human Trafificking',
      subThemes: '3Skill Development and Employability',
      partnership: 'CoNGOs',
      location: 'Ovia North East, Orego & Egor',
      beneficiaryCount: '678',
      amountInvested: '6,600,000.00'
    }
  ];

  function createTableRow(data) {
    return `
        <tr>
            <td class="organisation__name">
                <input name="aaaaa" value="aaaaa" type="checkbox" /> 
                <div>${data[keys[0]]}</div>
            </td>
            <td>${data[keys[1]]}</td>
            <td>${data[keys[2]]}</td>
            <td>${data[keys[3]]}</td>
            <td>${data[keys[4]]}</td>
            <td>${data[keys[5]]}</td>
            <td>${data[keys[6]]}</td>
    </tr>
        `;
  }

  $('#stakeholder-directory-table').load(
    '/partials/stakeholder-directory-table.html',
    function() {
      const rows = stakeholderDataMock.map(stakeholder =>
        createTableRow(stakeholder)
      );
      $('tbody.table__body').html(rows);
    }
  );
});
