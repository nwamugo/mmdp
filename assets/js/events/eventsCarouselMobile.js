(function () {
    const baseURL = `${baseUrl}/events`
  
    fetch(baseURL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(response => {
        let slidesmobile  = '';
        const chunk_size = 2;
        const slide_groups = response.data.map(function (e, i) {
        return i % chunk_size === 0 ? response.data.slice(i, i + chunk_size) : null;
        }).filter(function (e) { return e; });
  
        slide_groups.slice(0, 3).map((item) => {
          slidesmobile += `
                  <div class="events_slides_show_mobile">
                  <div class="allSlides">
                  <div class="prev">
                    <img src="assets/images/index/group-4-copy-2.png"
                      srcset="assets/images/index/group-4-copy-3@2x.png 2x, assets/images/group-4-copy-3@3x.png 3x"
                      alt="arrow for next event" onclick="plusEventsSlidesMobile(-1)">
                  </div>
                  <div class="fade">
                    <div class="event_slide_card">
                      <img src="${item[0].headerImage.url}" />
                      <div class="event_slide_card_description">
                        <div class="event-description__rectangle_blue"></div>
                        <div class="card-content">
                          <p class="justifying-the-mmdp">${item[0].title}</p>
                          <h6 class="event_date">${new Date(item[0].eventDate).toDateString()}</h6>
                          <div class="events-card__desc-body brief-description">
                            ${item[0].details}
                          </div>
                          <br />
                          <p class="event-description-left__continue-reading">
                            <a href="event-info.html?id=${item[0]._id}"> Continue Reading </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="next">
                    <img src="assets/images/index/group-4-copy-2.png"
                      srcset="assets/images/index/group-4-copy-2@2x.png 2x,assets/images/group-4-copy-2@3x.png 3x" class=""
                      alt="arrow for next event" onclick="plusEventsSlidesMobile(1)">
                  </div>
                  </div>
                </div>
                  `;
                });
  
        $('#slidesmobile').html(slidesmobile);
        let slideIndex = 1;
        showEventsSlidesMobile(slideIndex);
  
        function plusEventsSlidesMobile(n) {
          showEventsSlidesMobile(slideIndex += n);
        }
  
        function currentEventsSlidesMobile(n) {
          showEventsSlidesMobile(slideIndex = n);
        }
  
        function showEventsSlidesMobile(n) {
          let i;
          let slides = document.getElementsByClassName("events_slides_show_mobile");
          let dots = document.getElementsByClassName("event_dot");
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
          setTimeout(showEventsSlidesMobile, 3000);
        }
  
      })
      .catch((error) => console.log(error));
  
  })();
