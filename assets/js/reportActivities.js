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
  const svgContainer = d3.select("#report-map-pillars").select("svg");
  // append pillarMarker to the SVG container
  svgContainer
    .append("defs")
    .append("symbol")
    .attr("id", "def" + id)
    .attr("viewBox", "0 0 9 9")
    .append("g")
    .attr("fill", "none");

  const parent = document.getElementById("def" + id);
  const group = d3.select(parent);

  if (pillarType.length) {
    if (pillarType.includes("Pillar 4")) {
      group
        .append("rect")
        .attr("width", 2)
        .attr("height", 1)
        .attr("rx", 0.2)
        .attr("ry", 0.2)
        .attr("fill", "#ed7d31");
    }
    if (pillarType.includes("Pillar 3")) {
      group
        .append("rect")
        .attr("width", 2)
        .attr("height", 1)
        .attr("x", 0)
        .attr("y", 1)
        .attr("rx", 0.2)
        .attr("ry", 0.2)
        .attr("fill", "#ffc000");
    }
    if (pillarType.includes("Pillar 2")) {
      group
        .append("rect")
        .attr("width", 2)
        .attr("height", 1)
        .attr("fill", "#4472c4")
        .attr("x", 0)
        .attr("y", 2)
        .attr("rx", 0.2)
        .attr("ry", 0.2);
    }
    if (pillarType.includes("Pillar 1")) {
      group
        .append("rect")
        .attr("width", 2)
        .attr("height", 1)
        .attr("rx", 0.2)
        .attr("ry", 0.2)
        .attr("x", 0)
        .attr("y", 3)
        .attr("fill", "#00b050");
    }
  }
}

async function appendPotentialPartnershipsDefs(id, number, pillarType) {
  const svgContainer = d3.select("#report-map-pillars").select("svg");
  const lgaPath = document.getElementById(id);

  // append pillarMarker to the SVG container
  const defsContainer = svgContainer
    .append("defs")
    .append("symbol")
    .attr("id", "defPotentialPartnerships" + id)
    .attr("fill", "none")
    .attr("fill-rule", "evenodd")
    .attr("viewBox", "-10 -34 50 50");

  const parent = document.getElementById("defPotentialPartnerships" + id);
  const group = d3.select(parent);

  group
    .append("image")
    .attr("x", -2)
    .attr("y", -12)
    .attr("width", 36)
    .attr("height", 36)
    .style("cursor", "pointer")
    .attr(
      "xlink:href",
      "https://mmdp-img-assets.s3.amazonaws.com/assets/icons/hand-icon%402x.svg"
    );

  group
    .append("circle")
    .attr("r", 7.914)
    .attr("cy", -6.69)
    .attr("cx", 15.8)
    .style("cursor", "pointer")
    .attr("fill", "#000");

  group
    .append("text")
    .attr("fill", "#FFF")
    .attr("font-size", 12)
    .attr("letter-spacing", -0.148)
    .attr("font-weight", "bold")
    .append("tspan")
    .attr("x", 12)
    .attr("y", -4)
    .attr("id", "tspan")
    .style("cursor", "pointer")
    .html(number);

  group.on("click", function(e) {
    $(document).on("click", function(e) {
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      if (e.target.nodeName === "use") {
        $("#display-map")
          .html(
            `${pillarType}
            <br /> 
            Number of potential partnership 
            <br /> 
            ${number} 
            <br /> 
            <a href="#table" id='${pillarType}' class="partnershipLink">View potential partnership / collaboration</a>`
          )
          .addClass("display-map")
          .css({
            display: "block",
            top: mouseY - 180,
            left: mouseX - 160
          });
        function getFilteredTable() {
          $(".partnershipLink").on("click", async function(e) {
            if($("#partnership-report-table").is(":visible")){
              const dataForTable = await getPartnershipData();
              const lgaName = e.currentTarget.id;
              const filter = lgaName => {
                const filteredData = dataForTable.filter(filtered => {
                  return filtered.lga === lgaName;
                });
                const data = filteredData;
                return data;
              };
              const newTableData = filter(lgaName);
              const keys = [
                "thematicPillar",
                "focusArea",
                "subTheme",
                "lga",
                "organizationName",
                "_id"
              ];
  
              $("#potential-partnerships-table").load(
                "/partials/potential-partnerships-table.html",
                function() {
                  let table = "potential partnerships";
                  const paginator = new Paginator(newTableData, keys, table);
                  paginator.potentialPartnershipsTable = true;
                  potentialPartnershipsTableData = paginator.initialPage();
  
                  $("#partnership-report-data").html(
                    potentialPartnershipsTableData
                  );
                  $("#partnership-table-mobile").html(
                    potentialPartnershipsTableData
                  );
                  let n = 5;
                  let options = "";
                  while (n < 51) {
                    if (n === 10) {
                      options += `<option selected>${n}</option>\n`;
                    } else {
                      options += `<option>${n}</option>\n`;
                    }
                    n += 5;
                  }
                  $("select#entries-per-page").html(options);
                  $("select#entries-per-page").change(function() {
                    paginator.entriesPerPage = this.value;
                    paginator.refreshTableBody();
                  });
                  $("#next-page").click(function() {
                    paginator.nextPage();
                  });
                  $("#previous-page").click(function() {
                    paginator.previousPage();
                  });
                }
              );
            }
          });
        }
        getFilteredTable();
      } else {
        $(".display-map")
          .html("")
          .css({ display: "none" });
      }
    });
  });
}

