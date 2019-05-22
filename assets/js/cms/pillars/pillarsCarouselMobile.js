(function () {
      let slideIndex = 1;
      showPillarSlides(slideIndex);

      function plusPillarSlides(n) {
        showPillarSlides(slideIndex += n);
      }

      function currentPillarSlide(n) {
        showPillarSlides(slideIndex = n);
      }

      function showPillarSlides(n) {
        let i;
        let slides = document.getElementsByClassName("pillar_slides_show");
        let dots = document.getElementsByClassName("pillar_dot");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active1", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active1";
        setTimeout(showPillarSlides, 3000);
      }

})();
