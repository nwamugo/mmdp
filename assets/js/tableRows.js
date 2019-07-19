getTableRows = (data, keys) => {    
  tableRows = {
    potentialPartnershipsTableRows: `
    <main id="table" class="table-row body">
    <label class="input-item-checkbox">
    <input id=${data[keys[0]]} data-org=${
      data[keys[5]]
    } name="collaboration" value="collaboration" type="checkbox" class="check"/>
    </label>
    <span  pprowid="${
      data['ppRowId']
    }" class="row-split partnership-row pprow-item">
      <div class="col-2"> <div>${data[keys[0]]}</div></div>
      <div class="col-3"><div id="loading" class="focusTables">${
        data[keys[2]]
      }</div></div>
      <div class="col-4"><div>${data[keys[3]]}</div></div>
      <div class="col-5 organizations-col"><div>${data[keys[4]]}</div></div>
    </span>
    </main>
        `,
    gapAnalysisTableRows: `
        <main class="table-row body">
        <label class="report-col-1">
        <div class="check-box">
            <input id=${data[keys[1]].replace(/ /g, '')} data-org=${data[
      keys[1]
    ].replace(/ /g, '')} type="checkbox" name="aaaaa" class="check">
        </div>
        </label>
        <span class="row-split ">
          <div id="${
            data.id
          }" class="report-col-2 gap-analysis-details"> <div>${
      data[keys[0]]
    }</div></div>
          <div id="${data.id}" class="report-col-3 gap-analysis-details"><div>${
      data[keys[1]]
    }</div></div>
      ${checkLga(data, keys)}
          <div id="${data.id}" class="report-col-5 gap-analysis-details"><div>${
      data[keys[3]]
    }</div></div>
        </span>
        </main>
        `,
    stakeholderDirectoryTableRows: `
        <tr>
            <td class="organisation__name">
                <input id=${data[keys[0]].replace(/ /g, '')} data-org=${data[
      keys[0]
    ].replace(/ /g, '')} name="aaaaa" value="aaaaa" type="checkbox" />
                <div class="stakeholder__name">${data[keys[0]]}</div>
            </td>
            <td data-target="modal1" class="modal-trigger"  onClick="getSHDetails('${
              data[keys[0]]
            }')">${data[keys[1]]}</td>
            <td data-target="modal1" class="modal-trigger focusTable" onClick="getSHDetails('${
              data[keys[0]]
            }')">${data[keys[2]]}</td>
            <td data-target="modal1" class="modal-trigger" onClick="getSHDetails('${
              data[keys[0]]
            }')">${data[keys[3]]}</td>
            <td data-target="modal1" class="modal-trigger" onClick="getSHDetails('${
              data[keys[0]]
            }')" id=${data.id}>${data[keys[4]]}</td>
            <td data-target="modal1" class="modal-trigger" onClick="getSHDetails('${
              data[keys[0]]
            }')">${data[keys[5]]}</td>
            <td data-target="modal1" class="modal-trigger" onClick="getSHDetails('${
              data[keys[0]]
            }')">${data[keys[6]]}</td>
        </tr>
        `,
    impactFactorTableRows: `
        <main class="table-row body">
        <label class="report-col-1">
        <div class="check-box">
            <input
            data-org=${data[keys[0]].replace(/ /g, '')}
            type="checkbox" name="aaaaa" class="check">
        </div>
        </label>
        <span class="impact-row-split">
          <div class="impact-table-col"> <div>${data[keys[0]]}</div></div>
          <div class="impact-table-col"> <div>${data[keys[1]]}</div></div>
          <div class="impact-table-col"><div>${data[keys[2]]}</div></div>
          <div class="impact-table-col"><div>${data[keys[3]]}</div></div>
          <div class="impact-table-col thematic-pillar-col"><div>${
            data[keys[4]]
          }</div></div>
          <div class="impact-table-col target-completion-col"><div>${
            data[keys[5]]
          }</div></div>
        </span>
        </main>
        `,
    stakeholderDirMobileTable: `
    <button class="btn-accordion-table">
       <span class="title">${data[keys[0]]}</span>
       <span class="icon"><i class="fas fa-chevron-down"></i></span>
       <span class="d-flex">
         <div class="d-flex-div">Thematic Pillar(s)<br>${data[keys[1]]}</div>
         <div>Beneficiary Count<br>${data[keys[5]]}</div>
    </button>
    <div class="panel">
      <p><span class='features'>Thematic Pillar(s)</span><br>${data[keys[1]]}</p>
      <p><span class='features'>Sub-Themes</span><br>${data[keys[2]]}</p>
      <p><span class='features'>Partnership</span><br>${data[keys[3]]}</p>
      <p><span class='features'>Location</span><br>${data[keys[4]]}</p>
      <p><span class='features'>Beneficiary Count</span><br>${data[keys[5]]}</p>
      <p><span class='features'>Amount Invested</span><br>${data[keys[6]]}</p>
    </div>
    `
  };

  return tableRows;
};

const checkLga = (data, keys) => {
  if (keys.includes('LgasWithGaps')) {
    const lga = data[keys[keys.indexOf('LgasWithGaps')]];

    const lgaData = lga.split(',');
    if (lgaData.length > 6) {
      const displayLga = `<div class="report-col-4 truncate-text"><div>${lga
        .split(',')
        .slice(
          0,
          6
        )}...<button id="more" class="moreLess more">View more</button></div></div>
        <div class="report-col-4 truncate-text" style="display:none"><div>${lga}<button id= "less" class="moreLess less">View less</button></div></div>`;
      return displayLga;
    } else {
      return `<div class="report-col-4"><div>${lga}</div></div>`;
    }
  }
};
