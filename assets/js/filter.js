/**
* @description : Function that returns a single dropdown checkbox item
 *    Useful for adding a specific Table column's filters based on current data in the table
* @params :
 *    tableName - String with the name of the table we are creating a filter for.
 *    dropdownItemData - Object with the data item details. - { dataItem }
 *    filterCheckboxClass - String with the class name for each checkbox input for a singular column header filter
 *    columnKey - String containing the name of the current column header filter for which the checkbox inputs are
 *        being generated.
* @returns : String - html that represents a checkbox input for a specific column header */

const appendItemToFilterDropDown = function (
  tableName,
  { dataItem },
  filterCheckboxClass,
  columnHeader
  ){
  // Set the table to create a dropdown item
  switch (tableName) {
    case 'potentialPartnerships':
      return`<span class="partnership-table-filter-item">
      <label class="filter-options-checkbox-label">
           <input id="${columnHeader}" name="${dataItem}" value="${dataItem}" class="checkBox ${filterCheckboxClass}" type="checkbox">
             ${dataItem}
           </label>
        </span>`;
    case "impactFactor":
      return `<span class="impact-table-filter-item">
           <label class="filter-options-checkbox-label">
           <input id="${columnHeader}" name="${dataItem}" value="${dataItem}" class="checkBox ${filterCheckboxClass}" type="checkbox">
             ${dataItem}
           </label>
        </span>`;
    default:
      // Default item is set to the stakeholder table checkbox item
      return `<td><input name="${dataItem}" value="${dataItem}" class="checkBox" type="checkbox"/> &nbsp;${dataItem}</td>`;
  }
};

/**
 * @description : Function that creates a HTML string representing all options/checkbox items for a single column
 * @returns :  Array -  Array of html strings that each represent all checkbox/option items for a single column in the table
 */

const getItemsForFilterDropDownHtml = function(tableName, filterCheckboxClass , columnKeysMap){
  const columnFilterHtmlItems = [];
  columnKeysMap.forEach(
      (columnEntriesSet, columnKey )=>{
        let singleColumnDropdownHtml = '';
        columnEntriesSet.forEach(
            (currentDropdownItemValue)=>{
               singleColumnDropdownHtml += appendItemToFilterDropDown(
                   tableName,
                   {"dataItem": currentDropdownItemValue},
                   filterCheckboxClass,
                   columnKey
                   );
            }
        );
        columnFilterHtmlItems.push(singleColumnDropdownHtml);
      }  
  );
  return columnFilterHtmlItems;
};


/**
 * @description : Function that appends the html string of all options/checkboxes to the current DOM
 * @returns : undefined */

const appendHtmlToParentItem = function(parentItemSelector, htmlStringData){
  $(parentItemSelector).html(htmlStringData);
};


/**
 * @description : Original filter class definition
 * @returns : undefined */

class Filter {
  displayDataInDropdown(dataArray, dataId) {
    const processed = dataArray.reduce(
      (accum, dataItem, index) => {
        accum.temp += `<td><input name="${dataItem}" value="${dataItem}" class="checkBox" type="checkbox"/> &nbsp;${dataItem}</td>`;
        if (!((index + 1) % 5) || dataArray.length === index + 1) {
          accum.store.push(`\n            <tr> ${accum.temp}</tr>`);
          accum.temp = '';
        }
        return accum;
      },
      { temp: '', store: [] }
    );
    $(`${dataId} tbody`).html(processed.store.join(''));
  }
}

// Updated Table Filter Class definition
// Returns - Object

