$(document).ready(function () {
  redirectUnAuthUser('coordination-matrix.html');
  $("#header-section").load("partials/matrix-header.html", function () {
    //once header is loaded activate sidenav
    activateLogoutBtn()
    enableMenuItemContentLoad();
    changeLinkState();
  });
  $(".collapsible-header").click(function () {
    $("#dropdown__icon").toggleClass("fas fa-angle-right");
    $("#dropdown__icon").toggleClass("fas fa-angle-down");
  });
  $("#footer-section").load("partials/footer.html");
});

function loaded() {
  loadMap('state-report.html');
}

document.addEventListener("DOMContentLoaded", loaded, false);

$("#tap").load("assets/svg/tap.svg", function(statusText) {
  if (statusText == "success") {
    document.querySelectorAll("path").forEach(pointer => {
      pointer.setAttribute("fill", "green");
    });
  }
});
