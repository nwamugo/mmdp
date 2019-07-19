createButtons = () => {
  var acc = $(".btn-accordion-table");
  acc.each(function(index, element) {
    element.addEventListener("click", e => {
      elem = e.target;
      elem.classList.toggle("active");
      var panel = elem.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  });
};
