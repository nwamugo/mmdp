function loaded() {
  loadMap('state.html');
}

document.addEventListener("DOMContentLoaded", loaded, false);

$("#tap").load("assets/svg/tap.svg", function(statusText) {
  if (statusText == "success") {
    document.querySelectorAll("path").forEach(pointer => {
      pointer.setAttribute("fill", "green");
    });
  }
});
