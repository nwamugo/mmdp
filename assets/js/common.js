$(document).ready(function () {
  $("#header-section").load("/partials/header.html", function () {
    //once header is loaded activate sidenav
    $(".sidenav").sidenav();
    $(".collapsible").collapsible();
    enableMenuItemContentLoad();
    changeLinkState();
  });
  $(".collapsible-header").click(function () {
    $("#dropdown__icon").toggleClass("fas fa-angle-right");
    $("#dropdown__icon").toggleClass("fas fa-angle-down");
  });
  $("#footer-section").load("/partials/footer.html");
});
