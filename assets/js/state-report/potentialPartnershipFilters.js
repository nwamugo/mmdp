
const returneeBeneficiaryType = 'Returnee';

const getUniquePartnershipString = (subTheme,LGA,focusArea, stakeholder1 = '', stakeholder2 = '' )=>{
  return (subTheme+LGA+focusArea+stakeholder1+stakeholder2);
};

const getPotentialPartnershipRowId = (lgaName,subThemeId,focusAreaId, beneficiaryServices) =>{
  // Get the string value of the subThemeId + currentServiceItem.LGAId + focusAreaId which make a unique row on the
  // partnerships table

  // For each service in the current stakeholder services, find the first one with identical lgaName, subThemeID and focusAreaId
  for (let currentServiceIndex = 0; currentServiceIndex < beneficiaryServices.length; currentServiceIndex++) {
    const currentServiceItem = beneficiaryServices[currentServiceIndex];
    if (currentServiceItem.LGA === lgaName
        && currentServiceItem.subThemeId === subThemeId
        && currentServiceItem.focusAreaId === focusAreaId){
      // return the string of these combined versions to get the potential partnerships RowId value
      return subThemeId+currentServiceItem.LGAId + focusAreaId;
    }
  }
};

const filterStakeholderPartnerships = (currentStakeholder, partnershipsArray)=>{
  const allPartnershipsArray = []; // Array of array items, each array has two stakeholder ids,
  // these stakeholders have a partnership

  //If the parameter partnershipsArray is not an array return undefined
  if(!Array.isArray(partnershipsArray) || partnershipsArray.length < 1){
    return ;
  }
  // for each partnership the current stakeholder service organization has , check if they are part of a partnership
  for (let partnershipIndex = 0; partnershipIndex < partnershipsArray.length; partnershipIndex++){
    const stakeholders = [];
    const currentPartnership = partnershipsArray[partnershipIndex];
    if(currentPartnership['stakeholder1Id']['_id']===currentStakeholder['id']
        || currentPartnership['stakeholder2Id']['_id']===currentStakeholder['id']){
      stakeholders.push(currentStakeholder['id']);
      stakeholders.push(currentPartnership['stakeholder2Id']['_id']);
    }
    allPartnershipsArray.push(stakeholders);
  }
  // return array of all current stakeholder partnerships i.e[ 0: ['stakeholder1_id', 'stakeholder2_id'], ...]
  return allPartnershipsArray;
}

const hasPartnershipWithCurrentStakeholders = (currentStakeholderId, compareStakeholderId, focusArea, LGA, subTheme,allCurrentPartnershipPairsArray)=>{
  if(allCurrentPartnershipPairsArray){
    for ( let currentPartnership = 0; currentPartnership < allCurrentPartnershipPairsArray.length ; currentPartnership++){
      const stakeholder1Id = allCurrentPartnershipPairsArray[currentPartnership][0];
      const stakeholder2Id = allCurrentPartnershipPairsArray[currentPartnership][1];
      if  ((currentStakeholderId === stakeholder1Id || currentStakeholderId === stakeholder2Id)
          && (compareStakeholderId === stakeholder1Id || compareStakeholderId === stakeholder2Id)){
        return { 'hasPartnership':true, 'partnerkeys1': getUniquePartnershipString(subTheme,LGA,focusArea,currentStakeholderId,compareStakeholderId),
          'partnerkeys2' : getUniquePartnershipString(subTheme,LGA,focusArea,compareStakeholderId,currentStakeholderId) };
      }
      if  (currentStakeholderId === stakeholder1Id || currentStakeholderId === stakeholder2Id){
        return { 'hasPartnership':false, 'partnerkeys1': getUniquePartnershipString(subTheme,LGA,focusArea,currentStakeholderId,compareStakeholderId),
          'partnerkeys2' : getUniquePartnershipString(subTheme,LGA,focusArea,compareStakeholderId,currentStakeholderId) };
      }
    }
  }
  return { 'hasPartnership':false,
    'partnerkeys1': getUniquePartnershipString(subTheme,LGA,focusArea,currentStakeholderId,compareStakeholderId),
    'partnerkeys2' : getUniquePartnershipString(subTheme,LGA,focusArea,compareStakeholderId,currentStakeholderId) }

}

