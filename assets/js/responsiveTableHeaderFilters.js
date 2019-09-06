
// Updated Table Filter Class definition
// Returns - Object

class ResponsiveTableFilterHeader extends TableFilterHeader {
  /**
   * @classdesc : Class that returns a single instance of a the TableFilterHeader class
   * @params :
   * tableName: String - Current table the filter is created for
   * tableData: Array - Array of all available table rows
   * tableColumnKys: Array - Array of all filter column keys
   * filterElementClassNames: Object - Object containing strings for the filter element classes i.e
   *    filterIconClass - Icon element for the dropdown filter icon
   *    filterCheckboxItemClass - Element class for all filter option/checkbox items on the tables
   *    filterCountSpanClass - Element class for all filter count elements displaying the count of the currently selected filter
   *    filterCountIconCustomClassesArray - Array of classes for all filter count elements per row. Used to position the count accordingly
   * filterColumnMapsArray: Array - Array of Maps with Sets as values (I know it's a mouthful) i.e Array of all
   *    filter dropdown data items (Set objects) for a particular column key ( the Map key)
   * tablePaginatorData - Object - Object containing current table's paginator
   *    it also has the selector for the root element of the data inserted by the paginator
   * tableNoResultsHtmlMessage - String - A HTML string that display a no results message when there are no filtered
   *    table results found
   * tableModalData: Object - Object containing the table's modal data
   *    bindModalEventListener - Function that contains the logic for adding the modal event lister for the table modal
   *    currentTableModalData - Object containing the modal data used in the event listener function
   * @returns : String - html that represents a checkbox input for a specific column header */

  constructor(
    tableName,
    tableData,
    tableColumnKeys,
    filterDropdownOptionsParentSelectors,
    filterElementClassNames,
    tablePaginatorData,
    tableNoResultsHtmlMessage,
    tableModalData
  ) {
    const allTableFilters = new Map();
    tableColumnKeys.forEach(
      (columnKey) => {
        let currentColumnEntriesSet = new Set();
        for (let tableRowIndex = 0; tableRowIndex < tableData.length; tableRowIndex++) {
          const currentFilterOption = tableData[tableRowIndex][columnKey];
            currentColumnEntriesSet.add(currentFilterOption);
          }
        allTableFilters.set(columnKey, currentColumnEntriesSet);
      }
    );
    super(
      tableName,
      tableData,
      tableColumnKeys,
      filterDropdownOptionsParentSelectors,
      filterElementClassNames,
      allTableFilters,
      tablePaginatorData,
      tableNoResultsHtmlMessage,
      tableModalData
    );
    tableColumnKeys.forEach(columnItem => {
      this.currentCheckedFilters.set(columnItem, new Set());
    });
    // Check if we added custom classes to be used on each active filter column count in a table
    if (this.filterElementClassNames.filterCountIconCustomClassesArray) {
      const filterCountClassesMap = new Map();
      let columnHeaderIndex = 0;
      // Create a new map with the column header name as the key and it's custom class as the value
      filterColumnMapsArray.forEach((columnHeaderValues, columnHeader) => {
        const currentColumnCountClass = this.filterElementClassNames.filterCountIconCustomClassesArray[columnHeaderIndex];
        filterCountClassesMap.set(columnHeader, currentColumnCountClass);
        columnHeaderIndex += 1;
      });
      this.filterCountClassesMap = filterCountClassesMap;
    }

    // Create the dropdown checkbox options for all current table columns
    this.createHtmlDropdownFilterElements();

    // Initiate all the event listeners for our filter html element classes
    this.initializeFilterElementListeners(
      this.filterElementClassNames.filterIconSelector,
      this.filterElementClassNames.filterCheckboxItemSelector,
      this.filterElementClassNames.applyFiltersButtonSelector,
      this.filterElementClassNames.clearFiltersButtonSelector
    );
  }

  /**
   *@description Method that hides all currently viewable filters  drpodowns for the current table
   @params : None
   @returns : undefined*/

  hideAllTableHeaderFilterDropdowns() {
    const singleFilterPanelSelector = this.filterElementClassNames.singleFilterPanelSelector;
    const singleFilterActiveClass = this.filterElementClassNames.singleFilterActiveClass;
    const singleFilterInactiveClass = this.filterElementClassNames.singleFilterInactiveClass;
    $(singleFilterPanelSelector).removeClass(singleFilterActiveClass).addClass(singleFilterInactiveClass);
  }

  /**
   *@description Method to handle the click event on any table column filter options/checkbox item
   this is where we confirm whether the current item is checked or unchecked
   we then update the currentCheckedFilters Array accordingly (remove or append a new filter)
   @params : Event object
   @returns : undefined*/

