// Retrieve pillar one

function cmsLoad() {
  loadPillarFour();
}

function loadPillarFour() {
  client(`pillars/pillar-number/4`)
    .then(res => res.json())
    .then(data => {
      const pillar = data.pillar;
      let pillarFour = pillar[pillar.length - 1];

      let pillarOutput = `
            <div class="thematic-pillar__heading-area">
              <h2 class="heading-title--1 thematic-pillar__heading-title">${
                pillarFour.title
              }</h2>
            </div>
            <h4 class="sub-heading--1">
              Introduction
            </h4>
            <p class="content-text--1">
              ${pillarFour.introduction}
            </p>
        
            <div class="row thematic-pillar__image-area">
              <div class="col">
                <img class="thematic-pillar__image" src="${
                  pillarFour.image1.url
                }" alt="airline arrival">
              </div>
              <div class="col">
                <img class="thematic-pillar__image" src="${
                  pillarFour.image2.url
                }" alt="airplane">
              </div>
            </div>
        
            <h4 class="sub-heading--1">
              What we are doing
            </h4>
            <p class="content-text--1">
              ${pillarFour.whatWeAreDoing}
            </p>
        
            <h4 class="sub-heading--1">
              Key Activities
            </h4>
            <ul class="thematic-pillar__list">
              ${pillarFour.keyActivities}
            </ul>

            `;
      $("#pillar-four").html(pillarOutput);
    });
}
