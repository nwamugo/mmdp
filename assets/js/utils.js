// PAGE SECTIONS LOADING LOGIC

/*
Call this method on your page to enable loading of content when sidebar
menu items are clicked.
 */
function enableMenuItemContentLoad() {
  // ensure that when a link is clicked its content is loaded
  $('.side-links a').click(function () {
    loadMenuItemContent(this);
  });

  loadCurrentPageContent();
}

/*
Load content for the current href if an hash is set.
 */
function loadCurrentPageContent() {
  if (window.location.hash) {
    const selector = 'a[href="' + window.location.hash + '"]';

    const item = $(selector).first();

    loadMenuItemContent(item);
  } else {
    /*
      ul for the sidebar on each pages include a data-main-link attribute
      with a value equal to the window.location.pathname
    */

    // get the first link to item to select respective page when no page hash is specified
    const item = $('ul[data-main-link="' + window.location.pathname + '"] .side-links a').first();
    if (item.length) {
      loadMenuItemContent(item);
    }
  }
}

/*
Load content for the current sidebar menu item.
 */
function loadMenuItemContent(item) {
  const link = $(item).attr('href');
  if (link) {
    const linkTag = link.split('#')[1];
    const target = linkTag + '.html';

    $('.menu-item-content').html('').load(target, execCmsLoad);

    activateMenuItemLink(item, linkTag);
  }
}

/*
Activate link for currently loaded sidebar item.
 */
function activateMenuItemLink(item, linkTag) {
  // remove active class from list item .side-links
  $('.side-links').removeClass('active');

  //add active class to the selected item's parent list item .side-links
  const selectedLinkLi = $(item).parent('li.side-links');
  selectedLinkLi.addClass('active');

  // submenu
  // remove active class from submenu items
  $('.collapsible-body .active').removeClass('active');
  // add active class to selected submenu item
  $(item).parent().closest('li').addClass('active');

  /* enable active link on mobile slide-out menu also */
  $('#slide-out li.side-links a[href$="' + linkTag + '"]').parent().addClass('active');
}

/*
Change header link active state dynamically
 */

function changeLinkState() {
  $(".nav-wrapper ul li a").each(function (index, el) {
    const pathName = el.pathname;

    if (window.location.pathname.includes(pathName)) {
      $(el).addClass('active');
    }
  });
}

/*
Executes the cmsLoad method if it has been defined. You should place all CMS logic you
need to be executed immediately after the page loads in a function named cmsLoad.
This method will be automatically triggered after the page content loads. If
your page does not make use the loadCurrentPageContent call your cmsLoad
method manually.
*/
function execCmsLoad() {
  if (typeof cmsLoad === 'function') {
    cmsLoad();
  }
}