  handleClickFilterItemCheckbox(e) {
    e.data._this.checkboxTouched = true;
    const selectedFilterCheckbox = $(this);
    const selectedItemColumnKey = selectedFilterCheckbox.attr("id");
    let selectedItemValue = selectedFilterCheckbox.attr("value");
    selectedItemValue = parseInt(selectedItemValue) || selectedItemValue;
    // If we have just checked this item
    if (selectedFilterCheckbox.is(":checked")) {
      const hasItemInCurrentFilters = e.data._this.currentCheckedFilters
        .get(selectedItemColumnKey)
        .has(selectedItemValue);

      if (!hasItemInCurrentFilters) {
        e.data._this.currentCheckedFilters
          .get(selectedItemColumnKey)
          .add(selectedItemValue);
      }
    }

    if (selectedFilterCheckbox.is(":not(:checked)")) {
      const hasItemInCurrentFilters = e.data._this.currentCheckedFilters
        .get(selectedItemColumnKey)
        .has(selectedItemValue);

      if (hasItemInCurrentFilters) {
        e.data._this.currentCheckedFilters
          .get(selectedItemColumnKey)
          .delete(selectedItemValue);
      }
    }
  }

  /**
   *@description  Method to handle the click event on any single table column filter dropdown icon
   this is where we toggle the display of the current filter dropdown menu
   we then update the currentFilterName string accordingly to reflect the currently selected filter
   as well as toggle the visibility of the other filters
   @params : Event object
   @returns : undefined*/

  handleClickSingleFilterButton(e) {
    const singleFilterPanelSelector =
      e.data._this.filterElementClassNames.singleFilterPanelSelector;
    const singleFilterActiveClass = e.data._this.filterElementClassNames.singleFilterActiveClass;
    const singleFilterInactiveClass = e.data._this.filterElementClassNames.singleFilterInactiveClass;
    // If the currentFilterName is not set then set the current icon as the currentFilterName
    if (
      e.data._this.currentFilterName === "" ||
      typeof e.data._this.currentFilterName !== "string"
    ) {
      $(this)
        .parent()
        .find(singleFilterPanelSelector)
        .toggleClass(singleFilterInactiveClass).toggleClass(singleFilterActiveClass);
      e.data._this.currentFilterName = $(this).attr("name");
      e.data._this.lastRecordedFilterName = e.data._this.currentFilterName;
    }
    // If the previously set filterName and the current selected icon's name don't match,
    // Hide the previous dropdown item and show the newly selected dropdown
    else if ($(this).attr("name") !== e.data._this.currentFilterName) {
      $(this)
        .parent()
        .find(singleFilterPanelSelector)
        .toggleClass(singleFilterInactiveClass).toggleClass(singleFilterActiveClass);
        e.data._this.lastRecordedFilterName = e.data._this.currentFilterName;
        e.data._this.currentFilterName = $(this).attr("name");
        if (e.data._this.checkboxTouched) {
          e.data._this.filterTableData();
      }
    }
    // If the current and previous filter icon names are the same, just toggle the dropdown
    // no need to change the currentFilterName
    else if ($(this).attr("name") === e.data._this.currentFilterName) {
      e.data._this.lastRecordedFilterName = e.data._this.currentFilterName;
      if (e.data._this.checkboxTouched) {
        e.data._this.filterTableData();
      } else if (!e.data._this.checkboxTouched) {
        $(this)
        .parent()
        .find(singleFilterPanelSelector)
        .toggleClass(singleFilterInactiveClass).toggleClass(singleFilterActiveClass);
      }
    }
  }

  /**
   *@description  Method to handle the click event on the main accordion button of filters
   this is where we toggle the display of the filter panel menu
   we then update the currentFilterName string accordingly to reflect the currently selected filter
   as well as toggle the visibility of the other filters
   @params : Event object
   @returns : undefined*/

  handleClickFilterAccordionButton(e) {
    const tableFiltersPanelSelector =
      e.data._this.filterElementClassNames.tableFiltersPanelSelector;
    $(this)
      .parent()
      .find(tableFiltersPanelSelector)
      .slideToggle();
  }

  /**
   *@description  Method to initialize all event listeners for our filter instance.
   this is where we add listeners to our filter dropdown icons, filter checkbox items etc.
   @params :
   filterIconSelector - String - CSS selector string of the dropdown icon class for the table
   filterCheckboxItemSelector - String - CSS selector string of the options/checkboxes for the table
   applyFiltersButtonSelector - CSS selector string for the apply filter buttons of each filter
   clearFiltersButtonSelector - CSS selector string for the clear filter buttons of each filter
   @returns : undefined*/
  initializeFilterElementListeners(
    filterIconSelector,
    filterCheckboxItemSelector,
    applyFiltersButtonSelector,
    clearFiltersButtonSelector
  ) {
    $(filterIconSelector).off('click')
    $(filterIconSelector).click(
      { _this: this },
      this.handleClickFilterAccordionButton
    );
    $(this.filterElementClassNames.singleFilterButtonSelector).off('click')

    $(this.filterElementClassNames.singleFilterButtonSelector).click(
      { _this: this },
      this.handleClickSingleFilterButton
    );
    $(filterCheckboxItemSelector).off('click')
    $(filterCheckboxItemSelector).click(
      { _this: this },
      this.handleClickFilterItemCheckbox
    );
    $(applyFiltersButtonSelector).off('click')
    $(applyFiltersButtonSelector).click(
      { _this: this },
      this.handleApplyFilters
    );
    $(clearFiltersButtonSelector).off('click')
    $(clearFiltersButtonSelector).click(
      { _this: this },
      this.handleClearFilters
    );
  }
}