function addMarker(x, y, pillarId) {
  const svgContainer = d3.select("#report-map-pillars").select("svg");
  svgContainer
    .append("use")
    .attr("xlink:href", "#def" + pillarId)
    .attr("id", "#use" + pillarId)
    .attr("width", 0.2)
    .attr("height", 0.2)
    .attr("x", x + 0.02)
    .attr("y", y - 0.1);
}

function addPotentialPartnershipsMarker(x, y, pillarId) {
  const svgContainer = d3.select("#report-map-pillars").select("svg");
  svgContainer
    .append("use") // add
    .attr("xlink:href", "#defPotentialPartnerships" + pillarId)
    .attr("id", "use" + pillarId)
    .attr("width", 0.1)
    .attr("height", 0.1)
    .attr("x", x - 0.02742495015)
    .attr("y", y - 0.1);
}

function filteredLga(target, array = []) {
  return array.find(item => {
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
    MMDP_BASE_URL = "http://cms-staging.mmdp.ng:3000";
  }

  let stateName;

  async function loaded() {
    const stateNameFromUrl = window.location.search.substring(1).split("=")[1];
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

      const { thematicPillarCountPerLGA, potentialPartnershipPerLGA } = data;
      const { stateUrl, lgaServices } = response.data;
      if (!stateUrl) {
        window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
      }
      const potentialPartnerships = getPotentialPartnershipsForLGAs(
        data,
        potentialPartnershipPerLGA
      );
      $("#report-map-pillars").load(stateUrl, function(responseTxt, statusTxt) {
        if (statusTxt === "success") {
          const [, xmlPart, svgPart] = responseTxt.match(
            /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
          );
          $("#report-map-pillars").html(svgPart);
          $("g#Nigeria_LGA_Boundary")
            .parents("svg")
            .addClass("banner__image animated fadeInLeft slow state-map__svg");
          const lgsIds = responseTxt.match(/STL\d{6}/gm);

          lgsIds.map(lgsId => {
            const svgPath = document.querySelector(`[fme\\:id=${lgsId}]`);

            const lgaName = svgPath.getAttribute("fme:lga_name");
            const numberOfServicesReport = getNumberOfServices(
              lgaServices,
              lgaName
            );

            if (numberOfServicesReport > 80) {
              svgPath.setAttribute("fill", "#e72525");
            } else if (
              numberOfServicesReport > 40 &&
              numberOfServicesReport <= 80
            ) {
              svgPath.setAttribute("fill", "#e56466");
            } else if (
              numberOfServicesReport >= 6 &&
              numberOfServicesReport <= 40
            ) {
              svgPath.setAttribute("fill", "#e89090");
            } else if (numberOfServicesReport <= 5) {
              svgPath.setAttribute("fill", "#e7d9d9");
            } else {
              svgPath.setAttribute("fill", "#e7d9d9");
            }
            svgPath.innerHTML = `<title>${lgaName}</title>`;
          });

          document.querySelectorAll("path").forEach(lgaMap => {
            // select lga_name as the lgaId
            const lgaId = d3.select(lgaMap).attr(":fme:lga_name");

            lgaMap.innerHTML = `<title>${lgaId}</title>`;
            const lgaData = filteredLga(lgaId, thematicPillarCountPerLGA);
            if (lgaId && lgaData) {
              lgaMap.setAttribute("id", lgaId);
              lgaMap.setAttribute("class", "path");

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
      });
    } catch (error) {
      window.location.href =
        `http://${baseURL}/state.html?state=${stateName}` ||
        `http://${baseURL}/index-cordination-matrix.html`;
    }
  }

  document.addEventListener("DOMContentLoaded", loaded, false);
})();
