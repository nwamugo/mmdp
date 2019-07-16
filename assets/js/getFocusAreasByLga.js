getLgas = data => {
  let arr = [];
  let results = data.filteredStakeholders;

  results.forEach(result => {
    result.beneficiaries.forEach(key => {
      let beneficiariesArr = key;
      arr.push({
        thematicPillar:
        beneficiariesArr['focusArea'].thematicPillarName.pillarName,
        subThemeId:
        beneficiariesArr['focusArea'].subThemeName
            ._id,
        subTheme: beneficiariesArr['focusArea'].subThemeName.subThemeName,
        organizationName: result['organisationName'],
        partnerships: result['partnerships'],
        beneficiariesCount:
        beneficiariesArr.beneficiaryTypes[0].totalNumberOfBeneficiaries,
        amountInvested:
        beneficiariesArr.fundingSources[0].amountInvestedRange
            .amountInvestedRange,
        service: beneficiariesArr['serviceName'],
        focusAreaId:
        beneficiariesArr['focusArea'].focusAreaName
            ._id,
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
    });
  });
  return arr;
};
getFocusAreasByLga = arr => {
  let lgas = {};
  for (let item of arr) {
    const { lga, focusArea } = item;
    for (let lgaIndex in lga) {
      let eachLga = lga[lgaIndex];
      // check to see if the lga is in the lgas Obj
      if (!lgas[eachLga]) {
        // if no, structure the obj as needed, and push the relevant item to it
        lgas[eachLga] = [];

        if (!lgas[eachLga][focusArea]) {
          lgas[eachLga][focusArea] = [];
        }
        lgas[eachLga][focusArea].push(item);
      } else if (lgas[eachLga]) {
        if (!lgas[eachLga][focusArea]) {
          lgas[eachLga][focusArea] = [];
        }
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
    for (focusArea in lgas[lga]) {
      // If the array has a length > 1, there is a potential partnership
      if (lgas[lga][focusArea].length > 1) {
        let focusAreaArr = lgas[lga][focusArea];

        let justTheSubThemes = [];
        let ourPotentialPartners = [];

        focusAreaArr.forEach(focusAreaRecord => {
          if (!justTheSubThemes.includes(focusAreaRecord['subTheme']))
            justTheSubThemes.push(focusAreaRecord['subTheme']);
        });

        if (justTheSubThemes.length === 1) {
          let linkedUpOrganisations = [];
          let theRemainingOrganizations = [];
          let multiplePotentialPartnerships = [];
          let indexLocation = 0;
          const { thematicPillar,subThemeId,focusAreaId, subTheme, organizationName } = focusAreaArr[0];

          focusAreaArr.forEach(focusAreaRecord => {
            let theOrganizationName = focusAreaRecord['organizationName'];
            if (!focusAreaRecord['partnerships'].length) {
              ourPotentialPartners.push(theOrganizationName);
            } else {
              theRemainingOrganizations.push(theOrganizationName);
              linkedUpOrganisations.push({ togetherWith: [] });
              focusAreaRecord['partnerships'].forEach(partnership => {
                const existingPartner =
                  partnership.stakeholder2Id['organisationName'];
                linkedUpOrganisations[indexLocation]['togetherWith'].push(
                  existingPartner
                );
              });
              indexLocation++;
            }
          });

          if (theRemainingOrganizations.length) {
            let allPotentialMatches = [];
            let capturedStakeholders = [];
            let count = 0;

            if (theRemainingOrganizations.length === 1) {
              ourPotentialPartners = ourPotentialPartners.concat(
                theRemainingOrganizations[0]
              );
            } else {
              for (let i = 0; i < theRemainingOrganizations.length - 1; i++) {
                let nextItem = 0;
                nextItem++;
                for (
                  let j = nextItem;
                  j < theRemainingOrganizations.length;
                  j++
                ) {
                  if (
                    !linkedUpOrganisations[i]['togetherWith'].includes(
                      theRemainingOrganizations[j]
                    )
                  ) {
                    capturedStakeholders.push(theRemainingOrganizations[i]);
                    let subPotentialMatches = [];
                    subPotentialMatches.push(
                      theRemainingOrganizations[i],
                      theRemainingOrganizations[j]
                    );
                    allPotentialMatches[count] = [];
                    allPotentialMatches[count] = ourPotentialPartners.concat(
                      subPotentialMatches
                    );
                    count++;
                  }
                }
              }
              for (let i = 0; i < theRemainingOrganizations.length; i++) {
                if (
                  !capturedStakeholders.includes(
                    theRemainingOrganizations[i]
                  ) &&
                  ourPotentialPartners.length
                ) {
                  allPotentialMatches[count] = [];
                  allPotentialMatches[count] = ourPotentialPartners.concat(
                    theRemainingOrganizations[i]
                  );
                  count++;
                }
              }
              multiplePotentialPartnerships = allPotentialMatches;
            }
          }
          if (multiplePotentialPartnerships.length) {
            multiplePotentialPartnerships.forEach(pair => {
              potentialPartnerships.push({
                thematicPillar,
                subTheme: justTheSubThemes[0],
                subThemeId,
                focusAreaId,
                focusArea,
                lga,
                organizationName: pair.join(', ')
              });
            });
          } else if (ourPotentialPartners.length > 1) {
            potentialPartnerships.push({
              thematicPillar,
              subTheme: justTheSubThemes[0],
              subThemeId,
              focusAreaId,
              focusArea,
              lga,
              organizationName: ourPotentialPartners.join(', ')
            });
          }
        }
        else if (justTheSubThemes.length > 1 && focusAreaArr.length > 2) {
          let linkedUpOrganisations = [];
          let partnershipHavingOrganizations = [];
          let ourPotentialPartners = [];
          let indexLocation = 0;
          let subThemeIndexTracker = 0;
          let stakeholdersIndex = 4;

          justTheSubThemes.forEach(subTheme => {
            ourPotentialPartners.push({ subTheme: [subTheme] });
            linkedUpOrganisations[subThemeIndexTracker] = [];
            partnershipHavingOrganizations[subThemeIndexTracker] = [];
            ourPotentialPartners[subThemeIndexTracker]['subTheme'][stakeholdersIndex] = [];

            for (let i = 0; i < focusAreaArr.length; i++) {
              if (focusAreaArr[i]['subTheme'] === subTheme) {
                if (
                  !ourPotentialPartners[subThemeIndexTracker][
                    'subTheme'
                  ].includes(focusAreaArr[i]['thematicPillar'])
                )
                  ourPotentialPartners[subThemeIndexTracker]['subTheme'][1] =
                    focusAreaArr[i]['thematicPillar'];
                if (
                    !ourPotentialPartners[subThemeIndexTracker][
                        'subTheme'
                        ].includes(focusAreaArr[i]['subThemeId'])
                )
                  ourPotentialPartners[subThemeIndexTracker]['subTheme'][2] =
                      focusAreaArr[i]['subThemeId'];
                if (
                    !ourPotentialPartners[subThemeIndexTracker][
                        'subTheme'
                        ].includes(focusAreaArr[i]['focusAreaId'])
                )
                  ourPotentialPartners[subThemeIndexTracker]['subTheme'][3] =
                      focusAreaArr[i]['focusAreaId'];
                if (!focusAreaArr[i]['partnerships'].length) {
                  ourPotentialPartners[subThemeIndexTracker][
                    'subTheme'
                  ][stakeholdersIndex].push(focusAreaArr[i]['organizationName']);
                } else {
                  partnershipHavingOrganizations[subThemeIndexTracker].push(
                    focusAreaArr[i]['organizationName']
                  );
                  linkedUpOrganisations[subThemeIndexTracker].push({
                    togetherWith: []
                  });
                  focusAreaArr[i]['partnerships'].forEach(partnership => {
                    if(linkedUpOrganisations[subThemeIndexTracker][indexLocation]){
                      const existingPartner =
                          partnership.stakeholder2Id['organisationName'];
                      linkedUpOrganisations[subThemeIndexTracker][indexLocation][
                          'togetherWith'
                          ].push(existingPartner);
                    }
                  });
                  indexLocation++;
                }
              }
            }
            if (partnershipHavingOrganizations[subThemeIndexTracker].length) {
              let allPotentialMatches = [];
              let capturedStakeholders = [];
              let count = 0;

              if (
                partnershipHavingOrganizations[subThemeIndexTracker].length === 1
              ) {
                ourPotentialPartners[subThemeIndexTracker][
                  'subTheme'
                ][stakeholdersIndex] = ourPotentialPartners[subThemeIndexTracker][
                  'subTheme'
                ][stakeholdersIndex].concat(partnershipHavingOrganizations[subThemeIndexTracker][0]);
              } else {
                arrayLength =
                  partnershipHavingOrganizations[subThemeIndexTracker].length;
                for (
                  let i = 0;
                  i <
                  partnershipHavingOrganizations[subThemeIndexTracker].length - 1;
                  i++
                ) {
                  let nextItem = 0;
                  nextItem++;
                  for (
                    let j = nextItem;
                    j < partnershipHavingOrganizations[subThemeIndexTracker].length;
                    j++
                  ) {
                    if (
                      !linkedUpOrganisations[subThemeIndexTracker][i][
                        'togetherWith'
                      ].includes(
                        partnershipHavingOrganizations[subThemeIndexTracker][j]
                      )
                    ) {
                      capturedStakeholders.push(
                        partnershipHavingOrganizations[subThemeIndexTracker][i]
                      );
                      let subPotentialMatches = [];
                      subPotentialMatches.push(
                        partnershipHavingOrganizations[subThemeIndexTracker][i],
                        partnershipHavingOrganizations[subThemeIndexTracker][j]
                      );
                      if (
                        subPotentialMatches.includes(
                          partnershipHavingOrganizations[subThemeIndexTracker][
                            arrayLength - 1
                          ]
                        ) &&
                        !capturedStakeholders.includes(
                          partnershipHavingOrganizations[subThemeIndexTracker][
                            arrayLength - 1
                          ]
                        )
                      ) {
                        capturedStakeholders.push(
                          partnershipHavingOrganizations[subThemeIndexTracker][
                            arrayLength - 1
                          ]
                        );
                      }
                      allPotentialMatches[count] = [];
                      allPotentialMatches[count] = ourPotentialPartners[
                        subThemeIndexTracker
                      ]['subTheme'][stakeholdersIndex].concat(subPotentialMatches);
                      count++;
                    }
                  }
                }
                for (
                  let i = 0;
                  i < partnershipHavingOrganizations[subThemeIndexTracker].length;
                  i++
                ) {
                  if (
                    !capturedStakeholders.includes(
                      partnershipHavingOrganizations[subThemeIndexTracker][i]
                    ) &&
                    ourPotentialPartners[subThemeIndexTracker][
                      'subTheme'
                    ][stakeholdersIndex] !== []
                  ) {
                    allPotentialMatches[count] = [];
                    allPotentialMatches[count] = ourPotentialPartners[
                      subThemeIndexTracker
                    ]['subTheme'][stakeholdersIndex].concat(
                      partnershipHavingOrganizations[subThemeIndexTracker][i]
                    );
                    count++;
                  }
                }
                ourPotentialPartners[subThemeIndexTracker]['subTheme'].pop();
                ourPotentialPartners[subThemeIndexTracker][
                  'subTheme'
                ] = ourPotentialPartners[subThemeIndexTracker][
                  'subTheme'
                ].concat(allPotentialMatches);
              }
            }
            subThemeIndexTracker++;
          });
          ourPotentialPartners.forEach(ourPotentialPartnership => {
            if (ourPotentialPartnership['subTheme'].length > 4) {
              // there is potential partnership
              if (
                ourPotentialPartnership['subTheme'].length < 6 &&
                ourPotentialPartnership['subTheme'][stakeholdersIndex].length > 1
              ) {
                potentialPartnerships.push({
                  thematicPillar: ourPotentialPartnership['subTheme'][1],
                  subTheme: ourPotentialPartnership['subTheme'][0],
                  subThemeId: ourPotentialPartnership['subTheme'][2],
                  focusAreaId: ourPotentialPartnership['subTheme'][3],
                  focusArea,
                  lga,
                  organizationName: ourPotentialPartnership['subTheme'][stakeholdersIndex].join(
                    ', '
                  )
                });
              } else if (ourPotentialPartnership['subTheme'].length > 5) {
                let justThePairings = ourPotentialPartnership[
                  'subTheme'
                ].filter(
                  element =>
                    ourPotentialPartnership['subTheme'].indexOf(element) > 4
                );
                potentialPartnerships.push({
                  thematicPillar: ourPotentialPartnership['subTheme'][1],
                  subTheme: ourPotentialPartnership['subTheme'][0],
                  focusArea,
                  subThemeId: ourPotentialPartnership['subTheme'][2],
                  focusAreaId: ourPotentialPartnership['subTheme'][3],
                  lga,
                  organizationName: justThePairings.join(', ')
                });
              }
            }
          });
        }
      }
    }
  });
  //Modify the _id so we get a unique value that will be used to export to csv
  for (let i = 0; i < potentialPartnerships.length; i++) {
    potentialPartnerships[i]['_id']= potentialPartnerships[i]['subThemeId'] + i;
  }
  return potentialPartnerships;
};
