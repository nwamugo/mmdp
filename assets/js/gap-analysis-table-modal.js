const bindGapAnalysisModalJQuery = (focusAreaGaps) => {
  $('.gap-analysis-details').click(async function() {
        $('.gap-analysis-modal').show();
        let rowGapAnalysis = {};
        const rowGapAnalysisArray = [];
        const missingFocusAreaDetails = await focusAreaGaps.find(focus => focus.id === this.id);
        const lgasWithFocusAreas = await getLgaWithGaps(missingFocusAreaDetails);
        const lgas = getUniqueLgas(lgasWithFocusAreas);
        for (const lga of lgas) {          
            if (lga.lga === '') {
              continue;
            } else {
              const singleLga = lga.lga.trim();
              const lgaDetails = await getLgaDetails(singleLga);
              rowGapAnalysis = {
                ...missingFocusAreaDetails,
                ...lgaDetails,
                focusArea: lga.focusArea,
                focusAreasWithGapsCount: lga.focusArea.length
              };
              rowGapAnalysisArray.push(rowGapAnalysis);
            }
        }

        function showFocusArea (lga, innerOutput) {
          lga.forEach(focus => {
            innerOutput += `<li>${focus}</li>`
          })
          return innerOutput;
        }

        let output = '';
        rowGapAnalysisArray.forEach(function(lga) {
          let innerOutput = '';
          output += `
          <div class="lga-grid-box">
          <div class="lga-header">
            <div class="lga-name">
              <p>${lga.id}</p>
            </div>
            <div class="lga-stats">
              <p>Total number of beneficiaries: ${lga.beneficiaryCount}</p>
              <p>Total number of stakeholders: ${lga.stakeholderCount}</p>
              <p>Total number of returnees: ${lga.returneeCount}</p>
            </div>
          </div>
          <div class="lga-body">
            <div class="lga-body-top">

              <div class="top-1">
                <div class="top-1-image">
                  <img src="/assets/images/pillar.svg"/>
                </div>
                <div class="top-1-text">
                  <span>${lga.pillar}</span>: ${lga.pillarDescription}
                </div>
              </div> 

              <div class="top-2">
                <div class="top-2-image">
                  <img src="/assets/images/subtheme.svg"/>
                </div>
                <div class="top-2-text">
                  ${lga.subtheme}
                </div>
              </div> 

              <div class="top-3">
                <div class="top-3-image">
                  <img src="/assets/images/focusArea.svg"/>
                </div>
                <div class="top-3-text">
                  <span>${lga.focusAreasWithGapsCount} out of ${lga.focusAreaCount} <br /></span> Focus Areas <span><i>unavailable</i></span>
                </div>
              </div> 

            </div>
            <div class="lga-body-bottom">
              <p>Missing Focus Areas</p>
              <ul>
              ${showFocusArea(lga.focusArea, innerOutput)}
              </ul>
            </div>
          </div>
        </div>
          `;
          
        })
        document.querySelector('.modal-grid-container').innerHTML = output;
        $('.cancel-modal').click(function() {
          document.querySelector('.modal-grid-container').innerHTML = '';            
          $('.gap-analysis-modal').hide();
        })
      });
}