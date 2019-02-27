// Retrieve pillar one

function cmsLoad() {
  loadPillarOne();
}

function loadPillarOne() {
  client(`pillars/pillar-number/1`)
    .then(res => res.json())
    .then(data => {
      let pillarOne = data.pillar[0];

      let pillarOutput = `
            <div class="thematic-pillar__heading-area">
              <h2 class="heading-title--1 thematic-pillar__heading-title">${
                pillarOne.title
              }</h2>
            </div>
            <h4 class="sub-heading--1">
              Introduction
            </h4>
            <p class="content-text--1">
              ${pillarOne.introduction}
            </p>
        
            <div class="row thematic-pillar__image-area">
              <div class="col">
                <img class="thematic-pillar__image" src="${
                  pillarOne.image1.url
                }" alt="airline arrival">
              </div>
              <div class="col">
                <img class="thematic-pillar__image" src="${
                  pillarOne.image2.url
                }" alt="airplane">
              </div>
            </div>
        
            <h4 class="sub-heading--1">
              What we are doing
            </h4>
            <p class="content-text--1">
              ${pillarOne.whatWeAreDoing}
            </p>
        
            <h4 class="sub-heading--1">
              Key Activities
            </h4>
            <ul class="thematic-pillar__list">
              ${pillarOne.keyActivities}
            </ul>

            `;
      $("#pillar-one").html(pillarOutput);
    });
}
