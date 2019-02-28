const cmsLoad = function () {
    registerEventHandlers();
    fetchResearch();
};

function registerEventHandlers() {
    const searchForm = $('#research_search_form');
    const searchInput = $('#research-form-input');

    searchInput.keyup(function () {
        const search = searchInput.val();
        if (!search) {
            fetchResearch(1, search);
        }
    });

    searchForm.submit(function (event) {
        event.preventDefault();
        const search = searchInput.val();
        if (search) {
            fetchResearch(1, search);
        }
    })
}

function fetchResearch(page = 1, search = '') {
    const params = formatObjectToParams({page: page, title: search});
    client(`resources/research?${params}`)
        .then((res) => {
            res.json().then((res) => {
                render(res.data);
                scrollToTop();
            }).catch((err) => console.log(err));
        })
}

function render(data) {
    renderDocuments(data.results);
    renderPagination(data);
}

function renderDocuments(results) {
    let research = '';
    if (results) {
        if (results.length) {
            results && results.forEach((doc) => {
                research += `<div class="research-content__card">
           <div class="research-content__details">
             <p class="research-content__essentials">${doc.title}</p>
             <p class="research-content__date-published">Published: ${formatDate(new Date(doc.createdAt))}</p>
           </div>
           <div class="research-content__downloading">
             <a href='${doc.researchFile.url}' target="_blank" download><span class="research-content__download">Download</span></a>
           </div>
           <div class="row research-content__devider">
             <hr class="content-devider">
           </div>
         </div>`;
            });
        } else {
            research =
                `<div class="card-panel red lighten-5 pagination__no-results">
          There are no results to display.
        </div>`
        }
    }
    $('#research-docs').html(research);
}

function renderPagination(pagination) {
    let markup = !pagination.total || pagination.totalPages === 1 ? '' :
        `<div class="research-content__pagination">
      <div>Page</div>
      <div class="current-page square-shape">${pagination.currentPage}</div>
      <div>
        of <span class="available_pages">${pagination.totalPages}</span>
      </div>
      <a href="#documents" onclick="fetchResearch(${pagination.previous})">
        <div class="previous-button square-shape ${pagination.previous ? '' : 'very-pale'}">
        <i class="material-icons">navigate_before</i>
        </div>
      </a>
      <a href="#documents" onclick="fetchResearch(${pagination.next})">
        <div class="next-button square-shape ${pagination.next ? '' : 'very-pale'}">
        <i class="material-icons">navigate_next</i>
        </div>
      </a>
  </div>`;
    $('#research-pagination').html(markup);
}
