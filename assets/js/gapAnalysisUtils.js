/**
 * @description Check if the array contains the given lga
 * @param {object} lgaSample
 * @param {array} lgaArray 
 * @returns {any} boolean
 */
const doesArrayContainLga = (lgaSample, lgaArray) => {
  return lgaArray.find((lgaItem) => lgaSample.lga.trim() === lgaItem.lga.trim());
}

/**
 * description Get all the lgas that have a missing focus area
 * @param {Object} focusAreaObject
 * @returns {Array} lgasWithFocusAreas
 */
const getLgaWithGaps = focusAreaObject => {
  const lgasWithFocusAreas = [];
  focusAreaObject.focusArea.forEach(focus => {

    if (typeof focus === 'string') {
      const lgaArray = focusAreaObject.LgasWithGaps.split(',');
      lgaArray.forEach(lga => {
        const focusObject = {}

        focusObject.focusArea = focus;
        focusObject.lga = lga;
        lgasWithFocusAreas.push(focusObject);
      })
    }
    if (typeof focus === 'object') {
      focus.lgasWithGaps.forEach(lga => {
        const focusObject = {}

        focusObject.focusArea = focus.focusArea;
        focusObject.lga = lga;
        lgasWithFocusAreas.push(focusObject);
      })
    }
  })
  return lgasWithFocusAreas;
};

/**
 * @description - Get the unique lgas from the array of lgas
 * @param {array} lgasWithFocusAreas
 * @returns {array} lgas
 */
const getUniqueLgas = (lgasWithFocusAreas) => {
  const lgas = [];
  lgasWithFocusAreas.forEach(lgaObject => {
    if (!doesArrayContainLga(lgaObject, lgas)) {
      const lga = {};
      lga.lga = lgaObject.lga;
      lga.focusArea = [];
      lgasWithFocusAreas.forEach(lgaObjectCheck => {
      if (lgaObjectCheck.lga.trim() === lgaObject.lga.trim()) {
        lga.focusArea.push(lgaObjectCheck.focusArea);
        }
      });
      lgas.push(lga);
    }
  });
  return lgas;
}

/**
 * description Extracts the beneficiaries details for each stakeholder and returns an array
 * @param {array} data 
 * @returns {array} beneficiaries
 */
const getBeneficiaryDetails = data => {
  const beneficiaries = data.map(stakeholder => {
    const maleCount = stakeholder.beneficiaries[0].beneficiaryTypes[0].noOfMaleBeneficiaries;
    const femaleCount = stakeholder.beneficiaries[0].beneficiaryTypes[0].noOfFemaleBeneficiaries;
   return  { 
      beneficiaryCount: maleCount + femaleCount,
      lgaName: stakeholder.beneficiaries[0].communities[0].lgaId.lgaName,
      beneficiariesType: stakeholder.beneficiaries[0].beneficiaryTypes[0].beneficiaryTypeId.beneficiaryTypeName
    }
  });
  return beneficiaries;
}

/**
 * description Extracts and returns an object with all the lga details needed
 * @param {string} lga 
 * @returns {object} lgaObject
 */
const getLgaDetails = async (lga) => {
  const lgaObject = {};
  const lgaBeneficiaries = [];
  const lgaStakeholders = []
  const queryNameFromUrl = window.location.search.substring(1).split('=')[1];
  const queryParam = queryNameFromUrl
    ? queryNameFromUrl.charAt(0).toUpperCase() + queryNameFromUrl.slice(1)
    : 'Nigeria';
  const stakeholderData = await fetch(
    `${MMDP_BASE_URL}/api/v1/location?state=${queryParam}&focusAreaName`
  );
  const data = await stakeholderData.json();
  
  const lgaDetails = await handleStakeholdersData(data.filteredStakeholders);
  lgaDetails.forEach(details => {
    if (details.location === lga) {
      lgaBeneficiaries.push(details.beneficiaryCount);
      lgaStakeholders.push(details.organisationName);
    }
  });
    
  const totalBeneficiaryCount = await lgaBeneficiaries.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  const beneficiaries = await getBeneficiaryDetails(data.filteredStakeholders);
  let returneeCount = 0;
  beneficiaries.forEach(beneficiary => {
    if (beneficiary.lgaName === lga && beneficiary.beneficiariesType === 'Returnee') {
      returneeCount += beneficiary.beneficiaryCount;
    } else {
      returneeCount += 0;
    }
  })
  lgaObject.returneeCount = returneeCount;

  lgaObject.id = lga;
  lgaObject.stakeholderCount = lgaStakeholders.length;
  lgaObject.beneficiaryCount = totalBeneficiaryCount;
  return lgaObject;
}
