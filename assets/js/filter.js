class Filter {
  displayDataInDropdown(dataArray, dataId){
    const processed = dataArray.reduce(
      (accum, dataItem, index) => {
        accum.temp += `<td><input name="${dataItem}" value="${dataItem}" class="checkBox" type="checkbox"/> &nbsp;${dataItem}</td>`;
        if (!((index + 1) % 5) || dataArray.length === index + 1) {
          accum.store.push(`\n            <tr> ${accum.temp}</tr>`);
          accum.temp = "";
        }
        return accum;
      },
      { temp: "", store: [] }
    );
    $(`${dataId} tbody`).html(processed.store.join(""));
  };
}
