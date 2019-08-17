let variablesUsedByTwoFxn = {
  svgArguments: []
};

const DOMStrings = {
  bodyElem: "body",
  popupClass: ".popup",
  mapHamburgerID: "#map-hamburger-popup",
  popupFeature: "#popup-feature",
  cssShow: "show",
  cssHamburgerDisplay: "hamburger-display",
  cssShowModal: "show-modal",
  cssCenter: "center-modal",
  pngBtnID: "#save-as-png",
  jpegBtnID: "#save-as-jpg",
  pdfBtnID: "#save-as-pdf",
  svgBtnID: "#save-svg",
  popupMenuClass: ".popup-menu",
  svgModalMessageID: "#svg-confirmation-message",
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
  popupFeature,
  cssShow,
  cssHamburgerDisplay,
  cssShowModal,
  cssCenter,
  pngBtnID,
  jpegBtnID,
  pdfBtnID,
  svgBtnID,
  popupMenuClass,
  svgModalMessageID,
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
    case "baseURL":
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
  let pointsData = [];
  const lgaPath = document.getElementById(lgaId);

  // path client rect
  let lgaDOMRect = lgaPath.getBoundingClientRect();

  //get a position in the rect
  const positionX = lgaDOMRect.x + lgaDOMRect.width * 0.26;
  let positionY = lgaDOMRect.y + lgaDOMRect.height / 2;

  if (lgaPath && lgaDOMRect) {
    //get the coordinates of the point on the svg
    let svgPoint = getPoint(positionX, positionY);
    //Put all the points and lgaId together
    pointsData.push({ x: svgPoint.x, y: svgPoint.y, lgaId });
  }
  return pointsData;
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

function appendDefs(id, pillarType) {
  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  // append pillarMarker to the SVG container
  svgContainer
    .append('defs')
    .append('symbol')
    .attr('id', 'def' + id)
    .attr('viewBox', '0 0 9 9')
    .append('g')
    .attr('fill', 'none');

  const parent = document.getElementById('def' + id);
  const group = d3.select(parent);

  if (pillarType.length) {
    if (pillarType.includes('Pillar 4')) {
      group
        .append('rect')
        .attr('width', 2)
        .attr('height', 1)
        .attr('rx', 0.2)
        .attr('ry', 0.2)
        .attr('fill', '#ed7d31');
    }
    if (pillarType.includes('Pillar 3')) {
      group
        .append('rect')
        .attr('width', 2)
        .attr('height', 1)
        .attr('x', 0)
        .attr('y', 1)
        .attr('rx', 0.2)
        .attr('ry', 0.2)
        .attr('fill', '#ffc000');
    }
    if (pillarType.includes('Pillar 2')) {
      group
        .append('rect')
        .attr('width', 2)
        .attr('height', 1)
        .attr('fill', '#4472c4')
        .attr('x', 0)
        .attr('y', 2)
        .attr('rx', 0.2)
        .attr('ry', 0.2);
    }
    if (pillarType.includes('Pillar 1')) {
      group
        .append('rect')
        .attr('width', 2)
        .attr('height', 1)
        .attr('rx', 0.2)
        .attr('ry', 0.2)
        .attr('x', 0)
        .attr('y', 3)
        .attr('fill', '#00b050');
    }
  }
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
<a href="#table" id='${pillarType}' class="partnershipLink">View potential partnership / collaboration</a>`
          )
          .addClass('display-map')
          .css({
            display: 'block',
            top: mouseY - 180,
            left: mouseX - 160
          });
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
        getFilteredTable();
      } else {
        $('.display-map')
          .html('')
          .css({ display: 'none' });
      }
    });
  });
}

function addMarker(x, y, pillarId) {
  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  svgContainer
    .append('use')
    .attr('xlink:href', '#def' + pillarId)
    .attr('id', '#use' + pillarId)
    .attr('width', 0.2)
    .attr('height', 0.2)
    .attr('x', x + 0.02)
    .attr('y', y - 0.1);
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

function filteredLga(target, array = []) {
  return array.find(item => {
    if (item.lgaName === 'Igueben') return 'Iguegben' === target;
    return item.lgaName === target;
  });
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
  const popup = $(mapHamburgerID)[0];
  popup.classList.toggle(cssShow);
});

function showHamburger() {
  const popup = $(popupFeature)[0];
  popup.classList.add(cssHamburgerDisplay);
}

// map download buttons
$(`${pngBtnID}, ${jpegBtnID}, ${pdfBtnID}, ${svgBtnID}`).on(
  "click",
  function() {
    const stateName = getTrimmedStateNameFromUrl("btn");

    switch (this.id) {
      case pngBtnID.slice(1):
        convert(`${stateName}-gac-report-map.png`, "png");
        break;
      case jpegBtnID.slice(1):
        convert(`${stateName}-gac-report-map.jpg`, "jpg");
        break;
      case pdfBtnID.slice(1):
        convert(`${stateName}-gac-report-map.pdf`, "pdf");
        break;
      case svgBtnID.slice(1):
        convert(`${stateName}-gac-report-map.svg`, "svg");
        break;
      default:
        break;
    }
  }
);

$(bodyElem).on("click", function(event) {
  if (event.target.className !== "map-hamburger popup") {
    if (event.target.className !== "popup-upper") {
      $(popupMenuClass).removeClass(cssShow);
    }
  }
});

// svg download confirmation modal
function insertHTML() {
  const modalBlock = `
  <p>
  The requested operation will download two separate files.
  </p>
  <p>Kindly allow multiple downloads on your browser.</p>`;
  $(svgModalMessageID).html(modalBlock);
}

function toggleModal() {
  $(downloadConfirm)[0].classList.toggle(cssCenter);
  $(svgModalClass)[0].classList.toggle(cssShowModal);
}

$(downloadBeginClass).on("click", function() {
  const { svgArguments } = variablesUsedByTwoFxn;
  if (!svgArguments[0] || svgArguments.length > 4)
    return toastr.error(
      "No resource selected. <br /> Please refresh page and try again"
    );
  download(svgArguments[0], svgArguments[1], svgArguments[2], svgArguments[3]);
  return toggleModal();
});

$(window).on("click", function(event) {
  if (event.target === $(svgModalClass)[0]) {
    return toggleModal();
  }
});

$(downloadCancelClass).on("click", toggleModal);

// download function of file
function download(filename, url, filename2, url2) {
  const elem = window.document.createElement("a");
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
  if (filename2) {
    setTimeout(() => {
      download((filename = filename2), (url = url2));
    }, 2000);
  }
}

// create desirable file format
function convert(fileName, type) {
  const svgContainer = d3.select(reportMapPillarsID).select("svg");
  const svgNode = svgContainer["_groups"][0][0];
  const mapData = new XMLSerializer().serializeToString(svgNode);

  const legendNode = $(mapLegendsID)[0];

  const mapCanvas = document.createElement("canvas");
  const jointCanvas = document.createElement("canvas");

  const widthDimension4Map = (mapCanvas.width = 704);
  const heightDimension4Map = (mapCanvas.height = 600);
  const widthDimension4Legend = 214;
  const heightDimension4Legend = 172;

  html2canvas(legendNode)
    .then(function(legendCanvas) {
      try {
        canvg(mapCanvas, mapData);
        finalizeConversion(
          mapData,
          mapCanvas,
          legendCanvas,
          jointCanvas,
          widthDimension4Map,
          heightDimension4Map,
          widthDimension4Legend,
          heightDimension4Legend,
          fileName,
          type
          );
      } catch (error) {
        toastr.error("Unable to download map. <br /> Please try again");
      }
    });
}

function finalizeConversion(
  mapData,
  mapCanvas,
  legendCanvas,
  jointCanvas,
  widthDimension4Map,
  heightDimension4Map,
  widthDimension4Legend,
  heightDimension4Legend,
  fileName,
  type
) {
  const mapDataUrl = mapCanvas.toDataURL("image/png");
  const legendDataUrl = legendCanvas.toDataURL("image/png");

  const stateName = getTrimmedStateNameFromUrl(type);
  if (type === "pdf") {
    const pdf = new jsPDF("l", "px", "a4");
    pdf.setFontSize(18);
    pdf.text(
      `Gap Analysis and Collaboration Report - ${stateName} State`,
      20,
      20
    );

    pdf.addImage(mapDataUrl, "PNG", 20, 30, 450, 400);
    pdf.addImage(legendDataUrl, "PNG", 500, 360, 120, 80);

    pdf.save(fileName);
  } else if (type === "svg") {
    const legendElem = window.document.createElement("svg");
    legendElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    legendElem.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    legendElem.style.position = "fixed";
    legendElem.style.top = "50%";
    legendElem.style.left = "50%";
    legendElem.style.transform = "translate(-5%, -18%)";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "image");
    svg.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      legendDataUrl
    );

    document.body.appendChild(legendElem);
    legendElem.appendChild(svg);

    const legendElemGeneratedUrl =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(legendElem.outerHTML);
    const mapGeneratedUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(mapData);
    document.body.removeChild(legendElem);

    toggleModal();

    variablesUsedByTwoFxn["svgArguments"] = [];
    return variablesUsedByTwoFxn["svgArguments"].push(
      fileName,
      mapGeneratedUrl,
      `${stateName.toLowerCase()}-report-legend.svg`,
      legendElemGeneratedUrl
    );
  } else {
    let imageLoaded = 0;

    function checkload(event) {
      imageLoaded++;
      if (imageLoaded < 2) {
        return;
      }

      const jointCanvasCtx = jointCanvas.getContext("2d");
      jointCanvas.width = widthDimension4Legend + widthDimension4Map + 120;
      jointCanvas.height = heightDimension4Legend + heightDimension4Map;

      jointCanvasCtx.drawImage(
        mapImage,
        50,
        50,
        widthDimension4Map,
        heightDimension4Map
      );
      jointCanvasCtx.drawImage(legendImage, 790, 50, 220, 180);

      let jointCanvasDataUrl;
      if (type === "jpg") {
        const imageData = jointCanvasCtx.getImageData(
          0,
          0,
          jointCanvas.width,
          jointCanvas.height
        );
        const compositeOperation = jointCanvasCtx.globalCompositeOperation;

        jointCanvasCtx.globalCompositeOperation = "destination-over";
        jointCanvasCtx.fillStyle = "#fff";
        jointCanvasCtx.fillRect(0, 0, jointCanvas.width, jointCanvas.height);

        jointCanvasDataUrl = jointCanvas.toDataURL("image/jpeg");

        jointCanvasCtx.clearRect(0, 0, jointCanvas.width, jointCanvas.height);
        jointCanvasCtx.putImageData(imageData, 0, 0);
        jointCanvasCtx.globalCompositeOperation = compositeOperation;
      } else {
        jointCanvasDataUrl = jointCanvas.toDataURL("image/png");
      }
      download(fileName, jointCanvasDataUrl);
    }

    const mapImage = new Image();
    mapImage.onload = checkload;
    mapImage.src = mapDataUrl;

    const legendImage = new Image();
    legendImage.onload = checkload;
    legendImage.src = legendDataUrl;
  }
}

(function() {
  const baseURL = window.location.host;
  let MMDP_BASE_URL;
  if (baseURL.includes('127.0.0.1') || baseURL.includes('localhost')) {
    MMDP_BASE_URL = 'http://localhost:3000';
  } else {
    MMDP_BASE_URL = 'http://cms-staging.mmdp.ng:3000';
  }
  
  async function loaded() {
    const stateName = getTrimmedStateNameFromUrl('baseURL');
    if (!stateName) {
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
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
        window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
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
          const lgsIds = responseTxt.match(/STL\d{6}/gm);
  
          lgsIds.map(lgsId => {
            const svgPath = document.querySelector(`[fme\\:id=${lgsId}]`);
  
            const lgaName = svgPath.getAttribute('fme:lga_name');
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
            } else if (numberOfServicesReport <= 5) {
              svgPath.setAttribute('fill', '#e7d9d9');
            } else {
              svgPath.setAttribute('fill', '#e7d9d9');
            }
            svgPath.innerHTML = `<title>${lgaName}</title>`;
          });
  
          document.querySelectorAll('path').forEach(lgaMap => {
            // select lga_name as the lgaId
            let lgaId = d3.select(lgaMap).attr(':fme:lga_name');
            lgaId = lgaId.replace(/\s+/g, ' ');
  
            lgaMap.innerHTML = `<title>${lgaId}</title>`;
            const lgaData = filteredLga(lgaId, thematicPillarCountPerLGA);
            if (lgaId && lgaData) {
              lgaMap.setAttribute('id', lgaId);
              lgaMap.setAttribute('class', 'path');
  
              const points = getPillarsCoordinates(lgaId);
              const lgaPotentialPartnershipData = filteredLga(
                lgaId,
                potentialPartnerships
              );
  
              if (
                lgaId &&
                lgaData &&
                lgaData.lgaName === lgaId &&
                lgaPotentialPartnershipData.potentialLGAPartnershipsCount > 0
              ) {
                const potentialPartnershipPoints = getPotentialPartnershipsCountCoordinates(
                  lgaId,
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
                      lgaId + CoordinateIndex,
                      number,
                      lgaId
                    );
                    addPotentialPartnershipsMarker(
                      potentialPartnershipPoints[CoordinateIndex].x,
                      potentialPartnershipPoints[CoordinateIndex].y,
                      lgaId + CoordinateIndex
                    );
                  }
                }
              }
  
              if (points.length > 0) {
                for (let i = 0; i <= points.length - 1; i++) {
                  const eachPillar = lgaData.pillars.map(item => item.name);
                  appendDefs(lgaId + i, eachPillar);
                  addMarker(points[i].x, points[i].y, lgaId + i);
                }
              }
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
          (window.location.href = `http://${baseURL}/state.html?state=${stateName}`)
      );
    } catch (error) {
      window.location.href =
        `http://${baseURL}/state.html?state=${stateName}` ||
        `http://${baseURL}/index-cordination-matrix.html`;
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
