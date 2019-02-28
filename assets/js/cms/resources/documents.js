(function () {
  cmsLoad = function () {
    registerEventHandlers();
    fetchDocs();
  };

  function registerEventHandlers() {
    const searchForm = $('#docs_search_form');
    const searchInput = $('#docs_input');

    searchInput.keyup(function () {
      const search = searchInput.val();
      if (!search) {
        fetchDocs(1, search);
      }
    });

    searchForm.submit(function (event) {
      event.preventDefault();
      const search = searchInput.val();
      if (search) {
        fetchDocs(1, search);
      }
    })
  }

  function fetchDocs(page = 1, search = '') {
    const params = formatObjectToParams({page: page, title: search});
    client(`resources/repository/document?${params}`)
      .then((res) => {
        res.json().then((res) => {
          render(res.data);
          scrollToTop();
        }).catch((err) => console.log(err));
      })
  }

  function render(data) {
    renderDocuments(data.documents);
    renderPagination(data.pagination);
    scrollToTop();
  }

  function renderDocuments(documents) {
    let docs = '';
    if (documents && documents.length) {
      documents && documents.forEach((doc) => {
        docs += `<div class="research-content__card">
           <div class="research-content__details">
             <p class="research-content__essentials">${doc.title}</p>
             <p class="research-content__date-published">Published: ${formatDate(new Date(doc.created_at))}</p>
           </div>
           <div class="research-content__downloading">
             <a href='${doc.document.url}' target="_blank" download><span class="research-content__download">Download</span></a>
           </div>
           <div class="row research-content__devider">
             <hr class="content-devider">
           </div>
         </div>`;
      });
    } else {
      docs =
        `<div class="card-panel red lighten-5 pagination__no-results">
          There are no results to display.
        </div>`
    }
    $('#docs_docs').html(docs);
  }

  function renderPagination(pagination) {
    const {total, totalPages, currentPage, previous, next} = pagination;

    let markup = !total || totalPages === 1 ? '' :
      `<div class="research-content__pagination">
      <div class="pagination__page">Page</div>
      <div class="current-page square-shape">${currentPage}</div>
      <div class="pagination__total-items">
        of <span class="available_pages">${totalPages}</span>
      </div>
      <a href="#documents">
        <div class="previous-button square-shape ${previous ? '' : 'very-pale'}">
        <i class="material-icons">navigate_before</i>
        </div>
      </a>
      <a href="#documents">
        <div class="next-button square-shape ${next ? '' : 'very-pale'}">
        <i class="material-icons">navigate_next</i>
        </div>
      </a>
  </div>`;

    $('#docs_pagination').html(markup);

    registerPaginationEventHandlers(previous, next);
  }

  function registerPaginationEventHandlers(previous, next) {
    $('.previous-button').click(function () {
      fetchDocs(previous);
    });

    $('.next-button').click(function () {
      fetchDocs(next);
    });
  }
})();
