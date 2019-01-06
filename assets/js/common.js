$(document).ready(function(){
  $( "#header-section" ).load( "/partials/header.html", function () {
    //once header is loaded activate sidenav
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    enableMenuItemContentLoad();
    changeLinkState();
  } );
  $( "#footer-section" ).load( "/partials/footer.html" );
});
