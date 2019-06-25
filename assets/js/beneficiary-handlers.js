function handleBeneficiaries(beneficiaries) {
  const extractedData = beneficiaries.reduce(
    (accum, beneficiary) => {
      let values;
      accum.thematicPillars.add(
        beneficiary.focusArea.thematicPillarName.pillarName
      );
      accum.subThemes.add(beneficiary.focusArea.subThemeName.subThemeName);
      accum.beneficiaryService.add(beneficiary.serviceName);
      accum.focusArea.add(beneficiary.focusArea.focusAreaName.focusAreaName);
      values = beneficiary.fundingSources.map(
        fundSource => fundSource.sourceOfFundingId.sourceOfFundingName
      );
      accum.fundingSources = accum.fundingSources.concat(values);
      values = beneficiary.fundingSources.map(
        fundSource => fundSource.amountInvestedRange.amountInvestedRange
      );
      accum.amountInvested = accum.amountInvested.concat(values);
      beneficiary.fundingSources[0].amountInvestedRange.amountInvestedRange;

      values = beneficiary.communities.map(
        community => community.communityId.communityName
      );

      accum.localCommunities = accum.localCommunities.concat(values);

      values = beneficiary.communities.map(
        community => community.lgaId.lgaName
      );
      accum.lgas = accum.lgas.concat(values);

      values = beneficiary.beneficiaryTypes.map(
        beneficiaryType => beneficiaryType.beneficiaryTypeId.beneficiaryTypeName
      );
      accum.beneficiaryTypes = accum.beneficiaryTypes.concat(values);

      accum.targetAudience.push(beneficiary.targetAudienceId.audienceType);

      //
      values = beneficiary.beneficiaryTypes.map(beneficiaryType => {
        return beneficiaryType.noOfFemaleBeneficiaries;
      });

      accum.totalNumberOfFemaleBeneficiaries = accum.totalNumberOfFemaleBeneficiaries.concat(
        values
      );
      //
      values = beneficiary.beneficiaryTypes.map(
        beneficiaryType => beneficiaryType.noOfMaleBeneficiaries
      );
      accum.totalNumberOfMaleBeneficiaries = accum.totalNumberOfMaleBeneficiaries.concat(
        values
      );
      return accum;
    },
    {
      thematicPillars: new Set(),
      subThemes: new Set(),
      amountInvested: [],
      focusArea: new Set(),
      fundingSources: [],
      beneficiaryService: new Set(),
      localCommunities: [],
      lgas: [],
      beneficiaryTypes: [],
      targetAudience: [],
      totalNumberOfFemaleBeneficiaries: [],
      totalNumberOfMaleBeneficiaries: []
    }
  );
  const benefitFemale = extractedData.totalNumberOfFemaleBeneficiaries.reduce(
    (sum, val) => sum + val,
    0
  );
  const benefitMale = extractedData.totalNumberOfMaleBeneficiaries.reduce(
    (sum, val) => sum + val,
    0
  );

  const benefitTotal = benefitMale + benefitFemale;
  const malePercent = Math.round(
    benefitTotal ? (parseInt(benefitMale) / parseInt(benefitTotal)) * 100 : 0
  );
  const femalePercent = benefitTotal ? 100 - malePercent : 0;
  return {
    thematicPillars: [...extractedData.thematicPillars].join(", "),
    subThemes: [...extractedData.subThemes].join(", "),
    focusArea: [...extractedData.focusArea].join(", "),
    beneficiaryService: [...extractedData.beneficiaryService].join(", "),
    fundingSources: [...new Set(extractedData.fundingSources)].join(", "),
    amountInvested: extractedData.amountInvested.join(", "),
    localCommunities: [...new Set(extractedData.localCommunities)].join(", "),
    lgas: [...new Set(extractedData.lgas)].join(", "),
    beneficiaryTypes: [...new Set(extractedData.beneficiaryTypes)].join(", "),
    targetAudience: [...new Set(extractedData.targetAudience)].join(", "),
    totalNumberOfBeneficiaries: benefitTotal,
    malePercent,
    femalePercent
  };
}

const getParnerships = partnerships => {
  return partnerships.reduce((arr, partners) => {
    arr.push(partners.stakeholder2Id.organisationName);
    return arr;
  }, []);
};

function handleStakeholdersData(data) {
  return data.map((stakeholder, index) => {
    const organisationName = stakeholder.organisationName;
    const partners = getParnerships(stakeholder.partnerships);
    const partnership = partners.length ? partners.join(", ") : "None";
    const founder = stakeholder.founder;
    const organisationType = stakeholder.organisationTypeId.typeName; // needs modification from the backend
    const notes = stakeholder.notes || "";
    const otherDetails = stakeholder.beneficiaries.reduce(
      (tempStore, beneficiary) => {
        tempStore.duration.add(beneficiary.duration);
        tempStore.thematicPillars.add(
          beneficiary.focusArea.thematicPillarName.pillarName
        );
        tempStore.subThemes.add(
          beneficiary.focusArea.subThemeName.subThemeName
        );
        tempStore.beneficiaryCount.add(beneficiary.totalNumberOfBeneficiaries);
        tempStore.amountInvested =
          beneficiary.fundingSources[0].amountInvestedRange.amountInvestedRange;

        tempStore.focusArea.add(
          beneficiary.focusArea.focusAreaName.focusAreaName
        );
        tempStore.fundingSources.add(
          beneficiary.fundingSources.map(
            fundSource => fundSource.sourceOfFundingId.sourceOfFundingName
          )
        ); // incomplete implementation
        tempStore.beneficiaryService.add(beneficiary.serviceName);
        tempStore.location.push(
          ...beneficiary.communities.map(community => community.lgaId.lgaName)
        );
        tempStore.stateLocation.push(
          ...beneficiary.communities.map(
            community => community.stateId.stateName
          )
        );
        return tempStore;
      },
      {
        thematicPillars: new Set(),
        subThemes: new Set(),
        beneficiaryCount: new Set(),
        amountInvested: 0,
        focusArea: new Set(),
        fundingSources: new Set(),
        beneficiaryService: new Set(),
        duration: new Set(),
        location: [],
        stateLocation: []
      }
    );
    // stringify beneficiary other details
    const stringifiedDetails = {
      thematicPillars: [...otherDetails.thematicPillars].join(", "),
      subThemes: [...otherDetails.subThemes].join(", "),
      beneficiaryCount: [...otherDetails.beneficiaryCount].reduce(
        (partial_sum, count) => partial_sum + count,
        0
      ),
      amountInvested: otherDetails.amountInvested,
      focusArea: [...otherDetails.focusArea].join(", "),
      fundingSources: [...otherDetails.fundingSources].join(", "),
      beneficiaryService: [...otherDetails.beneficiaryService].join(", "),
      duration: [...otherDetails.duration].join(", "),
      location: [...new Set(otherDetails.location)].join(", "),
      stateLocation: [...new Set(otherDetails.stateLocation)].join(", ")
    };
    return {
      id: index + 1,
      organisationName,
      organisationType,
      partnership,
      founder,
      notes,
      ...stringifiedDetails
    };
  });
}
