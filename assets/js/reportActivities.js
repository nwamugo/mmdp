const DOMStrings = {
  bodyElem: "body",
  popupClass: ".popup",
  mapHamburgerID: "#map-hamburger-popup",
  popupFeatureID: "#popup-feature",
  cssShow: "show",
  cssHamburgerDisplay: "hamburger-display",
  cssShowModal: "show-modal",
  cssCenter: "center-modal",
  pngBtnID: "#save-as-png",
  jpegBtnID: "#save-as-jpg",
  pdfBtnID: "#save-as-pdf",
  svgBtnID: "#save-svg",
  popupMenuClass: ".popup-menu",
  svgModalClass: ".svg-download-modal",
  downloadConfirm: ".download-confirm",
  downloadBeginClass: ".download-begin",
  downloadCancelClass: ".download-cancel",
  reportMapPillarsID: "#report-map-pillars",
  mapLegendsID: "#map-legends"
};

// destructure the DOMStrings object
const {
  bodyElem,
  popupClass,
  mapHamburgerID,
  popupFeatureID,
  cssShow,
  cssHamburgerDisplay,
  cssShowModal,
  cssCenter,
  pngBtnID,
  jpegBtnID,
  pdfBtnID,
  svgBtnID,
  popupMenuClass,
  svgModalClass,
  downloadConfirm,
  downloadBeginClass,
  downloadCancelClass,
  reportMapPillarsID,
  mapLegendsID
} = DOMStrings;

function getTrimmedStateNameFromUrl(type) {
  const stateNameFromUrl = window.location.search.substring(1).split("=")[1];
  if (!stateNameFromUrl) return false;
  let stateName =
    stateNameFromUrl.charAt(0).toUpperCase() + stateNameFromUrl.slice(1);

  switch (type) {
    case "locationUrl":
      return stateName;
    case "pdf":
    case "png":
    case "jpg":
    case "svg":
      return stateName.replace("%20", " ");
    case "btn":
      stateName = stateNameFromUrl.toLowerCase();
      return (stateName = stateName.replace("%20", "-"));
    default:
      break;
  }
}

function getPoint(x, y) {
  const svg = document.querySelector(reportMapPillarsID).querySelector("svg");
  let pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const SVGtoScreenInverse = svg.getScreenCTM().inverse();
  point = pt.matrixTransform(SVGtoScreenInverse);
  return point;
}

function getPillarsCoordinates(lgaId) {
  const lgaPath = document.getElementById(lgaId);

  // path client rect
  const lgaDOMRect = lgaPath.getBoundingClientRect();

  //get a position in the rect
  const positionX = lgaDOMRect.x + lgaDOMRect.width * 0.26;
  const positionY = lgaDOMRect.y + lgaDOMRect.height / 2;

  //get the area of the bounding rectangle
  const area = lgaDOMRect.width * lgaDOMRect.height;

  //get the coordinates of the point on the svg
  const svgPoint = getPoint(positionX, positionY);
  //Put all the points and lgaId together
  return { x: svgPoint.x, y: svgPoint.y, lgaId, area };
}

function getPotentialPartnershipsCountCoordinates(lgaId) {
  let points = [];
  const lgaPath = document.getElementById(lgaId);

  // path client rect
  let cr = lgaPath.getBoundingClientRect();
  const centerX = cr.x + cr.width * 0.416;
  let centerY = cr.y + cr.height * 0.5;
  // get a random point on the svg canvas
  let x = centerX;
  let y = centerY;
  //elementFromPoint returns the topmost Element at the specified coordinates (relative to the viewport).

  if (lgaPath && cr) {
    //get the coordinates of the point on the svg
    let svgPoint = getPoint(x, y);
    //draw a circle with the center on the svg point
    const lga = lgaId;
    points.push({ x: svgPoint.x, y: svgPoint.y, lga });
    return points;
  }

  return points;
}

function appendSymbol(id, pillarType, area) {
  const rectWidth = decideWidth(area);
  const rectHeight = decideHeight(area);

  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  // append pillarMarker to the SVG container
  const symbol = svgContainer
    .append('symbol')
    .attr('id', id)
    .attr('viewBox', '0 0 9 9');

    return pillarType ? pillarType.forEach((pillar, index) => {
      symbol
      .append('rect')
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .attr('x', 0)
      .attr('y', 3 - rectHeight * index)
      .attr('fill', getPillarColor(pillar));
  })  : false;
}

