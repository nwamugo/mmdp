getLgas = data => {
  let arr = [];
  let results = data.filteredStakeholders;

  results.forEach(result => {
    if (result['beneficiaries']) {
      let beneficiariesArr = result['beneficiaries'][0];

      arr.push({
        thematicPillar:
          beneficiariesArr['focusArea'].thematicPillarName.pillarName,
        subTheme: beneficiariesArr['focusArea'].subThemeName.subThemeName,
        organizationName: result['organisationName'],
        partnerships: result['partnerships'],
        beneficiariesCount:
          beneficiariesArr.beneficiaryTypes[0].totalNumberOfBeneficiaries,
        amountInvested:
          beneficiariesArr.fundingSources[0].amountInvestedRange
            .amountInvestedRange,
        service: beneficiariesArr['serviceName'],
        focusArea: beneficiariesArr['focusArea'].focusAreaName.focusAreaName,
        lga: (() => {
          let lgaArr = [];
          beneficiariesArr.communities.forEach(community => {
            if (!lgaArr.includes(community.lgaId.lgaName)) {
              lgaArr.push(community.lgaId.lgaName);
            }
          });
          return lgaArr;
        })()
      });
    }
  });
  return arr;
};

getFocusAreasByLga = arr => {
  let lgas = {};

  for (item of arr) {
    const { lga, focusArea } = item;
    for (let lgaIndex in lga) {
      let eachLga = lga[lgaIndex];
      // check to see if the lga is in the lgas Obj
      if (!lgas[eachLga]) {
        // if no, structure the obj as needed, and push the relevant item to it
        lgas[eachLga] = [];
        if (!lgas[eachLga][focusArea]) lgas[eachLga][focusArea] = [];
        lgas[eachLga][focusArea].push(item);
      } else if (lgas[eachLga]) {
        if (!lgas[eachLga][focusArea]) lgas[eachLga][focusArea] = [];
        lgas[eachLga][focusArea].push(item);
      }
    }
  }
  return lgas;
};

potentialPartnershipsByLga = arr => {
  let lgas = getFocusAreasByLga(arr);

  let potentialPartnerships = [];
  Object.keys(lgas).forEach(lga => {
    //Loop through the lgas key
    for (focusArea in lgas[lga]) {
      //Loop through the lgas object items array
      if (lgas[lga][focusArea].length > 1) {
        // If the array has a length > 1, there is a potential partnership
        let potentialPartnership = [];
        let focusAreaArr = lgas[lga][focusArea];
        const { thematicPillar, subTheme, organizationName } = focusAreaArr[0];
        let justTheSubThemes = [];

        for (let i = 0; i < focusAreaArr.length; i++) {
          if (!justTheSubThemes.includes(focusAreaArr[i]['subTheme']))
            justTheSubThemes.push(focusAreaArr[i]['subTheme']);
        }

        if (justTheSubThemes.length === 1) {
          let ourPotentialPartners = [];
          focusAreaArr.forEach(focusArea => {
            if (!focusArea['partnerships'].length) {
              ourPotentialPartners.push(focusArea.organizationName);
            } else {
              focusArea['partnerships'].forEach(partnership => {
                if (
                  !ourPotentialPartners.includes(
                    partnership.stakeholder2Id['organisationName']
                  )
                ) {
                  if (
                    !ourPotentialPartners.includes(focusArea.organizationName)
                  )
                    ourPotentialPartners.push(focusArea.organizationName);
                }
              });
            }
          });
          potentialPartnerships.push({
            thematicPillar,
            subTheme: justTheSubThemes[0],
            lga,
            organizationName: ourPotentialPartners.join(', ')
          });
        } else {
          justTheSubThemes = [];
        }
      }
    }
  });
  return potentialPartnerships;
};