const getTotalsForLGA = (lgaId,lgaName,thematicPillar,pillarDescription,subTheme,focusArea, beneficiaryServices)=>{
  // Get sum totals for beneficiaries and amounts invested in a particular LGA
  let totalNumberOfBeneficiariesReached = 0;
  let totalAmountInvested = 0;
  let totalNumberOfReturnees = 0;
  const uniqueServicesIdSet = new Set();
  const uniqueStakeholdersIdSet = new Set();

  // For each service in the current beneficiaries services for a particular state
  for(let serviceItemIndex = 0; serviceItemIndex < beneficiaryServices.length; serviceItemIndex++) {
    const currentBeneficiaryService = beneficiaryServices[serviceItemIndex];
    // Check if the current service LGA is the same as for the current LGA being queried
    // Check if the service has already been accounted for when summing up the total for the LGA so as not to add the same service twice
    if(currentBeneficiaryService.LGA === lgaName && !uniqueServicesIdSet.has(currentBeneficiaryService.serviceId)){
      // Sum up the total for the beneficiaries and AmountInvested of the LGA based on the beneficiaries of the current service
      totalNumberOfBeneficiariesReached += parseInt(currentBeneficiaryService.totalNumberOfBeneficiaries);
      totalNumberOfReturnees += parseInt(currentBeneficiaryService.totalNumberOfReturnees);
      totalAmountInvested += parseInt(currentBeneficiaryService.amountInvested);

      // Add current service and stakeholder IDs to unique sets
      uniqueServicesIdSet.add(currentBeneficiaryService.serviceId);
      // Provides total number of unique stakeholders in the current LGA
      uniqueStakeholdersIdSet.add(currentBeneficiaryService.stakeholderId); }
  }
  return {
    'lgaId': lgaId,
    'lgaName': lgaName,
    'thematicPillar': thematicPillar,
    'pillarDescription': pillarDescription,
    'subTheme': subTheme,
    'focusArea': focusArea,
    'totalNumberOfBeneficiariesReached': totalNumberOfBeneficiariesReached,
    'totalAmountInvested': totalAmountInvested,
    'totalNumberOfStakeholders': uniqueStakeholdersIdSet.size,
    'totalNumberOfReturnees': totalNumberOfReturnees,
  };
};

const getPercentage = (percentFor,percentOf)=> {
  // Return string with the percentage value
  return ((percentFor/percentOf)*100).toFixed(2) + '%';
};

const getSingleOrganizationDetailsForLGA = (
    ppRowId,
    stakeholderId,
    beneficiaryServices,
    lgaTotalNumberOfBeneficiariesReached = 0,
    lgaTotalAmountInvested = 0,
    lgaId ) => {
  // Get the current details for a single stakeholder organization
  let totalNumberOfBeneficiariesReachedByStakeholder = 0;
  let totalAmountInvestedByStakeholder = 0;
  let amountInvestedPercentage = '0%';
  let beneficiariesPercentage = '0%';
  let organizationName = '';
  let staffStrength = '';
  const beneficiaryServiceSet = new Set();

  // For each service in the beneficiary services
  for (let currentServiceIndex = 0; currentServiceIndex < beneficiaryServices.length; currentServiceIndex++) {
    const currentServiceItem = beneficiaryServices[currentServiceIndex];
    // if the stakeholderId is not the same, move to the next service in the array
    if (stakeholderId !== currentServiceItem.stakeholderId ) {
      continue;
    }
    // If the current stakeholder matches the current service stakeholder add the organization name and staffStrength
    if (stakeholderId === currentServiceItem.stakeholderId) {
      organizationName = currentServiceItem.organization;
      staffStrength = currentServiceItem.staffStrength || 'Unavailable';
    }
    // If the current service LGA is similar to the current lga in question & the current stakeholder is the owner of the current service & the current service is also unique
    if ( currentServiceItem.LGAId === lgaId && stakeholderId === currentServiceItem.stakeholderId && !beneficiaryServiceSet.has(currentServiceItem.serviceId)){
      totalNumberOfBeneficiariesReachedByStakeholder += parseInt(currentServiceItem.totalNumberOfBeneficiaries);
      totalAmountInvestedByStakeholder += parseInt(currentServiceItem.amountInvested);
      beneficiaryServiceSet.add(currentServiceItem.serviceId);
    }
  }
  // Get the percentage of beneficiaries reached by the current Stakeholder
  // if the current number of beneficiaries reached by this organization is larger than 0 & number of beneficiaries reached in an LGA is > 0
  if( totalNumberOfBeneficiariesReachedByStakeholder > 0 && lgaTotalNumberOfBeneficiariesReached > 0){
    beneficiariesPercentage = getPercentage(totalNumberOfBeneficiariesReachedByStakeholder,lgaTotalNumberOfBeneficiariesReached);
  }
  // Get the percentage of amount invested by this stakeholder
  // if the current amount invested is larger than 0 & number of beneficiaries reached in an LGA is > 0

  if( totalAmountInvestedByStakeholder > 0 && lgaTotalAmountInvested > 0){
    amountInvestedPercentage = getPercentage(totalAmountInvestedByStakeholder,lgaTotalAmountInvested);
  }
  if(!organizationName || organizationName ===''){
    return;
  }
  return {
    'organizationName': organizationName,
    'totalAmountInvested': totalAmountInvestedByStakeholder,
    'amountInvestedPercentage': amountInvestedPercentage,
    'totalBeneficiariesReached': totalNumberOfBeneficiariesReachedByStakeholder,
    'beneficiariesPercentage': beneficiariesPercentage,
    'staffStrength': staffStrength
  };
};