function addMarker(x, y, pillarId) {
  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  svgContainer
    .append('use')
    .attr('xlink:href', '#' + pillarId)
    .attr('width', 0.2)
    .attr('height', 0.2)
    .attr('x', x + 0.02)
    .attr('y', y - 0.1);
}

async function appendPotentialPartnershipsDefs(id, number, pillarType) {
  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  const lgaPath = document.getElementById(id);

  // append pillarMarker to the SVG container
  const defsContainer = svgContainer
    .append('defs')
    .append('symbol')
    .attr('id', 'defPotentialPartnerships' + id)
    .attr('fill', 'none')
    .attr('fill-rule', 'evenodd')
    .attr('viewBox', '-10 -34 50 50');

  const parent = document.getElementById('defPotentialPartnerships' + id);
  const group = d3.select(parent);

  group
    .append('image')
    .attr('x', -2)
    .attr('y', -12)
    .attr('width', 36)
    .attr('height', 36)
    .style('cursor', 'pointer')
    .attr(
      'xlink:href',
      'https://mmdp-img-assets.s3.amazonaws.com/assets/icons/hand-icon%402x.svg'
    );

  group
    .append('circle')
    .attr('r', 7.914)
    .attr('cy', -6.69)
    .attr('cx', 15.8)
    .style('cursor', 'pointer')
    .attr('fill', '#000');

  group
    .append('text')
    .attr('fill', '#FFF')
    .attr('font-size', 12)
    .attr('letter-spacing', -0.148)
    .attr('font-weight', 'bold')
    .append('tspan')
    .attr('x', 12)
    .attr('y', -4)
    .attr('id', 'tspan')
    .style('cursor', 'pointer')
    .html(number);

  group.on('click', function(e) {
    $(document).on('click', function(e) {
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      if (e.target.nodeName === 'use') {
        $('#display-map')
          .html(
            `${pillarType}
            <br />
            Number of potential partnership
            <br />
            ${number}
            <br />
            <a href="#table" id='${pillarType}' class="partnershipLink">View potential partnership / collaboration</a>`)
          .addClass('display-map')
          .css({
            display: 'block',
            top: mouseY - 180,
            left: mouseX - 160
          });
        getFilteredTable();
      } else {
        $('.display-map')
          .html('')
          .css({ display: 'none' });
      }
    });
  });
}

function addPotentialPartnershipsMarker(x, y, pillarId) {
  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  svgContainer
    .append('use') // add
    .attr('xlink:href', '#defPotentialPartnerships' + pillarId)
    .attr('id', 'use' + pillarId)
    .attr('width', 0.1)
    .attr('height', 0.1)
    .attr('x', x - 0.02742495015)
    .attr('y', y - 0.1);
}

function getFilteredTable() {
  $('.partnershipLink').on('click', async function(e) {
    if ($('#partnership-report-table').is(':visible')) {
      const dataForTable = await getPartnershipData();
      const data = window.stakeholderData;

      let stakeholderServicesArray = getStakeholderServicesArray([
        data.filteredStakeholders
      ]);

      const lgaName = e.currentTarget.id;
      const filter = lgaName => {
        const filteredData = dataForTable.filter(filtered => {
          return filtered.lga === lgaName;
        });
        const data = filteredData;
        return data;
      };
      const newTableData = filter(lgaName);
      window.partnershipsCsvTableData = newTableData;
      const tableData = newTableData.map(item => {
        item['ppRowId'] = getPotentialPartnershipRowId(
          item.lga,
          item.subThemeId,
          item.focusAreaId,
          stakeholderServicesArray
        );
        return item;
      });

      // Check if we created a filter object for the Partnerships Table Data
      // If so, use the current selected LGA based filter to to update the table data
      if(window.partnershipsTableHeaderFilter){
        window.partnershipsTableHeaderFilter.setFilteredTableDataResults(
            tableData
        );
        window.partnershipsTableHeaderFilter.refreshTableData();
      }
      // Otherwise create the potential partnerships table again
      else{
        createPotentialPartnershipsTable(tableData);
      }
    }
  });
}
function filteredLga(target, array = []) {
  return array.find(item => item.lgaName === target);
}

