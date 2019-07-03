(function() {
  const baseURL = `${baseUrl}/events`;

  fetch(baseURL, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(response => {
      let slideHtml = '';
      const chunk_size = 2;
      const slide_groups = response.data
        .map(function(e, i) {
          return i % chunk_size === 0
            ? response.data.slice(i, i + chunk_size)
            : null;
        })
        .filter(function(e) {
          return e;
        });

      slide_groups.slice(0, 4).map(item => {
        if (item.length === 1) {
          slideHtml += `
          <div class="Slides_show">
            <div class="allSlides">
              <div class="prev">
              <img src="assets/images/index/group-4-copy-2.png"
              srcset="assets/images/index/group-4-copy-3@2x.png 2x, assets/images/group-4-copy-3@3x.png 3x"
              alt="arrow for next event" onclick="plusSlides(-1)" class="plusSlides">
              </div>
                <div class="fade">
                  <div class="event_slide_card">
                  <img src="${item[0].headerImage.url}" />
                    <div class="event_slide_card_description">
                      <div class="event-description__rectangle_blue"></div>
                      <div class="card-content">
                        <p class="justifying-the-mmdp">${item[0].title}</p>
                        <h6 class="event_date">${new Date(
                          item[0].eventDate
                        ).toDateString()}</h6>
                        <div class="events-card__desc-body brief-description">
                        ${item[0].details}
                        </div>
                        <br />
                        <p class="event-description-left__continue-reading">
                          <a href="event-info.html?id=${
                            item[0]._id
                          }"> Continue Reading &nbsp <i class="fas fa-arrow-right"></i></a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>`;
        } else {
          slideHtml += `
        <div class="Slides_show">
          <div class="allSlides">
            <div class="prev">
            <img src="assets/images/index/group-4-copy-2.png"
            srcset="assets/images/index/group-4-copy-3@2x.png 2x, assets/images/group-4-copy-3@3x.png 3x"
            alt="arrow for next event" onclick="plusSlides(-1)" class="plusSlides">
            </div>
              <div class="fade">
                <div class="event_slide_card">
                <img src="${item[0].headerImage.url}" />
                  <div class="event_slide_card_description">
                    <div class="event-description__rectangle_blue"></div>
                    <div class="card-content">
                      <p class="justifying-the-mmdp">${item[0].title}</p>
                      <h6 class="event_date">${new Date(
                        item[0].eventDate
                      ).toDateString()}</h6>
                      <div class="events-card__desc-body brief-description">
                      ${item[0].details}
                      </div>
                      <br />
                      <p class="event-description-left__continue-reading">
                        <a href="event-info.html?id=${
                          item[0]._id
                        }"> Continue Reading &nbsp <i class="fas fa-arrow-right"></i></a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="fade">
              <div class="event_slide_card">
              <img src="${item[1].headerImage.url}" />
                <div class="event_slide_card_description">
                  <div class="event-description__rectangle_blue"></div>
                  <div class="card-content">
                    <p class="justifying-the-mmdp">${item[1].title}</p>
                    <h6 class="event_date">${new Date(
                      item[1].eventDate
                    ).toDateString()}</h6>
                    <div class="events-card__desc-body brief-description">
                    ${item[1].details}
                    </div>
                    <br />
                    <p class="event-description-left__continue-reading">
                      <a href="event-info.html?id=${
                        item[1]._id
                      }"> Continue Reading &nbsp <i class="fas fa-arrow-right"></i></a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="next">
              <img src="assets/images/index/group-4-copy-2.png"
              srcset="assets/images/index/group-4-copy-2@2x.png 2x,assets/images/group-4-copy-2@3x.png 3x" class=""
              alt="arrow for next event" onclick="plusSlides(1)" class="plusSlides">
            </div>
          </div>
        </div>`;
        }
      });

      $('#slideshtml').html(slideHtml);
      let slideIndex = 0;
      showSlides(slideIndex);

      document
        .getElementsByClassName('plusSlides')
        .addEventListener('click', plusSlides(1), false);

      function plusSlides(n) {
        showSlides((slideIndex += n));
      }

      function currentSlide(n) {
        showSlides((slideIndex = n));
      }

      function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName('Slides_show');
        let dots = document.getElementsByClassName('dot');
        if (n > slides.length) {
          slideIndex = 1;
        }
        if (n < 1) {
          slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = 'none';
        }
        if (slideIndex > slides.length) {
          slideIndex = 1;
        }
        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(' active', '');
        }
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].className += ' active';
      }
    })
    .catch(error => {
      throw error;
    });
})();
