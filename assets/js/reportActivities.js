function getPoint(x, y) {
  const svg = document
    .querySelector("#report-map-pillars")
    .querySelector("svg");
  let pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const SVGtoScreenInverse = svg.getScreenCTM().inverse();
  point = pt.matrixTransform(SVGtoScreenInverse);
  return point;
}

function getPillarsCoordinates(lgaId) {
  let pointsData = [];
  const lgaPath = document.getElementById(lgaId.replace(/ +/g, ''));

  // path client rect
  let lgaDOMRect = lgaPath.getBoundingClientRect();

  //get a position in the rect
  const positionX = lgaDOMRect.x + lgaDOMRect.width * 0.26;
  const positionY = lgaDOMRect.y + lgaDOMRect.height / 2;

  if (lgaPath && lgaDOMRect) {
    //get the coordinates of the point on the svg
    let svgPoint = getPoint(positionX, positionY);
    //Put all the points and lgaId together
    pointsData.push({ x: svgPoint.x, y: svgPoint.y, lgaId });
  }

  return pointsData;
}

function appendDefs(id, pillarType) {
  const svgContainer = d3.select('#report-map-pillars').select('svg');
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

function addMarker(x, y, pillarId) {
  const svgContainer = d3.select('#report-map-pillars').select('svg');
  svgContainer
    .append('use')
    .attr('xlink:href', '#def' + pillarId)
    .attr('id', '#use' + pillarId)
    .attr('width', 0.2)
    .attr('height', 0.2)
    .attr('x', x + 0.02)
    .attr('y', y - 0.1);
}

function filteredLga(target, array = []) {
  return array.find(item => {
    if (item.lgaName === "Igueben") return "Iguegben" === target;
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

(function() {
  const baseURL = window.location.host;
  let MMDP_BASE_URL;
  if (baseURL.includes("127.0.0.1") || baseURL.includes("localhost")) {
    MMDP_BASE_URL = "http://localhost:3000";
  } else {
    MMDP_BASE_URL = 'http://cms-staging.mmdp.ng:3000';
  }

  let stateName;

  async function loaded() {
    const stateNameFromUrl = window.location.search.substring(1).split('=')[1];
    if (!stateNameFromUrl) {
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
    }
    stateName =
      stateNameFromUrl.charAt(0).toUpperCase() + stateNameFromUrl.slice(1);

    try {
      const lgaPillarPromise = await fetch(
        `${MMDP_BASE_URL}/api/v1/location?state=${stateName}&focusAreaName`
      );
      const responsePromise = await fetch(
        `${MMDP_BASE_URL}/api/v1/state-map/${stateName}`
      );
      const response = await responsePromise.json();
      const data = await lgaPillarPromise.json();
      const { thematicPillarCountPerLGA } = data;
      const { stateUrl, lgaServices } = response.data;
      if (!stateUrl) {
        window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
      }
      $('#report-map-pillars').load(stateUrl, function(responseTxt, statusTxt) {
        if (statusTxt === 'success') {
          const [, xmlPart, svgPart] = responseTxt.match(
            /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
          );
          $('#report-map-pillars').html(svgPart);
          $('g#Nigeria_LGA_Boundary')
            .parents('svg')
            .addClass('banner__image animated fadeInLeft slow state-map__svg');
          const lgsIds = responseTxt.match(/STL\d{6}/gm);
          lgsIds.map(lgsId => {
            const svgPath = document.querySelector(`[fme\\:ID=${lgsId}]`);
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
            let lgaId = d3.select(lgaMap).attr(":fme:lga_name");
            lgaId = lgaId.replace(/\s+/g, " ");

            lgaMap.innerHTML = `<title>${lgaId}</title>`;
            const lgaData = filteredLga(lgaId, thematicPillarCountPerLGA);

            if (lgaId && lgaData) {
              lgaMap.setAttribute('id', lgaId.replace(/ +/g, ''));
              lgaMap.setAttribute('class', 'path');

              const points = getPillarsCoordinates(lgaId);

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
      });
    } catch (error) {
      window.location.href =
        `http://${baseURL}/state.html?state=${stateName}` ||
        `http://${baseURL}/index-cordination-matrix.html`;
    }
  }

  document.addEventListener('DOMContentLoaded', loaded, false);
})();
