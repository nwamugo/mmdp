(function () {
  cmsLoad = function () {
    searchEventHandlers();
    fetchAllReports();
  };

  function showDropDownArrow(elementContainer, iconElement, toggleFirstFontIconClass, toggleSecondFontIconClass) {
    $(elementContainer).click(function () {
      $(iconElement).toggleClass(toggleFirstFontIconClass);
      $(iconElement).toggleClass(toggleSecondFontIconClass);
    });
  }

  showDropDownArrow(
    "#quarterly-reports-holder",
    "#quarterly_dropdown__icon",
    "fas fa-angle-right",
    "fas fa-angle-down"
  );
  showDropDownArrow(
    "#yearly-reports-holder",
    "#yearly_dropdown__icon",
    "fas fa-angle-right",
    "fas fa-angle-down"
  );

  $(document).ready(function () {
    $('.collapsible').collapsible();
  });

  function searchEventHandlers() {
    const searchInput = $('#reports-search-input');
    const searchForm = $('#reports-search-form');

    searchInput.keyup(function () {
      const searchQuery = searchInput.val();
      if (!searchQuery) {
        fetchAllReports(1, searchQuery);
      }
    });

    searchForm.submit((e) => {
      e.preventDefault();
      const searchQuery = searchInput.val();
      if (searchQuery) {
        fetchAllReports(1, searchQuery);
      }
    })

  }

  function fetchAllReports(page = 1, search = "") {
    fetchReports("resources/reports/annual", "#yearlyReports", page, search);
    fetchReports("resources/reports/quarterly", "#quarterlyReports", page, search);
  }

  function fetchReports(url, elementId, page = 1, search = '') {
    client(`${url}?${formatObjectToParams({page: page, title: search})}`)
      .then((res) => {
        res.json().then((res) => {
          const {pagination, reports} = res.data
          render(reports, elementId, url, pagination);
          scrollToTop();
        }).catch((err) => console.log(err));
      })
  }

  function renderPagination(pagination) {
    const {currentPage, totalPages, previous, next} = pagination;

    let paginationHtml = '';
    if (pagination) {
      paginationHtml =
        `<div class="research-content__pagination">
				<div>Page</div>
				<div class="current-page square-shape">${currentPage}</div>
				<div class="">
					of <span class="available_pages">${totalPages}</span>
		          </div>
				<div class="previous-button square-shape ${previous ? '' : 'very-pale'}">
						<i class="material-icons">navigate_before</i>
				</div>
				<div class="previous-button square-shape next-report ${next ? '' : 'very-pale'}">
						<i class="material-icons">navigate_next</i>
				</div>
			</div>
		`
    }
    return paginationHtml;
  }


  function renderReports(data, reportTypeId, url, pagination) {
    let Reports = '';
    if (data && data.length) {
      data.forEach(data => {
          const {title, createdAt, reportFile} = data
          const publishedDate = createdAt
          const downloadLink = reportFile.url
          Reports += `
		<div class="research-content__details">
			<p class="research-content__essentials">${title}</p>
			<p class="research-content__date-published">Published:${formatDate(new Date(publishedDate))}</p>
		</div>
		<div class="research-content__downloading">
			<span class="research-content__download"><a href="${downloadLink}"  download target="_blank">Download</a></span>
		</div>
		<div class="row research-content__devider">
			<hr class="content-devider reports-devider">
		</div>
		</div>`
        }
      );

      if (reportTypeId === "#quarterlyReports") {
        Reports += `
					<div id="#quarterlyReportsPagination">
						${renderPagination(pagination)}
					</div>	`
      } else {
        Reports += `
					<div id="#yearlyReportsPagination">
					${renderPagination(pagination)}
					</div>	`
      }
    } else {
      Reports =
        `<div class="card-panel red lighten-5 pagination__no-results">
				There are no results to display.
       		 </div>`
    }
    document.getElementById(reportTypeId).innerHTML = Reports;

    function paginateClickHandler() {
      $('.research-content__pagination').click((e) => {
        e.stopPropagation();
        if (pagination.next && pagination.previous === false) {
          fetchReports(url, reportTypeId, pagination.next);
        } else if (pagination.previous) {
          fetchReports(url, reportTypeId, pagination.previous);
        }
      })
    }

    paginateClickHandler()
  }

  function render(data, reportTypeId, url, pagination) {
    renderReports(data, reportTypeId, url, pagination);
    renderPagination(pagination);
  }
})();
