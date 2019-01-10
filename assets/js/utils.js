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
    var selector = 'a[href="' + window.location.hash + '"]';

    var item = $(selector).first();

    loadMenuItemContent(item);
  }
}

/*
Load content for the current sidebar menu item.
 */
function loadMenuItemContent(item) {
  var target = $(item).attr('href').split('#')[1] + '.html';

  $('.menu-item-content').html('').load(target);

  activateMenuItemLink(item);
}

/*
Activate link for currently loaded sidebar item.
 */
function activateMenuItemLink(item) {
  // remove active class from list item .side-links
  $('.side-links').removeClass('active');
  //add active class to the selected item's parent list item .side-links
  var selectedLinkLi = $(item).parent('li.side-links');
  selectedLinkLi.addClass('active');

  /* in the case of first page load
  enable active link on mobile slide-out menu also
  use the currently active link position on the sidebar
  to determine which link on the mobile slide-out */

  var liIndex = $('.left-sidebar__navigation li').index(selectedLinkLi);
  if (liIndex > -1) {
    $(`#slide-out li.side-links:eq(${liIndex})`).addClass('active');
  }

}

/*
Change header link active state dynamically
 */

function changeLinkState () {
  $(".nav-wrapper ul li a").each(function (index, el){
    var pathName = el.pathname;

    if( window.location.pathname.includes(pathName)){
      $(el).addClass('active');
    }
  });
}
