getLgas = data => {
  let arr = [];
  let results = [data.filteredStakeholders];
  results.map(function(result) {
    result.forEach(element => {
      if (element['beneficiaries']) {
        arr.push({
          thematicPillar:
            element['beneficiaries'][0]['focusArea'].thematicPillarName
              .pillarName,
          subTheme:
            element['beneficiaries'][0]['focusArea'].subThemeName.subThemeName,
          organizationName: element['organisationName'],
          beneficiariesCount:
            element['beneficiaries'][0].beneficiaryTypes[0]
              .totalNumberOfBeneficiaries,
          amountInvested:
            element['beneficiaries'][0].fundingSources[0].amountInvestedRange
              .amountInvestedRange,
          service: element['beneficiaries'][0]['serviceName'],
          focusArea:
            element['beneficiaries'][0]['focusArea'].focusAreaName
              .focusAreaName,
          lga: element['beneficiaries'][0].communities[0].lgaId.lgaName
        });
      }
    });
  });
  return arr;
};

getFocusAreasByLga = arr => {
  let lgas = {}; //Create an object to storeLGAs
  for (item of arr) {
    //Loop through the initial array
    if (lgas[item.lga] === undefined) {
      //Add lgas to lgas object
      lgas[item.lga] = [];
    }
    if (lgas[item.lga][item.focusArea] === undefined) {
      //Add focusAreas to an lga object
      lgas[item.lga][item.focusArea] = [];
    }

    for (let lga in lgas) {
      //Loop through the lgas object
      for (let focusArea in lgas[lga]) {
        //Loop through focusAreas in the lga
        if (focusArea === item.focusArea && lga === item.lga) {
          //Add an item to a focusArea
          lgas[lga][focusArea].push(item);
        }
      }
    }
  }
  return lgas;
};

potentialPartnershipsByLga = arr => {
  let lgas = getFocusAreasByLga(arr);
  let potentialPartnerships = [];
  Object.keys(lgas).forEach(function(key) {
    //Loop through the lgas object
    for (item in lgas[key]) {
      //Loop through the lgas object items array
      if (lgas[key][item].length > 1) {
        // If the array has a length > 1, there is a potential partnership
        let potentialPartnership = [];

        lgas[key][item].forEach(function(item) {
          // Filter through the potential objects to get potentialPartnerNames and store them in an array
          var existing = potentialPartnership.filter(function(v, i) {
            return v.name == item.name;
          });
          if (existing.length) {
            var existingIndex = potentialPartnership.indexOf(existing[0]);
            potentialPartnership[
              existingIndex
            ].organizationName = potentialPartnership[
              existingIndex
            ].organizationName.concat(item.organizationName);
          } else {
            item.organizationName = [item.organizationName];
            potentialPartnership.push(item);
            potentialPartnerships.push(potentialPartnership);
          }
        });
      }
    }
  });

  return potentialPartnerships;
};