const getPotentialPartnershipRowLGAData = (ppRowId, beneficiaryServices)=>{
  // Return the lga, pillar, sub theme and focus area data based on the a potential partnership Row Id (ppRowId)
  for (let currentServiceIndex = 0; currentServiceIndex < beneficiaryServices.length; currentServiceIndex++) {
    if (beneficiaryServices[currentServiceIndex].ppRowId === ppRowId){
      return {
        lgaId: beneficiaryServices[currentServiceIndex].LGAId,
        lgaName: beneficiaryServices[currentServiceIndex].LGA,
        thematicPillar: beneficiaryServices[currentServiceIndex].thematicPillar,
        pillarDescription: beneficiaryServices[currentServiceIndex].pillarDescription,
        subTheme: beneficiaryServices[currentServiceIndex].subTheme,
        focusArea: beneficiaryServices[currentServiceIndex].focusArea,
      }
    }
  }
};

const getPotentialPartnershipsStakeholders = (filteredServices)=>{
  const partnershipMap = new Map();
  const stakeholderIdsSet = new Set();
  // for every service in the filtered services check if they have potential partnerships
  for (let currentServiceIndex = 0; currentServiceIndex < filteredServices.length; currentServiceIndex++) {
    const currentServiceItem = filteredServices[currentServiceIndex];
    const filteredPartnerships = filterStakeholderPartnerships({
      'id': currentServiceItem.stakeholderId,
      'organisationName': currentServiceItem.organization
    }, currentServiceItem['partnerships']);
    for (let comparedServiceIndex = 0; comparedServiceIndex < filteredServices.length; comparedServiceIndex++) {
      const comparedServiceItem = filteredServices[comparedServiceIndex];
      if (currentServiceItem.stakeholderId !== comparedServiceItem.stakeholderId
          && currentServiceIndex !== comparedServiceIndex
        && currentServiceItem.serviceId !== comparedServiceItem.serviceId
      ){
        //check if the current stakeholder has a partnership with the other stakeholder in comparision
        if (!filteredPartnerships || filteredPartnerships.length === 0) {
          stakeholderIdsSet.add(currentServiceItem.stakeholderId);
          stakeholderIdsSet.add(comparedServiceItem.stakeholderId);
          const partnershipKey1 = getUniquePartnershipString(
              currentServiceItem["subTheme"],
              currentServiceItem.LGA,
              currentServiceItem.focusArea,
              currentServiceItem.stakeholderId,
              comparedServiceItem.stakeholderId);
          const partnershipKey2 = getUniquePartnershipString(
              currentServiceItem["subTheme"],
              currentServiceItem.LGA,
              currentServiceItem.focusArea,
              currentServiceItem.stakeholderId,
              comparedServiceItem.stakeholderId);
          partnershipMap.set(
              partnershipKey1,
              partnershipKey1
          );
          partnershipMap.set(
              partnershipKey2,
              partnershipKey2
          );
        }
        // If the currentStakeholder has partnerships check if they have a partnership with
        // the currently compared stakeholder and check that we also haven't duplicated the
        // potential partnership
        const partnershipStatus = hasPartnershipWithCurrentStakeholders(
            currentServiceItem.stakeholderId,
            comparedServiceItem.stakeholderId,
            currentServiceItem.focusArea,
            currentServiceItem.LGA,
            currentServiceItem["subTheme"],
            filteredPartnerships
        );
        // If there is no current partnership between the two current stakeholders in comparison then add a
        // potential partnership to the array
        if (!partnershipStatus.hasPartnership && !partnershipMap.has(partnershipStatus.partnerkeys1)
            && !partnershipMap.has(partnershipStatus.partnerkeys2)) {
          stakeholderIdsSet.add(currentServiceItem.stakeholderId);
          stakeholderIdsSet.add(comparedServiceItem.stakeholderId);
          partnershipMap.set(partnershipStatus.partnerkeys1, partnershipStatus.partnerkeys1);
          partnershipMap.set(partnershipStatus.partnerkeys2, partnershipStatus.partnerkeys2);
        }
      }
    }
  }
  return stakeholderIdsSet;
}