class TableFilterHeader extends Filter {
  /**
   * @classdesc : Class that returns a single instance of a the TableFilterHeader class
   * @params :
   * tableName: String - Current table the filter is created for
   * iconElementClass: String - CSS Selector string for the dropdown filter icon
   * tableData: Array - Array of all available table rows
   * tableColumnKys: Array - Array of all filter column keys
   * filterElementClassNames: Object - Object containing strings for the filter element classes i.e
   *    filterIconClass - Icon element for the dropdown filter icon
   *    filterCheckboxItemClass - Element class for all filter option/checkbox items on the tables
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
      iconElementClass,
      tableData,
      tableColumnKeys,
      filterDropdownOptionsParentSelectors,
      filterElementClassNames,
      filterColumnMapsArray,
      tablePaginatorData,
      tableNoResultsHtmlMessage,
      tableModalData,
  ){
    super();
    this.tableName = tableName || ''; //name of the table for which we have created a filter instance
    this.currentFilterName = ''; // current filter that has been selected
    this.currentCheckedFilters = new Map(); // Map object with all currently active filters
    this.previousFilteredTableResults = []; // array of current table row items
    this.allTableData = tableData; //
    this.tableColumnKeys = tableColumnKeys; // array of the necessary table columns to allow filters
    this.allTableFilters = filterColumnMapsArray;
    this.filteredTableDataResults = [];
    this.filterElementClassNames = filterElementClassNames;
    this.filterDropdownOptionsParentSelectors = filterDropdownOptionsParentSelectors;
    this.tablePaginatorData = tablePaginatorData;
    this.tableFilterMode = 'combined';
    this.tableNoResultsHtmlMessage = tableNoResultsHtmlMessage;
    this.tableModalData = tableModalData;

    tableColumnKeys.map(
        (columnItem)=>{
          this.currentCheckedFilters.set(columnItem, new Set());
        });

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
  * @description Method that returns an error message when there are no search results found for the selected filters
  * @params : None
  * @returns : undefined */

  displayNoResultsFoundErrorMessage(){
    appendHtmlToParentItem(
      this.tablePaginatorData.tableRootElementSelector,
      this.tableNoResultsHtmlMessage
    );
  }

/**
 *@description  Method that refreshes the table data when the filters are applied or cleared
  @params : None
  @returns : undefined*/

  refreshTableData(){
    this.filteredTableDataResults.length ? this.tablePaginatorData.tablePaginator.updateTableData(this.filteredTableDataResults) : this.tablePaginatorData.tablePaginator.updateTableData(this.allTableData);
    appendHtmlToParentItem(
        this.tablePaginatorData.tableRootElementSelector,
        this.tablePaginatorData.tablePaginator.initialPage()
    );
    // If the table has any modal for row clicks, recreate the event listener for the table's modal
    if(this.tableModalData){
      this.tableModalData.bindModalEventListener(this.tableModalData.currentTableModalData);
    }

  }

  /**
  * @description Method to filter by requiring all column header filters to be present in each table row
  * @params :
  *   currentSelectedDropdownItems: The set containing selected column header filter checked items
  *   currentColumnHeader: The name of the currently active column header filter
  *   columnHeaderCount: The count of the current iteration in the active column header filters
  *   totalActiveColumnHeaderFiltersCount: Number- The total number of active column header filters in the active column header filters map
  *   filteredResultSet: Set - The set of all table rows matching the active column header filters criteria
  * @returns : Set Object - Set object with the filtered table row results
  *   for the current active column header being filtered
  * */

