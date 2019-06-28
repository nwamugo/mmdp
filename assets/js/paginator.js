class Paginator {
  constructor(data, columnKeys, table) {
    this.data = data;
    this.tempData = [];
    this.empData = false;
    this.currentPage = 1;
    this.entriesPerPage = 10;
    this.totalPage = this.getTotalPage();
    this.columnKeys = columnKeys;
    this.potentialPartnershipsTable = false;
    this.table = table;
  }
  getData() {
    if (this.empData) {
      return this.tempData;
    }
    const data = this.tempData.length ? this.tempData : this.data;
    return data;
  }
  setTempData(data = []) {
    this.tempData = data;
  }
  setTableTempData(data = []) {
    this.setTempData(data);
    this.refreshTableBody();
  }
  getTotalPage() {
    const data = this.getData();
    const tp =
      data.length % this.entriesPerPage
        ? 1 + data.length / this.entriesPerPage
        : data.length / this.entriesPerPage;
    return Math.floor(tp);
  }
  nextPage() {
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
  }
  initialPage() {
    const data = this.getData();
    const paginatedData = data.slice(0, 10);
    const rows = this.createTableRows(paginatedData);

    this.createTableBody(rows);
    this.updatePageOf();
    return rows;
  }
  currentPageData() {
    const data = this.getData();
    const endIndex = this.currentPage * this.entriesPerPage;
    const startIndex = endIndex - this.entriesPerPage;
    return data.slice(startIndex, endIndex);
  }
  refreshTableBody() {
    this.createTableBody(this.createTableRows(this.currentPageData()));
    this.updatePageOf();
  }
  previousPage() {
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
  }
  createTableRow(data) {
    const keys = this.columnKeys;
    let tableRow;
    let tableRowData = getTableRows(data, keys);
    if (this.potentialPartnershipsTable) {
      if (this.table === 'gapAnalysis') {
        tableRow = tableRowData.gapAnalysisTableRows;
      } else {
        tableRow = tableRowData.portentialPartnershipsTableRows;
      }
    } else {
      tableRow = tableRowData.stakeholderDirectoryTableRows;
    }
    return tableRow;
  }
  createTableRows(paginatedData) {
    const rows = paginatedData.map(stakeholder =>
      this.createTableRow(stakeholder)
    );
    return rows;
  };
  createTableBody(rows) {
    if (this.potentialPartnershipsTable) {
      if (this.table === 'gapAnalysis') {
        $('#gap-analysis-data').html(rows);
      } else {
        $('#partnership-report-data').html(rows);
      }
      
    } else {
      $('tbody.table__body').html(rows);
      bindJQuery();
    }
  }
  updatePageOf() {
    const currentPage = this.currentPage;
    const totalPage = this.getTotalPage();
    if (currentPage > totalPage) {
      this.currentPage = 1;
      this.refreshTableBody();
      return;
    }
    if (this.potentialPartnershipsTable) {
      if (this.table === 'gapAnalysis') {
        $('#gap-current-page').html(currentPage);
        $('#gap-total-page').html(totalPage);
      } 
    } else {
      $('#current-page').html(currentPage);
      $('#total-page').html(totalPage);
    }
    if (this.potentialPartnershipsTable) {
      if (this.table === 'gapAnalysis') {
        currentPage === 1
          ? $('#gap-previous-page').removeClass('active__nav')
          : $('#gap-previous-page').addClass('active__nav');
        currentPage === totalPage
          ? $('#gap-next-page').removeClass('active__nav')
          : $('#gap-next-page').addClass('active__nav');
      } 
    } else {
      currentPage === 1
        ? $('#previous-page').removeClass('active__nav')
        : $('#previous-page').addClass('active__nav');
      currentPage === totalPage
        ? $('#next-page').removeClass('active__nav')
        : $('#next-page').addClass('active__nav');
    }
  };
}
