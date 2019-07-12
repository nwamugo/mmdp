getLgas = data => {
  let arr = [];
  let results = data.filteredStakeholders;

  results.forEach(result => {
    result.beneficiaries.forEach(key => {
      let beneficiariesArr = key;
      arr.push({
        _id: beneficiariesArr['_id'],
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
          const { thematicPillar, _id } = focusAreaArr[0];

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
                focusArea,
                lga,
                organizationName: pair.join(', '),
                _id
              });
            });
          } else if (ourPotentialPartners.length > 1) {
            potentialPartnerships.push({
              thematicPillar,
              subTheme: justTheSubThemes[0],
              focusArea,
              lga,
              organizationName: ourPotentialPartners.join(', '),
              _id
            });
          }
        } else if (justTheSubThemes.length > 1 && focusAreaArr.length > 2) {
          let linkedUpOrganisations = [];
          let theRemainingOrganizations = [];
          let ourPotentialPartners = [];
          let indexLocation = 0;
          let subThemeIndexTracker = 0;

          justTheSubThemes.forEach(subTheme => {
            ourPotentialPartners.push({ subTheme: [subTheme] });
            linkedUpOrganisations[subThemeIndexTracker] = [];
            theRemainingOrganizations[subThemeIndexTracker] = [];
            ourPotentialPartners[subThemeIndexTracker]['subTheme'][2] = [];

            for (let i = 0; i < focusAreaArr.length; i++) {
              if (focusAreaArr[i]['subTheme'] === subTheme) {
                if (
                  !ourPotentialPartners[subThemeIndexTracker][
                    'subTheme'
                  ].includes(focusAreaArr[i]['thematicPillar'])
                )
                  ourPotentialPartners[subThemeIndexTracker]['subTheme'][1] =
                    focusAreaArr[i]['thematicPillar'];
                if (!focusAreaArr[i]['partnerships'].length) {
                  ourPotentialPartners[subThemeIndexTracker][
                    'subTheme'
                  ][2].push(focusAreaArr[i]['organizationName']);
                } else {
                  theRemainingOrganizations[subThemeIndexTracker].push(
                    focusAreaArr[i]['organizationName']
                  );
                  linkedUpOrganisations[subThemeIndexTracker].push({
                    togetherWith: []
                  });
                  focusAreaArr[i]['partnerships'].forEach(partnership => {
                    const existingPartner =
                      partnership.stakeholder2Id['organisationName'];
                    linkedUpOrganisations[subThemeIndexTracker][indexLocation][
                      'togetherWith'
                    ].push(existingPartner);
                  });
                  indexLocation++;
                }
              }
            }
            if (theRemainingOrganizations[subThemeIndexTracker].length) {
              let allPotentialMatches = [];
              let capturedStakeholders = [];
              let count = 0;

              if (
                theRemainingOrganizations[subThemeIndexTracker].length === 1
              ) {
                ourPotentialPartners[subThemeIndexTracker][
                  'subTheme'
                ][2] = ourPotentialPartners[subThemeIndexTracker][
                  'subTheme'
                ][2].concat(theRemainingOrganizations[subThemeIndexTracker][0]);
              } else {
                arrayLength =
                  theRemainingOrganizations[subThemeIndexTracker].length;
                for (
                  let i = 0;
                  i <
                  theRemainingOrganizations[subThemeIndexTracker].length - 1;
                  i++
                ) {
                  let nextItem = 0;
                  nextItem++;
                  for (
                    let j = nextItem;
                    j < theRemainingOrganizations[subThemeIndexTracker].length;
                    j++
                  ) {
                    if (
                      !linkedUpOrganisations[subThemeIndexTracker][i][
                        'togetherWith'
                      ].includes(
                        theRemainingOrganizations[subThemeIndexTracker][j]
                      )
                    ) {
                      capturedStakeholders.push(
                        theRemainingOrganizations[subThemeIndexTracker][i]
                      );
                      let subPotentialMatches = [];
                      subPotentialMatches.push(
                        theRemainingOrganizations[subThemeIndexTracker][i],
                        theRemainingOrganizations[subThemeIndexTracker][j]
                      );
                      if (
                        subPotentialMatches.includes(
                          theRemainingOrganizations[subThemeIndexTracker][
                            arrayLength - 1
                          ]
                        ) &&
                        !capturedStakeholders.includes(
                          theRemainingOrganizations[subThemeIndexTracker][
                            arrayLength - 1
                          ]
                        )
                      ) {
                        capturedStakeholders.push(
                          theRemainingOrganizations[subThemeIndexTracker][
                            arrayLength - 1
                          ]
                        );
                      }
                      allPotentialMatches[count] = [];
                      allPotentialMatches[count] = ourPotentialPartners[
                        subThemeIndexTracker
                      ]['subTheme'][2].concat(subPotentialMatches);
                      count++;
                    }
                  }
                }
                for (
                  let i = 0;
                  i < theRemainingOrganizations[subThemeIndexTracker].length;
                  i++
                ) {
                  if (
                    !capturedStakeholders.includes(
                      theRemainingOrganizations[subThemeIndexTracker][i]
                    ) &&
                    ourPotentialPartners[subThemeIndexTracker][
                      'subTheme'
                    ][2] !== []
                  ) {
                    allPotentialMatches[count] = [];
                    allPotentialMatches[count] = ourPotentialPartners[
                      subThemeIndexTracker
                    ]['subTheme'][2].concat(
                      theRemainingOrganizations[subThemeIndexTracker][i]
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
            if (ourPotentialPartnership['subTheme'].length > 2) {
              // there is potential partnership
              if (
                ourPotentialPartnership['subTheme'].length < 4 &&
                ourPotentialPartnership['subTheme'][2].length > 1
              ) {
                potentialPartnerships.push({
                  thematicPillar: ourPotentialPartnership['subTheme'][1],
                  subTheme: ourPotentialPartnership['subTheme'][0],
                  focusArea,
                  lga,
                  organizationName: ourPotentialPartnership['subTheme'][2].join(
                    ', ',
                    _id
                  )
                });
              } else if (ourPotentialPartnership['subTheme'].length > 3) {
                let justThePairings = ourPotentialPartnership[
                  'subTheme'
                ].filter(
                  element =>
                    ourPotentialPartnership['subTheme'].indexOf(element) > 1
                );
                potentialPartnerships.push({
                  thematicPillar: ourPotentialPartnership['subTheme'][1],
                  subTheme: ourPotentialPartnership['subTheme'][0],
                  focusArea,
                  lga,
                  organizationName: justThePairings.join(', '),
                  _id
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
    potentialPartnerships[i]['_id'] = potentialPartnerships[i]['_id'] + i;
  }
  return potentialPartnerships;
};