  filterByAllActiveColumnHeaderFilters(
    currentSelectedDropdownItems,
    currentColumnHeader,
    currentActiveColumnHeaderFilterCount,
    totalActiveColumnHeaderFiltersCount,
    filteredResultsSet
  ){

    // If we have no table rows that have matched the criteria yet
    // add any row matching the current criteria
    // This is because we're starting the filtering process i.e the first active column header filter in the map
    // since it is the first column header filter, all current criteria is matching, thus the row should be added.
        if (filteredResultsSet.size === 0 && currentActiveColumnHeaderFilterCount < 2 && totalActiveColumnHeaderFiltersCount > 1) {
          // iterate over each table row item
          this.allTableData.forEach((currentTableRow)=>{
            // if the table row meets the current column header filter criteria
            if(currentSelectedDropdownItems.has(currentTableRow[currentColumnHeader])
            ){
              // add it to the filtered results to be returned
              filteredResultsSet.add(currentTableRow);
            }
          });
        }
        // If there's only one column header filter in the map then just compare the table to the criteria
        //  then return the filteredResultsSet
        else if (totalActiveColumnHeaderFiltersCount === 1) {
          // iterate over each table row item
          this.allTableData.forEach((currentTableRow)=>{
            // if the table row meets the current column header filter criteria
            if(currentSelectedDropdownItems.has(currentTableRow[currentColumnHeader])){
              // add it to the filtered results to be returned
              filteredResultsSet.add(currentTableRow);
            }
          });

          return filteredResultsSet;
        }

        // If we don't have table row items added to our filtered results so far
        // and it's the last column header filter in the map.
        // Tell the user there wasn't any matching table rows
        else if((filteredResultsSet.size === 0 && (currentActiveColumnHeaderFilterCount > 1 && currentActiveColumnHeaderFilterCount === totalActiveColumnHeaderFiltersCount))) {
          this.displayNoResultsFoundErrorMessage();
          return filteredResultsSet;
        }

        // If we have table rows added to our filtered results so far
        // and we're not yet on the last active column header filter in the map
        else if(filteredResultsSet.size !== 0 && currentActiveColumnHeaderFilterCount < totalActiveColumnHeaderFiltersCount) {
          this.allTableData.forEach((currentTableRow)=>{
            // check if currently added table rows meet the criteria in this active column header filter
            if(!currentSelectedDropdownItems.has(currentTableRow[currentColumnHeader]) && filteredResultsSet.has(currentTableRow)){
              //  remove the tableRow from the filteredResultSet
              //  if it only matched previous column header filter criteria and not the current criteria
              filteredResultsSet.delete(currentTableRow);
            }
          });

        }

        // If we have table rows added to our filtered results so far
        // and we're on the last active column header filter in the map
        else if(filteredResultsSet.size !== 0 && currentActiveColumnHeaderFilterCount === totalActiveColumnHeaderFiltersCount) {
          this.allTableData.forEach((currentTableRow)=>{
            // check if currently added table rows meet the criteria in this active column header filter
            if(!currentSelectedDropdownItems.has(currentTableRow[currentColumnHeader]) && filteredResultsSet.has(currentTableRow)){
              //  remove the tableRow from the filteredResultSet
              //  if it only matched previous column header filter criteria and not the current criteria
              filteredResultsSet.delete(currentTableRow);
            }
          });
          // If we have no matching results after comparing with the last active column header filter
          // Tell the user we couldn't find anything with the selected filter criteria
          if((filteredResultsSet.size === 0 && (currentActiveColumnHeaderFilterCount > 1 && currentActiveColumnHeaderFilterCount === totalActiveColumnHeaderFiltersCount))) {
            this.displayNoResultsFoundErrorMessage();
            return filteredResultsSet;
          }
        }

    //  return the filtered result set after the final filter criteria is compared
    return filteredResultsSet;
  }

/**
 *@description Method to return filtered table data based on ALL currently selected filters (combined) or ANY filter criteria
  @params : None
  @returns : Array - Array of table rows ready to be added to the paginator*/