function getNumberOfServices(lgaServices, lgaName) {
  for (const lgaService of lgaServices) {
    if (lgaService.lgaName === lgaName) {
      return lgaService.serviceCount;
    }
  }
}

// map hamburger icon
$(popupClass).click(function() {
  const body = $(bodyElem);
  const popupMenu = $(popupMenuClass);
  const mapDownloadButtons = $(
    `${pngBtnID}, ${jpegBtnID}, ${pdfBtnID}, ${svgBtnID}`
  );
  const mapHamburger = $(mapHamburgerID)[0];
  mapHamburger.classList.toggle(cssShow);

  // map download buttons
  mapDownloadButtons.off("click");
  mapDownloadButtons.on("click", async function() {
    const stateName = getTrimmedStateNameFromUrl("btn");
    const errorString = "Unable to download map. <br /> Please try again";

    switch (this.id) {
      case pngBtnID.slice(1):
        convert(`${stateName}-gac-report-map.png`, "png")
          .catch(function(error) {
            toastr.error(errorString);
          });
        break;
      case jpegBtnID.slice(1):
        convert(`${stateName}-gac-report-map.jpg`, "jpg")
          .catch(function(error) {
            toastr.error(errorString);
          });
        break;
      case pdfBtnID.slice(1):
        convert(`${stateName}-gac-report-map.pdf`, "pdf")
          .catch(function(error) {
            toastr.error(errorString);
          });
        break;
      case svgBtnID.slice(1):
        convert(`${stateName}-gac-report-map.svg`, "svg")
          .then(toggleModal)
          .catch(function(error) {
            toastr.error(errorString);
          });
        break;
      default:
        break;
    }
  });

  //clicking on html body
  body.on("click", function(event) {
    if (!popupMenu.hasClass(cssShow)) body.off("click");
    else if (
      event.target.className !== "map-hamburger popup" &&
      event.target.className !== "popup-upper"
    ) {
      popupMenu.removeClass(cssShow);
      body.off("click");
    }
  });
});

function showHamburger() {
  const popupFeature = $(popupFeatureID)[0];
  popupFeature.classList.add(cssHamburgerDisplay);
}

// svg download confirmation modal
function insertHTML() {
  const modalBlock = `
  <div id="svg-confirmation-message" class="download-message">
  <p>
  The requested operation will download two separate files.
  </p>
  <p>Kindly allow multiple downloads on your browser.</p>
  </div>
  <button class="btn download-begin">Download</button>
  <button class="btn download-cancel">Cancel</button>
  `;
  $(downloadConfirm).html(modalBlock);
}

// two separate files download confirmation Modal
function toggleModal() {
  $(downloadConfirm)[0].classList.toggle(cssCenter);
  $(svgModalClass)[0].classList.toggle(cssShowModal);

  if ($(svgModalClass).hasClass(cssShowModal)) {
    $(downloadBeginClass).on("click", function() {
      const { svgArguments } = variablesUsedByTwoFxn;
      if (!svgArguments[0] || svgArguments.length > 4)
        return toastr.error(
          "No resource selected. <br /> Please refresh page and try again"
        );
      download(svgArguments[0], svgArguments[1], svgArguments[2], svgArguments[3]);
      toggleModal();
    });
    $(window).on("click", function(event) {
      if (event.target === $(svgModalClass)[0]) toggleModal();
    });
    
    $(downloadCancelClass).on("click", toggleModal);
  } else {
    $(downloadBeginClass).off("click");
    $(window).off("click");
    $(downloadCancelClass).off("click");
  }
}

