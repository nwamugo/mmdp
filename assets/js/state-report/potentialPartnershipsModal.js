
const thousandSeparators  =(num)=>{
  let num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
};

const createPotentialPartnershipDetailsColumn = (stakeholderDetailsItem) => {
  //Take the current stakeholder details and add them to a HTML string with the accurate formatting
   return `
    <div class="org-potential-partnership">
        <span class="organization-title-partnerships-modal"> ${stakeholderDetailsItem.organizationName}</span>
          <div class="org-text-container-potential-partnerships">
          <ul class="org-details-list">
            <li><b>Amount Invested:</b> <span>NGN ${thousandSeparators(stakeholderDetailsItem.totalAmountInvested) || '0'}</span> 
            <span><b><i>(${stakeholderDetailsItem.amountInvestedPercentage || '00%'} of Total in LGA)</i></b></span></li>
            <li><b>Beneficiaries Reached:</b> <span> ${thousandSeparators(stakeholderDetailsItem.totalBeneficiariesReached) || '0'}</span>
            <span><b><i>(${stakeholderDetailsItem.beneficiariesPercentage || '00%'} of Total in LGA)</i></b></span></li>
            <li><b>Staff Strength:</b> <span>${stakeholderDetailsItem.staffStrength || 'Unavailable'}</span></li>
          </ul>
          </div>
    </div>
   `;
};

const bindPotentialPartnershipModalJQuery = (potentialPartnershipsByFocusArea) => {
  // call this function when a user clicks on a row inside the potential partnerships table
  $('.pprow-item').click(async function() {
   // Get the current potential partnership row ID
   const currentTableRowModalData = potentialPartnershipsByFocusArea.find((ppTableRow)=>(
           ppTableRow.ppRowId === $(this).attr('pprowid')
       ));
    // Show the potential partnerships modal
    $('.potential-partnerships-modal').show();
    let organizationDetailsHTML = '';
    const { organizationDetailsArray } = currentTableRowModalData;
    // For all stakeholders in a certain potential partnership row add their data to a HTML string that lists all their details
    // in relation to the current sub theme, LGA and focusarea
    for (let stakeholderItemIndex = 0; stakeholderItemIndex < organizationDetailsArray.length; stakeholderItemIndex++) {
      const currentStakeholderDetails = organizationDetailsArray[stakeholderItemIndex];
      organizationDetailsHTML+= createPotentialPartnershipDetailsColumn({
        'organizationName': currentStakeholderDetails.organizationName,
        'totalAmountInvested': currentStakeholderDetails.totalAmountInvested,
        'amountInvestedPercentage': currentStakeholderDetails.amountInvestedPercentage,
        'totalBeneficiariesReached': currentStakeholderDetails.totalBeneficiariesReached,
        'beneficiariesPercentage': currentStakeholderDetails.beneficiariesPercentage,
        'staffStrength': currentStakeholderDetails.staffStrength});
    }

    // Create a variable with the current modal data ready for viewing
    const output = `
            <div class="lga-grid-box">
              <div class="lga-header">
                <div class="lga-name">
                  <p>${currentTableRowModalData.lgaName}</p>
                </div>
                <div class="lga-stats">
                  <p>Total number of beneficiaries: ${thousandSeparators(currentTableRowModalData.totalNumberOfBeneficiariesReached)}</p>
                  <p>Total number of stakeholders: ${thousandSeparators(currentTableRowModalData.totalNumberOfStakeholders)}</p>
                  <p>Total number of returnees: ${thousandSeparators(currentTableRowModalData.totalNumberOfReturnees)}</p>
                </div>
              </div>
              <div class="lga-body">
                <div class="lga-body-top-partnerships">

                  <div class="pillar-potential-partnerships">
                    <div class="text-container-potential-partnerships">
                      <div class="pillar-image-container-potential-partnerships">
                        <img class="pillar-image-potential-partnerships" src="/assets/images/pillar.svg">
                      </div>
                      <p class="">
                        <b>${currentTableRowModalData.thematicPillar}</b>:
                      </p>
                    </div>
                    <p class="potential-partnerships-details-text">
                      ${currentTableRowModalData.pillarDescription}
                    </p>
                  </div>

                  <div class="sub-theme-potential-partnerships">
                    <div class="text-container-potential-partnerships">
                      <div class="pillar-image-container-potential-partnerships">
                        <img class="pillar-image-potential-partnerships" src="/assets/images/subtheme.svg">
                      </div>
                      <p class="">
                        <b>Sub theme: </b>
                      </p>
                    </div>
                    <p class="potential-partnerships-details-text">
                      ${currentTableRowModalData.subTheme}
                    </p>
                  </div>
                  <div class="focus-area-potential-partnerships">
                    <div class="text-container-potential-partnerships">
                      <div class="pillar-image-container-potential-partnerships">
                        <img class="pillar-image-potential-partnerships" src="/assets/images/focusArea.svg">
                      </div>
                      <p class="">
                        <b>Focus Area:</b>
                      </p>
                    </div>
                    <p class="potential-partnerships-details-text">
                      ${currentTableRowModalData.focusArea}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            <div class="lga-grid-box">
              <div class="title-text-potential-partnerships">
                <span><b> <i>Organisations that can potentially partner</i></b></span>
              </div>
              <div class="organizations-container-potential-partnerships">
                ${organizationDetailsHTML}
              </div>
            </div>
          `;
    // Hide the modal when the cancel button is clicked
    document.querySelector('.modal-grid-container-partnerships').innerHTML = output;
    $('.cancel-modal').click(function() {
      document.querySelector('.modal-grid-container-partnerships').innerHTML = '';
      $('.potential-partnerships-modal').hide();
    })
  });
};
