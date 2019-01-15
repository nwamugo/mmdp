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

/* Add a line break to pillar text after a certain number of characters
*/

function addLineBreak (pillar, char_length) {
  var html = $(pillar).html();
  html = html.substring(0, char_length) + "<br>" + html.substring(char_length);
  $(pillar).html(html);
}
/*
Pillar titles
*/

addLineBreak("#pillar_one", 56)
addLineBreak("#pillar_two", 54)
addLineBreak("#pillar_three", 48)
addLineBreak("#pillar_four", 67)