const getPartnershipDetailsByFocusArea = (beneficiaryServices)=>{
 const ppRowIdSet = new Set();
 const stakeholderIdSet = new Set();

 const potentialPartnershipsModalDetails = [];
// For each service in the current state, create a unique list of all potential partnerships row ids
// based on the ppRowId assigned to the service (unique combination of subThemeId + LGA Id + focusAreaId)
  for (let currentServiceIndex = 0; currentServiceIndex < beneficiaryServices.length; currentServiceIndex++) {
    const currentServiceItem = beneficiaryServices[currentServiceIndex];
    ppRowIdSet.add(currentServiceItem.ppRowId);
    stakeholderIdSet.add(currentServiceItem.stakeholderId);
  }
 // For every unique potential partnership row ID
  for (let currentPpRowId of ppRowIdSet) {
    const organizationDetailsArray = [];
    // get the current LGA, subTheme, focusArea data for the current potential partnership row ID
    const ppRowLgaData = getPotentialPartnershipRowLGAData(currentPpRowId, beneficiaryServices);
    // get the totals for the current LGA based on all current stakeholder services
    const lgaTotalsData = getTotalsForLGA(
        ppRowLgaData.lgaId,
        ppRowLgaData.lgaName,
        ppRowLgaData.thematicPillar,
        ppRowLgaData.pillarDescription,
        ppRowLgaData.subTheme,
        ppRowLgaData.focusArea,
        beneficiaryServices
    );
    // get an array of services that have the same potential partnerships row Id
    const currentPPRowIdServices = beneficiaryServices.filter(service=>(service.ppRowId === currentPpRowId));
    // get a list of all unique stakeholders in the who have the same potential partnerships row Id
    const potentialPartnersStakeholderIdsSet = getPotentialPartnershipsStakeholders(currentPPRowIdServices);
    if (potentialPartnersStakeholderIdsSet.size > 0){
      // for every unique stakeholder in the current potential partnership row , get their summarized details
      // and add these details to the list of stakeholders for the current potential partnerships row
      // we will use this data to load all unique potential partnership based on sub theme, LGA and focus area
      for (let currentStakeholderId of potentialPartnersStakeholderIdsSet) {
        const singleOrganizationDetails = getSingleOrganizationDetailsForLGA(
            currentPpRowId,
            currentStakeholderId,
            beneficiaryServices,
            lgaTotalsData.totalNumberOfBeneficiariesReached,
            lgaTotalsData.totalAmountInvested,
            lgaTotalsData.lgaId
        );
        if(singleOrganizationDetails){
          organizationDetailsArray.push(
              {
                ...singleOrganizationDetails
              }
          )
        }
      }
    }
    if(organizationDetailsArray.length > 0){
      potentialPartnershipsModalDetails.push(
          {
            'ppRowId': currentPpRowId,
            ...lgaTotalsData,
            'organizationDetailsArray':organizationDetailsArray
          }
      );
    }
  }
  return potentialPartnershipsModalDetails;

};

