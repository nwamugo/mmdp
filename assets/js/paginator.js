class Paginator {
  constructor(data, columnKeys) {
    this.data = data;
    this.currentPage = 1;
    this.entriesPerPage = 10;
    this.totalPage = this.getTotalPage();
    this.columnKeys = columnKeys;
  }

  getTotalPage = () => {
    const tp =
      this.data.length % this.entriesPerPage
        ? 1 + this.data.length / this.entriesPerPage
        : this.data.length / this.entriesPerPage;
    return Math.floor(tp);
  };

  nextPage = () => {
    const currentIndex = this.entriesPerPage * this.currentPage;
    const nextIndex = (this.currentPage + 1) * this.entriesPerPage;
    if (currentIndex < this.data.length) {
      const paginatedData = this.data.slice(currentIndex, nextIndex);
      const rows = this.createTableRows(paginatedData);
      this.createTableBody(rows);
      this.currentPage++;
      this.updatePageOf();
      return rows;
    }
  };

  initialPage = () => {
    const paginatedData = this.data.slice(0, 10);
    const rows = this.createTableRows(paginatedData);
    this.createTableBody(rows);
    this.updatePageOf();
    return rows;
  };

  currentPageData = () => {
    const endIndex = this.currentPage * this.entriesPerPage;
    const startIndex = endIndex - this.entriesPerPage;
    return this.data.slice(startIndex, endIndex);
  };

  refreshTableBody = () => {
    this.createTableBody(this.createTableRows(this.currentPageData()));
    this.updatePageOf();
  };

  previousPage = () => {
    const currentIndex = this.entriesPerPage * this.currentPage;
    const endIndex = currentIndex - this.entriesPerPage;
    const startIndex = endIndex - this.entriesPerPage;
    if (this.currentPage > 1) {
      const paginatedData = this.data.slice(startIndex, endIndex);
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
          <tr data-target="modal1" onClick="getSHDetails('${
            data[keys[0]]
          }')" class="modal-trigger">
              <td class="organisation__name">
                  <input name="aaaaa" value="aaaaa" type="checkbox" /> 
                  <div class="stakeholder__name">${data[keys[0]]}</div>
              </td>
              <td>${data[keys[1]]}</td>
              <td>${data[keys[2]]}</td>
              <td>${data[keys[3]]}</td>
              <td>${data[keys[4]]}</td>
              <td>${data[keys[5]]}</td>
              <td>${data[keys[6]]}</td>
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
  };

  updatePageOf = () => {
    const currentPage = this.currentPage;
    const totalPage = this.getTotalPage();
    if (currentPage > totalPage) {
      this.currentPage = 1;
      this.refreshTableBody();
      return;
    }
    $('#current-page').html(currentPage);
    $('#total-page').html(totalPage);
    currentPage === 1
      ? $('#previous-page').removeClass('active__nav')
      : $('#previous-page').addClass('active__nav');
    currentPage === totalPage
      ? $('#next-page').removeClass('active__nav')
      : $('#next-page').addClass('active__nav');
  };
}
