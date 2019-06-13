class Paginator {
  constructor(data, columnKeys) {
    this.data = data;
    this.tempData = []
    this.currentPage = 1;
    this.entriesPerPage = 10;
    this.totalPage = this.getTotalPage();
    this.columnKeys = columnKeys;
  }

  getData = () => {
    const data = this.tempData.length ? this.tempData : this.data;
    return data
  }

  setTempData = (data=[]) => {
    this.tempData = data;
  }

  setTableTempData = (data=[]) => {
    this.setTempData(data)
    this.refreshTableBody()
  }

  getTotalPage = () => {
    const data = this.getData();
    const tp =
      data.length % this.entriesPerPage
        ? 1 + data.length / this.entriesPerPage
        : data.length / this.entriesPerPage;
    return Math.floor(tp);
  };

  nextPage = () => {
    const data = this.getData();
    const currentIndex = this.entriesPerPage * this.currentPage;
    const nextIndex = (this.currentPage + 1) * this.entriesPerPage;
    if (currentIndex < data.length) {
      const paginatedData = data.slice(currentIndex, nextIndex);
      const rows = this.createTableRows(paginatedData);
      this.createTableBody(rows);
      this.currentPage++;
      this.updatePageOf();
      return rows;
    }
  };

  initialPage = () => {
    const data = this.getData();
    const paginatedData = data.slice(0, 10);
    const rows = this.createTableRows(paginatedData);
    this.createTableBody(rows);
    this.updatePageOf();
    return rows;
  };

  currentPageData = () => {
    const data = this.getData();
    const endIndex = this.currentPage * this.entriesPerPage;
    const startIndex = endIndex - this.entriesPerPage;
    return data.slice(startIndex, endIndex);
  };

  refreshTableBody = () => {
    this.createTableBody(this.createTableRows(this.currentPageData()));
    this.updatePageOf();
  };

  previousPage = () => {
    const data = this.getData();
    const currentIndex = this.entriesPerPage * this.currentPage;
    const endIndex = currentIndex - this.entriesPerPage;
    const startIndex = endIndex - this.entriesPerPage;
    if (this.currentPage > 1) {
      const paginatedData = data.slice(startIndex, endIndex);
      const rows = this.createTableRows(paginatedData);
      this.createTableBody(rows);
      this.currentPage--;
      this.updatePageOf();
      return rows;
    }
  };

  createTableRow = data => {
    const keys = this.columnKeys;
    return `
          <tr>
              <td class="organisation__name">
                  <input id=${data[keys[0]]} data-org=${data[keys[0]].replace(
      / /g,
      "-"
    )} name="aaaaa" value="aaaaa" type="checkbox" />
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
          `;
  };

  createTableRows = paginatedData => {
    const rows = paginatedData.map(stakeholder =>
      this.createTableRow(stakeholder)
    );
    return rows;
  };

  createTableBody = rows => {
    $('tbody.table__body').html(rows);
    bindJQuery();
  };

  updatePageOf = () => {
    const currentPage = this.currentPage;
    const totalPage = this.getTotalPage();
    if (currentPage > totalPage) {
      this.currentPage = 1;
      this.refreshTableBody();
      return;
    }
    $("#current-page").html(currentPage);
    $("#total-page").html(totalPage);
    currentPage === 1
      ? $("#previous-page").removeClass("active__nav")
      : $("#previous-page").addClass("active__nav");
    currentPage === totalPage
      ? $("#next-page").removeClass("active__nav")
      : $("#next-page").addClass("active__nav");
  };
}