const getServiceBeneficiariesCount= (beneficiaryTypes)=>{
  const serviceBeneficiaryCountArray = beneficiaryTypes.map(beneficiaryTypeItem => {
    const maleCount = beneficiaryTypeItem.noOfMaleBeneficiaries;
    const femaleCount = beneficiaryTypeItem.noOfFemaleBeneficiaries;
    return  {
      beneficiaryCount: maleCount + femaleCount,
      beneficiariesType: beneficiaryTypeItem.beneficiaryTypeId.beneficiaryTypeName
    }
  });
  let totalBeneficiariesCount = 0;
  let totalReturneesCount = 0;
  for (let beneficiaryCountIndex = 0; beneficiaryCountIndex < serviceBeneficiaryCountArray.length; beneficiaryCountIndex++) {
    const currentBeneficiaryType = serviceBeneficiaryCountArray[beneficiaryCountIndex];
    if (currentBeneficiaryType.beneficiariesType !== returneeBeneficiaryType ){
      totalBeneficiariesCount += currentBeneficiaryType.beneficiaryCount
    }
    if (currentBeneficiaryType.beneficiariesType === returneeBeneficiaryType ){
      totalBeneficiariesCount += currentBeneficiaryType.beneficiaryCount;
      totalReturneesCount += currentBeneficiaryType.beneficiaryCount;
    }
  }

  return {
    totalBeneficiariesCount,
    totalReturneesCount
  };
};
const getStakeholderServicesArray = (filteredStakeholders = [], stakeholdersArray = [])=>{
  filteredStakeholders.map(function (result) {
    result.forEach(element => {
      if (element['beneficiaries']) {
        if (element['beneficiaries'].length > 0) {
          element['beneficiaries'].map(function (beneficiaryService) {
            if(beneficiaryService.communities.length ===1){
              const amountInvested = beneficiaryService['fundingSources'] ? beneficiaryService['fundingSources'][0]['amountInvestedRange']['amountInvestedRange'] : 0;
              stakeholdersArray.push({
                'partnerships': element['partnerships'],
                'thematicPillar':
                beneficiaryService['focusArea'].thematicPillarName
                    .pillarName,
                'subTheme':
                beneficiaryService['focusArea'].subThemeName
                    .subThemeName,
                'subThemeId':
                beneficiaryService['focusArea'].subThemeName
                    ._id,
                'stakeholderId': element['_id'],
                'staffStrength': (element['staffStrengthRangeId']? element['staffStrengthRangeId']['staffStrength'] : 'Unavailable'),
                'pillarDescription': (beneficiaryService['focusArea'].thematicPillarName
                    .description || 'Unavailable'),
                'organization': element['organisationName'],
                'service': beneficiaryService['serviceName'],
                'serviceId': beneficiaryService['_id'],
                'focusArea':
                beneficiaryService['focusArea'].focusAreaName
                    .focusAreaName,
                'focusAreaId':
                beneficiaryService['focusArea'].focusAreaName
                    ._id,
                'totalNumberOfBeneficiaries': getServiceBeneficiariesCount(beneficiaryService['beneficiaryTypes']).totalBeneficiariesCount,
                'totalNumberOfReturnees': getServiceBeneficiariesCount(beneficiaryService['beneficiaryTypes']).totalReturneesCount,
                'amountInvested': amountInvested,
                'LGA': beneficiaryService.communities[0].lgaId.lgaName,
                'LGAId': beneficiaryService.communities[0].lgaId._id,
                'ppRowId': getUniquePartnershipString(
                    beneficiaryService['focusArea'].subThemeName
                        ._id,
                    beneficiaryService.communities[0].lgaId._id,
                    beneficiaryService['focusArea'].focusAreaName._id,
                    '',
                    ''
                )
              });
            }
            // If the service is available in more than one LGA add it as a separate beneficiary service object
            // based on the lga being different
            if(beneficiaryService.communities.length > 1){
              for (let communityIndex = 0; communityIndex < beneficiaryService.communities.length; communityIndex++) {
                const amountInvested = beneficiaryService['fundingSources'] ? beneficiaryService['fundingSources'][0]['amountInvestedRange']['amountInvestedRange'] : 0;

                stakeholdersArray.push({
                  'partnerships': element['partnerships'],
                  'thematicPillar':
                  beneficiaryService['focusArea'].thematicPillarName
                      .pillarName,
                  'subTheme':
                  beneficiaryService['focusArea'].subThemeName
                      .subThemeName,
                  'subThemeId':
                  beneficiaryService['focusArea'].subThemeName
                      ._id,
                  'stakeholderId': element['_id'],
                  'staffStrength': (element['staffStrengthRangeId']? element['staffStrengthRangeId']['staffStrength'] : 'Unavailable'),
                  'pillarDescription': beneficiaryService['focusArea'].thematicPillarName
                      .description || 'Unavailable',
                  'organization': element['organisationName'],
                  'serviceId': beneficiaryService['_id'],
                  'service': beneficiaryService['serviceName'],
                  'focusArea':
                  beneficiaryService['focusArea'].focusAreaName
                      .focusAreaName,
                  'focusAreaId':
                  beneficiaryService['focusArea'].focusAreaName
                      ._id,
                  'totalNumberOfBeneficiaries': getServiceBeneficiariesCount(beneficiaryService['beneficiaryTypes']).totalBeneficiariesCount,
                  'totalNumberOfReturnees': getServiceBeneficiariesCount(beneficiaryService['beneficiaryTypes']).totalReturneesCount,
                  'amountInvested': amountInvested,
                  'LGA': beneficiaryService.communities[communityIndex].lgaId.lgaName,
                  'LGAId': beneficiaryService.communities[communityIndex].lgaId._id,
                  'ppRowId': getUniquePartnershipString(
                      beneficiaryService['focusArea'].subThemeName
                          ._id,
                      beneficiaryService.communities[communityIndex].lgaId._id,
                      beneficiaryService['focusArea'].focusAreaName._id,
                  )
                });
              }
            }
          });
        }
      }
    });
  });
  return stakeholdersArray;
};