  filterTableData() {
    // create final results of all filtered data
    this.previousFilteredTableResults = this.filteredTableDataResults;
    let filteredResultsSet = new Set();
    const activeFilterColumns = new Map();
    this.currentCheckedFilters.forEach((currentSelectedDropdownItemsSet, currentColumnKey)=>{
      if(currentSelectedDropdownItemsSet.size){
        activeFilterColumns.set(currentColumnKey, currentSelectedDropdownItemsSet);
      }
    });

    switch (this.tableFilterMode) {
      // Filter by ensuring all selected filter data is required for each row
      case 'combined':
        let currentActiveColumnHeaderFilterCount = 1;
        activeFilterColumns.forEach(
          (currentSelectedDropdownItems, currentColumnHeader)=>{
            filteredResultsSet = this.filterByAllActiveColumnHeaderFilters(
              currentSelectedDropdownItems,
              currentColumnHeader,
              currentActiveColumnHeaderFilterCount,
              activeFilterColumns.size,
              filteredResultsSet
            );
            currentActiveColumnHeaderFilterCount +=1;
          });
        break;

      // Filter by records matching any of the currently selected filter criteria
      case 'any':
        activeFilterColumns.forEach(
          (currentSelectedDropdownItems, currentColumnHeader)=>{
            // iterate over each table row item
            this.allTableData.forEach((currentTableRow)=>{
              // if the table row meets the current column header filter criteria
              if(currentSelectedDropdownItems.has(currentTableRow[currentColumnHeader])
              ){
                // add it to the filtered results to be returned
                filteredResultsSet.add(currentTableRow);
              }
            });
          });
        break;

      case 'singleColumnHeaderFilter':
        // returns final results of the currently selected column filter header only
        this.previousFilteredTableResults = this.filteredTableDataResults;
        filteredResultsSet = new Set();
        const currentColumnValues = this.currentCheckedFilters.get(this.currentFilterName);

        this.allTableData.forEach((currentTableRow)=>{
          if(currentColumnValues.size && currentColumnValues.has(currentTableRow[this.currentFilterName])){
            filteredResultsSet.add(currentTableRow);
          }
        });
        this.filteredTableDataResults = Array.from(filteredResultsSet);
        this.refreshTableData();
      //  Filter by combined criteria by default
      default:
        activeFilterColumns.forEach(
          (currentSelectedDropdownItems, currentColumnKey)=>{
            // If we have no table row items that have matched the criteria yet
            if (filteredResultsSet.size === 0) {
              // iterate over each table row item
              this.allTableData.forEach((currentTableRow)=>{
                // if the table row meets the current column header filter criteria
                if(currentSelectedDropdownItems.has(currentTableRow[currentColumnKey])
                ){
                  // add it to the filtered results to be returned
                  filteredResultsSet.add(currentTableRow);
                }
              });
            }
            // If we have table row items added to our filtered results so far
            else if(filteredResultsSet.size !== 0) {
              this.allTableData.forEach((currentTableRow)=>{
                // check if currently added table row items meet the criteria in the next active column header filter
                if(!currentSelectedDropdownItems.has(currentTableRow[currentColumnKey]) && filteredResultsSet.has(currentTableRow)){
                  //  remove the tableRow from the filteredResultSet
                  //  if it only matched previous column header filter criteria and not the current criteria
                  filteredResultsSet.delete(currentTableRow);
                }
              });

            }
          });
    }

    // If there are results matching the criteria return them and update the table

    if (filteredResultsSet.size) {
      this.filteredTableDataResults = Array.from(filteredResultsSet);
      this.refreshTableData();
    }

    // If there are no active filters
    if (!activeFilterColumns.size) {
      // reset the filter's table to display all table data
      this.resetFilteredTableDataResults();
      // refresh the table to display all records
      this.refreshTableData();
    }
    this.hideAllTableHeaderFilterDropdowns();
  }

/**
 *@description  Method to set the filtered table data directly
  @params : None
  @returns : undefined*/

  setFilteredTableDataResults(updatedTableData) {
    // set the filtered table data directly
    this.hideAllTableHeaderFilterDropdowns();
    this.clearAllFilters();

    if(updatedTableData){
      this.filteredTableDataResults = updatedTableData;
    }
    else{
      this.resetFilteredTableDataResults();
    }
  }

/**
 *@description Method to set the filtered table data directly
  @params : None
  @returns : undefined*/

  resetFilteredTableDataResults(){
    // reset the filtered table data to all table data originally available
    this.hideAllTableHeaderFilterDropdowns();
    this.filteredTableDataResults = [];
  }

/**
 *@description  Method that clears all active filters for the current table
  @params : None
  @returns : undefined*/

  clearAllFilters(){
    this.tableColumnKeys.map(
        (columnItem)=>{
          this.currentCheckedFilters.set(columnItem, new Set());
        });
    this.resetFilteredTableDataResults();
    this.refreshTableData();
  }

/**
 *@description Method that hides all currently viewable filters  drpodowns for the current table
  @params : None
  @returns : undefined*/

  hideAllTableHeaderFilterDropdowns(){
    const filterDropdownSubnavSelector = this.filterElementClassNames.filterDropdownSubnavSelector;
    $(filterDropdownSubnavSelector).hide();
  }

/**
 *@description  Method to handle apply filters i.e when the user clicks 'Apply Filter' button to filter the data
  @params : Event object
  @Returns : undefined
 */

  handleApplyFilters(e){
    e.data._this.filterTableData();
  }


/**
 *@description  Method to handle clearFilters event listener i.e removes all filters on current table data
  @params : Event object
  @returns : undefined*/

  handleClearFilters(e){
    e.data._this.clearAllFilters();
    $(e.data._this.filterElementClassNames.filterCheckboxItemSelector).prop("checked", false);
  }
  
/**
 *@description Method to handle the click event on any table column filter options/checkbox item
   this is where we confirm whether the current item is checked or unchecked
   we then update the currentCheckedFilters Array accordingly (remove or append a new filter)
  @params : Event object
  @returns : undefined*/

