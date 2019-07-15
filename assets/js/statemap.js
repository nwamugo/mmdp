// a function to get the svg coordinates of a point on the svg canvas
function getPoint(x, y) {
  const svg = document.querySelector("#svg-container").querySelector("svg");
  let p = svg.createSVGPoint();
  p.x = x;
  p.y = y;
  const ctm = svg.getScreenCTM().inverse();
  p = p.matrixTransform(ctm);
  return p;
}

// a function to get a random integer from an interval
function randomIntFromInterval(mn, mx) {
  return ~~(Math.random() * (mx - mn + 1) + mn);
}

function getCoordinates(lgaId, count) {
  let points = [];
  const lgaPath = document.getElementById(lgaId.replace(/ +/g, ""));
  let pillarIconCount = count;

  // path client rect
  let cr = lgaPath.getBoundingClientRect();

  let n = 0; //a counter

  for (let i = 0; i < 600; i++) {
    // get a random point on the svg canvas
    let x = randomIntFromInterval(cr.x, cr.x + cr.width);
    let y = randomIntFromInterval(cr.y, cr.y + cr.height);
    //elementFromPoint returns the topmost Element at the specified coordinates (relative to the viewport).
    let elmt = document.elementFromPoint(x, y);
    // if the point is in path

    if (
      elmt &&
      elmt.className.baseVal === "path" &&
      elmt.id === lgaId.replace(/ +/g, "")
    ) {
      //get the coordinates of the point on the svg
      let svgPoint = getPoint(x, y);
      //draw a circle with the center on the svg point
      const lga = lgaId.replace(/ +/g, "");
      points.push({ x: svgPoint.x, y: svgPoint.y, lga });

      //increase the counter
      n++;
    }
    // if you have already 4 points break the loop
    if (n === pillarIconCount) {
      break;
    }
  }

  return points;
}

function appendDefs(id, number, pillarType) {
  const svgContainer = d3.select("#svg-container").select("svg");
  // append pillarMarker to the SVG container
  svgContainer
    .append("defs")
    .append("symbol")
    .attr("id", "def" + id)
    .attr("class", pillarType.replace(/ +/g, ""))
    .attr("viewBox", "-10 -34 22 36")
    .append("g")
    .attr("fill", "none")
    .attr("fill-rule", "evenodd")
    .append("path")
    .attr("stroke", "black")
    .attr(
      "d",
      "m0, 1 l-8.8, -17.7 c-3.3, -6.6 1.4, -14.3 8.8, -14.3 l0, 0 c7.4, 0 12.1, 7.7 8.8, 14.3 l-8.8, 17.7 z "
    );

  const parent = document.getElementById("def" + id);
  const group = d3.select(parent);
  group
    .append("circle")
    .attr("r", 6.414)
    .attr("cy", -20.69)
    .attr("cx", 0.1)
    .attr("fill", "#FFF");
  group
    .append("text")
    .attr("fill", "#1A1F37")
    .attr("font-size", 8)
    .attr("letter-spacing", -0.148)
    .attr("font-weight", "bold")
    .append("tspan")
    .attr("x", -4)
    .attr("y", -18.69)
    .attr("id", "tspan")
    .html(number);
}

