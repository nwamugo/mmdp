var STAKEHOLDERS = [];
var PAGINATION_INFO = {};
var SEARCH_INPUT_VALUE = "";
var SELECTED_STATE = "";
var SELECTED_LG = "";

cmsLoad = function() {
  refreshFilters();
  fetchData();
};

function fetchData(page = 1, search = "", perPage = 9) {
  client(
    `stakeholders-directory?page=${page}&organisationName=${search}&perPage=${perPage}`
  )
    .then(res => res.json())
    .then(data => {
      STAKEHOLDERS = data.data;
      PAGINATION_INFO = data.pagination;
      displayData(STAKEHOLDERS);
      displayPaginationBtn(PAGINATION_INFO);
      registerEventHandlers();
    })
    .catch(err => {
      throw err;
    });
}

function selectState() {
  SELECTED_LG = "";
  SELECTED_STATE = $("#state-dropdown").val();

  populateLG(SELECTED_STATE);
  displayData(STAKEHOLDERS);
}

function selectLG() {
  SELECTED_LG = $("#lg-dropdown").val();
  displayData(STAKEHOLDERS);
}

function populateLG(state = "") {
  var options = '<option selected disabled value="">Local Government</option>';
  if (state) {
    NigerianStates.find(({ state: foundState }) => {
      return foundState.name === state;
    }).state.locals.forEach(lg => {
      options += `<option value="${lg.name}">${lg.name}</option>`;
    });
  }
  $("select#lg-dropdown").html(options);
}

function populateStates() {
  var options = '<option selected disabled value="">State</option>';
  NigerianStates.forEach(({ state }) => {
    options += `<option value="${state.name}">${state.name}</option>`;
  });
  $("select#state-dropdown").html(options);
}

function nextPage() {
  if (!PAGINATION_INFO.next) return;
  fetchData(PAGINATION_INFO.next, SEARCH_INPUT_VALUE);
}

function prevPage() {
  if (!PAGINATION_INFO.previous) return;
  fetchData(PAGINATION_INFO.previous, SEARCH_INPUT_VALUE);
}

function findMatch(beneficiaryService) {
  var found = false;
  const filterCommunities = beneficiaryService.map(item => item.communities[0]);
  filterCommunities.map(item => {
    if (
      item.stateId.stateName === SELECTED_STATE ||
      item.lgaId.lgaName === SELECTED_LG
    ) {
      found = true;
    }
  });

  return found;
}

function getContent(data) {
  var stakeholders = Array.isArray(data) ? data.slice(0) : [];
  if (SELECTED_STATE && SELECTED_LG) {
    stakeholders = data.filter(filterData => {
      return findMatch(filterData.beneficiaries);
    });
  }

  var size = Math.ceil(stakeholders.length / 3);
  return new Array(size).fill([]).map(_ => {
    var newData = stakeholders.splice(3);
    var splicedData = stakeholders;
    stakeholders = newData;
    return splicedData;
  });
}

function displayData(data) {
  var content = getContent(data);

  var noContent = `<div class="card-panel red lighten-5 pagination__no-results">
          There are no results to display.
        </div>`;

  if (!content.length) {
    $("div#stakeholders").html(noContent);
    return;
  }

  var stakeholdersHtml = "";
  var stakeholderHtml = "";

  content.forEach(stakeholders => {
    stakeholders.forEach(stakeholder => {
      var add = "";
      stakeholder.adresses.forEach(address => {
        add = address.address;
        addType = address.addressType;
      });
      stakeholderHtml += `
        <div class="state-government stakeholders-info col m3 col s12">
          <p class="stakeholder-title">${stakeholder.organisationName}</p>
          <p class="stakeholder-address">${add}<br/>
            ${addType}
            </p>
          <p class="stakeholder-address__details">
            ${stakeholder.phoneNumber} <br/>
          </p>
        </div>
      `;
    });
    stakeholdersHtml += `
      <div class="row edo-governments">
        ${stakeholderHtml}
      </div>
    `;
    stakeholderHtml = "";
  });
  $("div#stakeholders").html(stakeholdersHtml);
}

function displayPaginationBtn(data) {
  var controlBtn = `
    <div>Page</div>
    <div class="square-shape current-page">
      ${data.currentPage}
    </div>
    <div class="">
      of ${data.totalPages} 
    </div>
    <div 
      class="previous-button square-shape ${!data.previous ? "very-pale" : ""}">
      <i class="material-icons">navigate_before</i>
    </div>
    <div 
      class="next-button square-shape ${!data.next ? "very-pale" : ""}">
      <i class="material-icons">navigate_next</i>
    </div>
  `;
  $("div#pagination-control").html(controlBtn);
}

function refreshFilters() {
  SELECTED_LG = "";
  SELECTED_STATE = "";
  populateStates();
  populateLG();
}

function search() {
  SEARCH_INPUT_VALUE = $("input#stakeholder-search")
    .val()
    .trim();
  refreshFilters();
  fetchData(1, SEARCH_INPUT_VALUE);
}

function registerEventHandlers() {
  $(".previous-button").click(function() {
    prevPage();
  });

  $(".next-button").click(function() {
    nextPage();
  });

  $("#btn-search").click(function() {
    search();
  });
}