  handleClickFilterItemCheckbox(e) {
    const selectedFilterCheckbox = $(this);
    const selectedItemColumnKey = selectedFilterCheckbox.attr('id');
    const selectedItemValue = selectedFilterCheckbox.attr('value');
    // If we have just checked this item
    if(selectedFilterCheckbox.is(':checked')){
      const hasItemInCurrentFilters = e.data._this.currentCheckedFilters
          .get(selectedItemColumnKey)
          .has(selectedItemValue);

      if(!hasItemInCurrentFilters){
        e.data._this.currentCheckedFilters
            .get(selectedItemColumnKey).add(selectedItemValue);
      }
    }

    if(selectedFilterCheckbox.is(':not(:checked)')){
      const hasItemInCurrentFilters = e.data._this.currentCheckedFilters
          .get(selectedItemColumnKey)
          .has(selectedItemValue);

      if(hasItemInCurrentFilters){
        e.data._this.currentCheckedFilters
            .get(selectedItemColumnKey).delete(selectedItemValue);
      }

    }
  }

/**
 *@description  Method to handle the click event on any table column filter dropdown icon
    this is where we toggle the display of the current filter dropdown menu
    we then update the currentFilterName string accordingly to reflect the currently selected filter
    as well as toggle the visibility of the other filters
  @params : Event object
  @returns : undefined*/

  handleClickFilterDropdownIcon(e){
    const filterIconSiblingSelector = e.data._this.filterElementClassNames.filterIconSiblingSelector;
    const filterDropdownSubnavSelector = e.data._this.filterElementClassNames.filterDropdownSubnavSelector;
    const filterIconSelector = e.data._this.filterElementClassNames.filterIconSelector;

    // If the currentFilterName is not set then set the current icon as the currentFilterName
    if( e.data._this.currentFilterName === '' || typeof e.data._this.currentFilterName !== "string" ){
      $(this).siblings(filterIconSiblingSelector).find(filterDropdownSubnavSelector).slideToggle();
      e.data._this.currentFilterName = $(this).attr('name');
    }
    // If the previously set filterName and the current selected icon's name don't match,
    // Hide the previous dropdown item and show the newly selected dropdown
    else if($(this).attr('name') !== e.data._this.currentFilterName){
      $(`[name="${e.data._this.currentFilterName}"]${filterIconSelector}`)
          .siblings(filterIconSiblingSelector)
          .find(filterDropdownSubnavSelector)
          .slideUp();
      $(this).siblings(filterIconSiblingSelector).find(filterDropdownSubnavSelector).slideToggle();
      e.data._this.currentFilterName = $(this).attr('name');
    }
    // If the current and previous filter icon names are the same, just toggle the dropdown
    // no need to change the currentFilterName
    else if($(this).attr('name') === e.data._this.currentFilterName){
      $(this).siblings(filterIconSiblingSelector).find(filterDropdownSubnavSelector).slideToggle();
    }
  }

/**
 *@description  Method to create the dropdown options for each filter based on the current table data
     Appends the data to the current html page.
  @params : None
  @returns : undefined*/
  createHtmlDropdownFilterElements(){
    const filterDropdownItems = getItemsForFilterDropDownHtml(
        this.tableName,
        this.filterElementClassNames.filterCheckboxItemClass,
        this.allTableFilters
        );
     this.filterDropdownOptionsParentSelectors.map(
         (singleDropdownParentSelector, parentSelectorIndex)=>{
           appendHtmlToParentItem(singleDropdownParentSelector, filterDropdownItems[parentSelectorIndex]);
         }
     );
  };

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
      ){

    $(filterIconSelector).click(
        {_this: this},
        this.handleClickFilterDropdownIcon
    );

    $(filterCheckboxItemSelector).click({_this: this},
        this.handleClickFilterItemCheckbox
    );

    $(applyFiltersButtonSelector).click(
        {_this: this},
        this.handleApplyFilters
    );

    $(clearFiltersButtonSelector).click(
        {_this: this},
        this.handleClearFilters
    );
  }
}