function addMarker(x, y, pillarId) {
  const svgContainer = d3.select("#svg-container").select("svg");
  svgContainer
    .append("use")
    .attr("xlink:href", "#def" + pillarId)
    .attr("id", "#use" + pillarId)
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

(function() {
  let MMDP_BASE_URL;
  if (
    window.location.host.includes("127.0.0.1") ||
    window.location.host.includes("localhost")
  ) {
    MMDP_BASE_URL = "http://localhost:3000";
  } else {
    MMDP_BASE_URL = "http://cms-staging.mmdp.ng:3000";
  }
  let stateName;
  const baseURL = window.location.host;

  function getNumberOfServices(lgaServices, lgaName) {
    for (const lgaService of lgaServices) {
      if (lgaService.lgaName === lgaName) {
        return lgaService.serviceCount;
      }
    }
  }
  function handleMapClick(lgaName) {
    window.location.href = `http://${baseURL}/lga.html?lga=${lgaName}`;
  }
  async function loaded() {
    const stateNameFromUrl = window.location.search.substring(1).split("=")[1];
    if (!stateNameFromUrl) {
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
    }
    stateName =
      stateNameFromUrl.charAt(0).toUpperCase() + stateNameFromUrl.slice(1);
    const stateSpan = document.getElementById("state-name");
    stateSpan ? (stateSpan.innerHTML = stateName.replace("%20", " ")) : null;
    try {
      const responsePromise = await fetch(
        `${MMDP_BASE_URL}/api/v1/state-map/${stateName}`
      );
      const response = await responsePromise.json();
      const { stateUrl, lgaServices } = response.data;
      if (!stateUrl) {
        window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
      }
      $("#svg-container").load(stateUrl, function(responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
          const [, xmlPart, svgPart] = responseTxt.match(
            /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
          );
          $("#svg-container").html(svgPart);
          $("g#Nigeria_LGA_Boundary")
            .parents("svg")
            .addClass("banner__image state-map__svg");
          const lgsIds = responseTxt.match(/STL\d{6}/gm);

          let lgasArray = [];
          lgsIds.map(lgsId => {
            const svgPath = document.querySelector(`[fme\\:id=${lgsId}]`);

            const lgaName = svgPath.getAttribute("fme:lga_name");
            const numberOfServices = getNumberOfServices(lgaServices, lgaName);
            if (numberOfServices >= 35) {
              svgPath.setAttribute("fill", "#296d81");
            } else if (numberOfServices < 35 && numberOfServices >= 25) {
              svgPath.setAttribute("fill", "#83c4d8");
            } else if (numberOfServices < 25 && numberOfServices >= 5) {
              svgPath.setAttribute("fill", "#bad9e3");
            } else if (numberOfServices < 5) {
              svgPath.setAttribute("fill", "#eaf9fe");
            } else {
              svgPath.setAttribute("fill", "#eaf9fe");
            }

            svgPath.innerHTML = `<title>${lgaName}</title>`;
            svgPath.addEventListener(
              "click",
              () => handleMapClick(lgaName),
              false
            );
            lgasArray.push(lgaName);
            window.variable = lgasArray;
          });

          $("#show-pillars").click(async function() {
            $(".hide-pillar-icons").show();
            $("#show-pillars").hide();
            $("#hide-pillars").toggle();
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
              const { stateUrl } = response.data;
              if (!stateUrl) {
                window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
              }
              $("#svg-container").load(stateUrl, function(
                responseTxt,
                statusTxt
              ) {
                if (statusTxt === "success") {
                  const [, xmlPart, svgPart] = responseTxt.match(
                    /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
                  );

                  $("#svg-container").html(svgPart);
                  $("g#Nigeria_LGA_Boundary")
                    .parents("svg")
                    .addClass("banner__image state-map__svg");
                  document.querySelectorAll("path").forEach(lgaMap => {
                    // select lga_name as the lgaId
                    const lgaId = d3.select(lgaMap).attr(":fme:lga_name");
                    const numberOfServices = getNumberOfServices(
                      lgaServices,
                      lgaId
                    );
                    if (numberOfServices >= 35) {
                      lgaMap.setAttribute("fill", "#296d81");
                    } else if (
                      numberOfServices < 35 &&
                      numberOfServices >= 25
                    ) {
                      lgaMap.setAttribute("fill", "#83c4d8");
                    } else if (numberOfServices < 25 && numberOfServices >= 5) {
                      lgaMap.setAttribute("fill", "#bad9e3");
                    } else if (numberOfServices < 5) {
                      lgaMap.setAttribute("fill", "#eaf9fe");
                    } else {
                      lgaMap.setAttribute("fill", "#eaf9fe");
                    }

                    lgaMap.innerHTML = `<title>${lgaId}</title>`;
                    const lgaData = filteredLga(
                      lgaId,
                      thematicPillarCountPerLGA
                    );

                    if (lgaId && lgaData) {
                      lgaMap.setAttribute("id", lgaId.replace(/ +/g, ""));
                      lgaMap.setAttribute("class", "path");
                      const count = lgaData.pillars.length;
                      const points = getCoordinates(lgaId, count);

                      if (points.length > 0) {
                        for (let i = 0; i <= points.length - 1; i++) {
                          const number = lgaData.pillars[i].count;
                          const pillar = lgaData.pillars[i].name;
                          appendDefs(lgaId + i, number, pillar);
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
          });

          $("#hide-pillars").click(function() {
            window.location.href = `http://${baseURL}/state.html?state=${stateName}`;
          });
        }
      });
      const stateReportBtn = document.getElementById("state-report-btn");
      stateReportBtn.addEventListener(
        "click",
        () =>
          (window.location.href = `http://${baseURL}/state-report.html?state=${stateName}`)
      );
    } catch (error) {
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
    }
  }
  document.addEventListener("DOMContentLoaded", loaded, false);
})();
