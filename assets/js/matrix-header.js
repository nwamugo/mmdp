$(document).ready(function () {
  redirectUnAuthUser('/coordination-matrix.html');
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
  $("#reportBtn").click(function () {
    window.location.href = `http://${locationUrl}/report.html`;
  })
});
