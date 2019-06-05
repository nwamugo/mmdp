class Filter {
  // display data in the location dropdown
  displayDataInDropdown(dataArray) {
    let newArray = [];
    let i,
      j,
      tempArray = [],
      chunk = 5;
    // split result array into 5 row cells to be displayed on table
    for (i = 0, j = dataArray.length; i < j; i += chunk) {
      tempArray = dataArray.slice(i, i + chunk);
      newArray.push(tempArray);
    }

    newArray.map(itemArray => {
      let arrayValue = "";
      let checkBox = "";
      let tableRow = `
          <tr> `;
      for (let i = 0; i < itemArray.length; i++) {
        arrayValue = itemArray[i];
        checkBox = `<input name="${arrayValue}" value="${arrayValue}" class="checkBox" type="checkbox"/> `;
        tableRow += `<td>${
          itemArray[i] ? checkBox + `&nbsp;` + itemArray[i] : ""
        }</td>`;
      }
      tableRow += `</tr>`;
      $("#data tbody").append(tableRow);
    });
  };
}
