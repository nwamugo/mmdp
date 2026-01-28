$(document).ready(function() {
  $("#header-section").load("partials/matrix-header.html", function() {
    //once header is loaded activate sidenav
    activateLogoutBtn()
  });
  $("#footer-section").load("partials/footer.html");
});
