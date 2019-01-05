
$(document).ready(function(){
  $('.sidenav').sidenav();
});

// Or with jQuery

$('.dropdown-trigger').dropdown();

const links = document.querySelectorAll(".link");
links.forEach(link => {
  link.addEventListener('click', () => {
    let target = link.href.match(/#.*$/);
    let div = document.querySelector(target);
    c =document.querySelectorAll(".menu-item")
    document.querySelectorAll(".menu-item").forEach(
      (item) => item.classList.remove("active")
    );
    div.classList.add("active");
  });
});

const div = document.getElementById("slide-out");
var btns = div.getElementsByClassName("link");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    let current = document.getElementsByClassName("active-content-sidebar");
    current[0].className = current[0].className.replace("active-content-sidebar", "");
    this.className += " active-content-sidebar";
  });
}


