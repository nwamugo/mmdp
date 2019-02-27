// Retrieve pillar one

function cmsLoad() {
  loadPillarThree();
}

function loadPillarThree() {
  client(`pillars/pillar-number/3`)
    .then(res => res.json())
    .then(data => {
      let pillarThree = data.pillar[0];

      let pillarOutput = `
            <div class="thematic-pillar__heading-area">
              <h2 class="heading-title--1 thematic-pillar__heading-title">${
                pillarThree.title
              }</h2>
            </div>
            <h4 class="sub-heading--1">
              Introduction
            </h4>
            <p class="content-text--1">
              ${pillarThree.introduction}
            </p>
        
            <div class="row thematic-pillar__image-area">
              <div class="col">
                <img class="thematic-pillar__image" src="${
                  pillarThree.image1.url
                }" alt="airline arrival">
              </div>
              <div class="col">
                <img class="thematic-pillar__image" src="${
                  pillarThree.image2.url
                }" alt="airplane">
              </div>
            </div>
        
            <h4 class="sub-heading--1">
              What we are doing
            </h4>
            <p class="content-text--1">
              ${pillarThree.whatWeAreDoing}
            </p>
        
            <h4 class="sub-heading--1">
              Key Activities
            </h4>
            <ul class="thematic-pillar__list">
              ${pillarThree.keyActivities}
            </ul>

            `;
      $("#pillar-three").html(pillarOutput);
    });
}
