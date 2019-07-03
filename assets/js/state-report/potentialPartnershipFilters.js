function filterStakeholderPartnerships(currentStakeholder, partnershipsArray) {
  const allPartnershipsArray = [];
  if (!Array.isArray(partnershipsArray) || partnershipsArray.length < 1) {
    return;
  }
  for (
    let partnershipIndex = 0;
    partnershipIndex < partnershipsArray.length;
    partnershipIndex++
  ) {
    const stakeholders = [];
    const currentPartnership = partnershipsArray[partnershipIndex];
    if (
      currentPartnership['stakeholder1Id']['_id'] ===
        currentStakeholder['id'] ||
      currentPartnership['stakeholder2Id']['_id'] === currentStakeholder['id']
    ) {
      stakeholders.push(currentStakeholder['id']);
      stakeholders.push(currentPartnership['stakeholder2Id']['_id']);
    }
    allPartnershipsArray.push(stakeholders);
  }
  return allPartnershipsArray; // array of all stakeholder partnerships
}

function hasPartnershipWithCurrentStakeholders(
  currentStakeholderId,
  compareStakeholderId,
  focusArea,
  allCurrentPartnershipPairsArray
) {
  if (allCurrentPartnershipPairsArray) {
    for (
      let currentPartnership = 0;
      currentPartnership < allCurrentPartnershipPairsArray.length;
      currentPartnership++
    ) {
      const stakeholder1Id =
        allCurrentPartnershipPairsArray[currentPartnership][0];
      const stakeholder2Id =
        allCurrentPartnershipPairsArray[currentPartnership][1];
      if (
        (currentStakeholderId === stakeholder1Id ||
          currentStakeholderId === stakeholder2Id) &&
        (compareStakeholderId === stakeholder1Id ||
          compareStakeholderId === stakeholder2Id)
      ) {
        return {
          hasPartnership: true,
          partnerkeys1: focusArea + currentStakeholderId + compareStakeholderId,
          partnerkeys2: focusArea + compareStakeholderId + currentStakeholderId
        };
      }
      if (
        currentStakeholderId === stakeholder1Id ||
        currentStakeholderId === stakeholder2Id
      ) {
        return {
          hasPartnership: false,
          partnerkeys1: focusArea + currentStakeholderId + compareStakeholderId,
          partnerkeys2: focusArea + compareStakeholderId + currentStakeholderId
        };
      }
    }
  }
  return {
    hasPartnership: false,
    partnerkeys1: focusArea + currentStakeholderId + compareStakeholderId,
    partnerkeys2: focusArea + compareStakeholderId + currentStakeholderId
  };
}