(function() {
  async function loaded() {
    const stateName = getTrimmedStateNameFromUrl('locationUrl');
    if (!stateName) {
      window.location.href = `http://${locationUrl}/index-cordination-matrix.html`;
    }
  
    try {
      const stakeholderDataResponse = await fetch(
        `${MMDP_BASE_URL}/api/v1/location?state=${stateName}&focusAreaName`
        );
        const responsePromise = await fetch(
          `${MMDP_BASE_URL}/api/v1/state-map/${stateName}`
          );
          const response = await responsePromise.json();
          window.stakeholderData = await stakeholderDataResponse.json();
  
  
      const { thematicPillarCountPerLGA, potentialPartnershipPerLGA } = window.stakeholderData;
      const { stateUrl, lgaServices } = response.data;
      if (!stateUrl) {
        window.location.href = `http://${locationUrl}/index-cordination-matrix.html`;
      }
      const potentialPartnerships = getPotentialPartnershipsForLGAs(
        window.stakeholderData,
        potentialPartnershipPerLGA
      );
      $(reportMapPillarsID).load(stateUrl, function(responseTxt, statusTxt) {
        if (statusTxt === "success") {
          const [, xmlPart, svgPart] = responseTxt.match(
            /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
          );
          $(reportMapPillarsID).html(svgPart);
          $("g#Nigeria_LGA_Boundary")
            .parents("svg")
            .addClass("banner__image animated fadeInLeft slow state-map__svg");
          const pathFmeIds = responseTxt.match(/STL\d{6}/gm);
  
          pathFmeIds.forEach(pathFmeId => {
            const svgPath = document.querySelector(`[fme\\:id=${pathFmeId}]`);
  
            const lgaName = getLgaName(svgPath);

            const numberOfServicesReport = getNumberOfServices(
              lgaServices,
              lgaName
              );
  
            if (numberOfServicesReport > 80) {
              svgPath.setAttribute('fill', '#e72525');
            } else if (
              numberOfServicesReport > 40 &&
              numberOfServicesReport <= 80
            ) {
              svgPath.setAttribute('fill', '#e56466');
            } else if (
              numberOfServicesReport >= 6 &&
              numberOfServicesReport <= 40
            ) {
              svgPath.setAttribute('fill', '#e89090');
            } else {
              svgPath.setAttribute('fill', '#e7d9d9');
            }

            const svgPathId = `report-map__${lgaName}`;

            svgPath.setAttribute('id', svgPathId);
            svgPath.setAttribute('class', 'path');
            svgPath.innerHTML = `<title>${lgaName}</title>`;
            const lgaData = filteredLga(lgaName, thematicPillarCountPerLGA);

            if (lgaName && lgaData) {
              const lgaPotentialPartnershipData = filteredLga(
                lgaName,
                potentialPartnerships
              );
  
              if (
                lgaName &&
                lgaData &&
                lgaData.lgaName === lgaName &&
                lgaPotentialPartnershipData.potentialLGAPartnershipsCount > 0
              ) {
                const potentialPartnershipPoints = getPotentialPartnershipsCountCoordinates(
                  svgPathId,
                  lgaData.potentialLGAPartnershipsCount
                );
                if (potentialPartnershipPoints.length > 0) {
                  for (
                    let CoordinateIndex = 0;
                    CoordinateIndex < potentialPartnershipPoints.length;
                    CoordinateIndex++
                  ) {
                    const number =
                      lgaPotentialPartnershipData.potentialLGAPartnershipsCount;
                    appendPotentialPartnershipsDefs(
                      lgaName + CoordinateIndex,
                      number,
                      lgaName
                    );
                    addPotentialPartnershipsMarker(
                      potentialPartnershipPoints[CoordinateIndex].x,
                      potentialPartnershipPoints[CoordinateIndex].y,
                      lgaName + CoordinateIndex
                    );
                  }
                }
              }

              const coords = getPillarsCoordinates(svgPathId);
              const pillars = lgaData.pillars.map(item => item.name).sort((a, b) => a > b ? 1 : -1);
              const pillarsId = `map-pillars-icon__${lgaName}`;
              appendSymbol(pillarsId, pillars, coords.area);
              addMarker(coords.x, coords.y, pillarsId);
            }
          });
        }
        showHamburger();
      });
      insertHTML();
      makingThePotentialPartnershipTable();
      window.impactFactorTableData = getImpactFactorTableData();
      const backToStateBtn = document.getElementById('c-matrix-btn');
      backToStateBtn.addEventListener(
        'click',
        () =>
          (window.location.href = `http://${locationUrl}/state.html?state=${stateName}`)
      );
    } catch (error) {
      window.location.href =
        `http://${locationUrl}/state.html?state=${stateName}` ||
        `http://${locationUrl}/index-cordination-matrix.html`;
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
