getTableRows = (data, keys) => {
  tableRows = {
    portentialPartnershipsTableRows: `
        <main id="table" class="table-row body">
        <label class="col-1">
        <div>
        <input type="checkbox" name="check" class="check">
        </div>
        </label>
        <div class="col-2"> <div>${data[keys[0]]}</div></div>
        <div class="col-3"><div>${data[keys[1]]}</div></div>
        <div class="col-4"><div>${data[keys[2]]}</div></div>
        <div class="col-5"><div>${data[keys[3]]}</div></div>
        </main>
        `,
    gapAnalysisTableRows: `
        <main id="${data.id}" class="table-row body gap-analysis-details">
        <label class="report-col-1">
        <div>
        <input data-org=${data[keys[1]].replace(/ /g, '')} type="checkbox" name="aaaaa" class="check">
        </div>
        </label>
        <div class="report-col-2"> <div>${data[keys[0]]}</div></div>
        <div class="report-col-3"><div>${data[keys[1]]}</div></div>
        <div class="report-col-4"><div>${data[keys[2]]}</div></div>
        <div class="report-col-5"><div>${data[keys[3]]}</div></div>
        </main>
        `,
        stakeholderDirectoryTableRows: `
        <tr>
            <td class="organisation__name">
                <input id=${data[keys[0]]} data-org=${
              data[keys[0]].replace(/ /g, '')
            } name="aaaaa" value="aaaaa" type="checkbox" />
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