const getPotentialPartnershipsForLGAs = (data,potentialPartnershipPerLGA) => {

  let stakeholderServicesArray = getStakeholderServicesArray([data.filteredStakeholders]);
  const partnershipMap = new Map();
  const stateLevelPotentialPartnerships = [];
  for(let partnershipLGAIndex = 0; partnershipLGAIndex < potentialPartnershipPerLGA.length; partnershipLGAIndex++){
    const currentLGA = potentialPartnershipPerLGA[partnershipLGAIndex];
    const potentialLGAPartnerships = [];
    for (let item = 0; item < stakeholderServicesArray.length; item++) {
      const currentStakeholder = stakeholderServicesArray[item];
      if (currentStakeholder.LGA === currentLGA['lgaName']) {
        //iterateLGAFocusAreas
        for (let item2 = 0; item2 < currentLGA['focusAreas'].length; item2++) {

          let currentFocusArea = currentLGA.focusAreas;
          currentFocusArea = currentFocusArea[item2]; //current focusAreaName
          if (currentStakeholder.focusArea === currentFocusArea.name) { // current stakeholder focus area
            const filteredPartnerships = filterStakeholderPartnerships({
              'id': currentStakeholder.stakeholderId,
              'organisationName': currentStakeholder.organization
            }, currentStakeholder['partnerships']);
            //check if any other stakeholder has the same focusArea
            for (let currentBeneficiaryIndex = 0; currentBeneficiaryIndex < stakeholderServicesArray.length; currentBeneficiaryIndex++) {
              const currentPartnershipKey1 = getUniquePartnershipString(
                  currentStakeholder["subTheme"],
                  currentStakeholder.LGA,
                  currentFocusArea.name,currentStakeholder.stakeholderId,
                  stakeholderServicesArray[currentBeneficiaryIndex].stakeholderId);
              const currentPartnershipKey2 = getUniquePartnershipString(
                  currentStakeholder["subTheme"],
                  currentStakeholder.LGA,
                  currentFocusArea.name,
                  stakeholderServicesArray[currentBeneficiaryIndex].stakeholderId,
                  currentStakeholder.stakeholderId);
              if (
                  item !== currentBeneficiaryIndex
                  && !partnershipMap.has(currentPartnershipKey1)
                  && !partnershipMap.has(currentPartnershipKey2)
              ) {
                // check if current stakeholder and another single stakeholder has the same focus area
                if (stakeholderServicesArray[currentBeneficiaryIndex].focusArea === currentFocusArea.name
                    && stakeholderServicesArray[currentBeneficiaryIndex].LGA === currentStakeholder.LGA
                    && currentStakeholder["subTheme"] === stakeholderServicesArray[currentBeneficiaryIndex]["subTheme"]
                    && currentStakeholder.stakeholderId !== stakeholderServicesArray[currentBeneficiaryIndex].stakeholderId
                ) {
                  //check if the current stakeholder has a partnership with the other stakeholder in comparision
                  if (!filteredPartnerships || filteredPartnerships.length === 0) {
                    potentialLGAPartnerships.push({
                      thematicPillar: stakeholderServicesArray[currentBeneficiaryIndex]["thematicPillar"],
                      subTheme: stakeholderServicesArray[currentBeneficiaryIndex]["subTheme"],
                      focusArea: currentFocusArea.name,
                      potentialPartnerOrganisations: [
                        stakeholderServicesArray[currentBeneficiaryIndex].organization,
                        currentStakeholder.organization,
                      ]
                    });
                    partnershipMap.set(
                        getUniquePartnershipString(
                            currentStakeholder["subTheme"],
                            currentStakeholder.LGA,
                            currentFocusArea.name,currentStakeholder.stakeholderId,
                            stakeholderServicesArray[currentBeneficiaryIndex].stakeholderId),
                        true);
                    partnershipMap.set(
                        getUniquePartnershipString(
                            currentStakeholder["subTheme"],
                            currentStakeholder.LGA,
                            currentFocusArea.name,
                            stakeholderServicesArray[currentBeneficiaryIndex].stakeholderId,
                            currentStakeholder.stakeholderId),
                        true);
                  }
                  // If the currentStakeholder has partnerships check if they have a partnership with
                  // the currently compared stakeholder and check that we also haven't duplicated the
                  // potential partnership
                  const partnershipStatus = hasPartnershipWithCurrentStakeholders(
                      currentStakeholder.stakeholderId,
                      stakeholderServicesArray[currentBeneficiaryIndex].stakeholderId,
                      currentFocusArea.name,
                      currentStakeholder.LGA,
                      currentStakeholder["subTheme"],
                      filteredPartnerships
                  );
                  // If there is no current partnership between the two current stakeholders in comparison then add a
                  // potential partnership to the array
                  if (!partnershipStatus.hasPartnership && !partnershipMap.has(partnershipStatus.partnerkeys1)
                      && !partnershipMap.has(partnershipStatus.partnerkeys2)) {
                    potentialLGAPartnerships.push({
                      thematicPillar: stakeholderServicesArray[currentBeneficiaryIndex]["thematicPillar"],
                      subTheme: stakeholderServicesArray[currentBeneficiaryIndex]["subTheme"],
                      focusArea: currentFocusArea.name,
                      potentialPartnerOrganisations: [
                        currentStakeholder.organization,
                        stakeholderServicesArray[currentBeneficiaryIndex].organization,
                      ]
                    });
                    partnershipMap.set(partnershipStatus.partnerkeys1, true);
                    partnershipMap.set(partnershipStatus.partnerkeys2, true);
                  }
                }
              }
            }
          }
        }
      }

    }
    stateLevelPotentialPartnerships.push(
        {
          'lgaName': currentLGA['lgaName'],
          'potentialLGAPartnerships': potentialLGAPartnerships,
          'potentialLGAPartnershipsCount': potentialLGAPartnerships.length,

        }
    )
  }
  return stateLevelPotentialPartnerships;
}