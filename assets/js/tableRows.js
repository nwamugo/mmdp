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
      data["ppRowId"]
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
            <input id=${data[keys[1]].replace(/ /g, "")} data-org=${data[
      keys[1]
    ].replace(/ /g, "")} type="checkbox" name="aaaaa" class="check">
        </div>
        </label>
        <span  id="${data.id}" class="row-split gap-analysis-details">
          <div class="report-col-2"> <div>${data[keys[0]]}</div></div>
          <div class="report-col-3"><div>${data[keys[1]]}</div></div>
          <div class="report-col-4"><div>${data[keys[2]]}</div></div>
          <div class="report-col-5"><div>${data[keys[3]]}</div></div>
        </span>
        </main>
        `,
    stakeholderDirectoryTableRows: `
        <tr>
            <td class="organisation__name">
                <input id=${data[keys[0]].replace(/ /g, "")} data-org=${data[
      keys[0]
    ].replace(/ /g, "")} name="aaaaa" value="aaaaa" type="checkbox" />
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
        `
  };
  return tableRows;
};