function getPotentialPartnershipsForLGAs(data, potentialPartnershipPerLGA) {
  const arr = [];
  const filteredStakeholders = [data.filteredStakeholders];
  filteredStakeholders.map(function(result) {
    result.forEach(element => {
      if (element['beneficiaries']) {
        if (element['beneficiaries'].length > 0) {
          element['beneficiaries'].map(function(beneficiaryService) {
            arr.push({
              partnerships: element['partnerships'],
              'Thematic Pillar':
                beneficiaryService['focusArea'].thematicPillarName.pillarName,
              'Sub Theme':
                beneficiaryService['focusArea'].subThemeName.subThemeName,
              stakeholderId: element['_id'],
              organization: element['organisationName'],
              Service: beneficiaryService['serviceName'],
              focusArea:
                beneficiaryService['focusArea'].focusAreaName.focusAreaName,
              LGA: beneficiaryService.communities[0].lgaId.lgaName
            });
          });
        }
      }
    });
  });
  const partnershipMap = new Map();
  const stateLevelPotentialPartnerships = [];

  for (
    let partnershipLGAIndex = 0;
    partnershipLGAIndex < potentialPartnershipPerLGA.length;
    partnershipLGAIndex++
  ) {
    const currentLGA = potentialPartnershipPerLGA[partnershipLGAIndex];
    const potentialLGAPartnerships = [];
    for (let item = 0; item < arr.length; item++) {
      const currentStakeholder = arr[item];
      if (currentStakeholder.LGA === currentLGA['lgaName']) {
        //iterateLGAFocusAreas
        for (let item2 = 0; item2 < currentLGA['focusAreas'].length; item2++) {
          let currentFocusArea = currentLGA.focusAreas;
          currentFocusArea = currentFocusArea[item2]; //current focusAreaName
          if (currentStakeholder.focusArea === currentFocusArea.name) {
            // current stakeholder focus area
            const filteredPartnerships = filterStakeholderPartnerships(
              {
                id: currentStakeholder.stakeholderId,
                organisationName: currentStakeholder.organization
              },
              currentStakeholder['partnerships']
            );
            //check if any other stakeholder has the same focusArea
            for (
              let currentBeneficiaryIndex = 0;
              currentBeneficiaryIndex < arr.length;
              currentBeneficiaryIndex++
            ) {
              const currentPartnershipKey1 =
                currentFocusArea.name +
                currentStakeholder.stakeholderId +
                arr[currentBeneficiaryIndex].stakeholderId;
              const currentPartnershipKey2 =
                currentFocusArea.name +
                arr[currentBeneficiaryIndex].stakeholderId +
                currentStakeholder.stakeholderId;
              if (
                item !== currentBeneficiaryIndex &&
                !partnershipMap.has(currentPartnershipKey1) &&
                !partnershipMap.has(currentPartnershipKey2)
              ) {
                //check if current stakeholder and another single stakeholder has the same focus area
                if (
                  arr[currentBeneficiaryIndex].focusArea ===
                    currentFocusArea.name &&
                  arr[currentBeneficiaryIndex].LGA === currentStakeholder.LGA &&
                  currentStakeholder.stakeholderId !==
                    arr[currentBeneficiaryIndex].stakeholderId
                ) {
                  //check if the current stakeholder has a partnership with the other stakeholder in comparision
                  if (
                    !filteredPartnerships ||
                    filteredPartnerships.length === 0
                  ) {
                    potentialLGAPartnerships.push({
                      focusArea: currentFocusArea.name,
                      potentialPartnerOrganisations: [
                        arr[currentBeneficiaryIndex].organization,
                        currentStakeholder.organization
                      ]
                    });
                    partnershipMap.set(
                      currentFocusArea.name +
                        currentStakeholder.stakeholderId +
                        arr[currentBeneficiaryIndex].stakeholderId,
                      true
                    );
                    partnershipMap.set(
                      currentFocusArea.name +
                        arr[currentBeneficiaryIndex].stakeholderId +
                        currentStakeholder.stakeholderId,
                      true
                    );
                  }
                  // If the currentStakeholder has partnerships check if they have a partnership with
                  // the currently compared stakeholder and check that we also haven't duplicated the
                  // potential partnership
                  const partnershipStatus = hasPartnershipWithCurrentStakeholders(
                    currentStakeholder.stakeholderId,
                    arr[currentBeneficiaryIndex].stakeholderId,
                    currentFocusArea.name,
                    filteredPartnerships
                  );
                  if (
                    !partnershipMap.has(partnershipStatus.partnerkeys1) &&
                    !partnershipMap.has(partnershipStatus.partnerkeys2)
                  ) {
                    potentialLGAPartnerships.push({
                      focusArea: currentFocusArea.name,
                      potentialPartnerOrganisations: [
                        currentStakeholder.organization,
                        arr[currentBeneficiaryIndex].organization
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
    stateLevelPotentialPartnerships.push({
      lgaName: currentLGA['lgaName'],
      potentialLGAPartnerships: potentialLGAPartnerships,
      potentialLGAPartnershipsCount: potentialLGAPartnerships.length
    });
  }
  return stateLevelPotentialPartnerships;
}
