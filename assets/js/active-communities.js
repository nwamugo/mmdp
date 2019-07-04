(function() {
  let MMDP_BASE_URL;
  if (
    window.location.host.includes('127.0.0.1') ||
    window.location.host.includes('localhost')
  ) {
    MMDP_BASE_URL = 'http://localhost:3000';
  } else {
    MMDP_BASE_URL = 'http://cms-staging.mmdp.ng:3000';
  }

  let lgaName;
  const baseURL = window.location.host;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const link = document.getElementById('hide-active');
  link.addEventListener(
    'click',
    () => (window.location.href = `http://${baseURL}/lga.html?lga=${lgaName}`),
  );

  const backToEdo = document.getElementById('back-edo');
  backToEdo.addEventListener(
    'click',
    () => (window.location.href = `http://${baseURL}/state.html?state=Edo`),
  );

  async function fetchCount() {
    let counts = [];
    let query;
    query = `lga=${lgaName}`;
    try {
      const stakeholderData = await fetch(
        `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName`,
      );
      const data = await stakeholderData.json();
      const {
        beneficiaryServicesCount,
        stakeholderCount,
        focusAreasCount,
      } = data;
      const communities = data.filteredStakeholders.map(community => {
        return community.beneficiaries[0].communities;
      });

      const commArray = communities.reduce(function(arr, e) {
        return arr.concat(e);
      });
      const commName = commArray.map(name => {
        return name.communityId.communityName;
      });
      var uniqueNames = [];
      $.each(commName, function(i, el) {
        if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
      });
      counts.push(
        beneficiaryServicesCount,
        stakeholderCount,
        focusAreasCount,
        uniqueNames,
      );
      return counts;
    } catch (error) {}
  }

  // a function to get a random integer from an interval
  function randomIntFromInterval(mn, mx) {
    return ~~(Math.random() * (mx - mn + 1) + mn);
  }

  // a function to get the svg coordinates of a point on the svg canvas
  function getPoint(x, y) {
    var p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    var ctm = svg.getScreenCTM().inverse();
    var p = p.matrixTransform(ctm);
    return p;
  }

  // a function to draw a circle
  function drawCircle(o, parent) {
    var circle = document.createElementNS(SVG_NS, 'circle');
    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        circle.setAttributeNS(null, name, o[name]);
      }
    }
    parent.appendChild(circle);
    return circle;
  }

  function appendMap(path) {
    d3.select('#svg-container')
      .append('svg')
      .attr('fill', 'none')
      .attr('height', 584)
      .attr('width', 521)
      .attr('id', 'svg')
      .attr('transform', 'scale(1.0)')
      .append('path')
      .attr('id', 'thePath')
      .attr('class', 'path')
      .attr('d', path)
      .attr('fill', '#bad9e3')
      .attr('stroke', 'none')
      .attr('stroke-width', 1);
  }

  function appendDefs() {
    // appending the circle to show focus areas count
    d3.select('svg')
      .append('defs')
      .append('symbol')
      .attr('id', 'mark')
      .attr('viewBox', '1.2 1.7 16 16')
      .append('g')
      .attr('transform', 'translate(0.0625 0.0475)')
      .append('circle')
      .attr('r', 0.5)
      .attr('cx', 8)
      .attr('cy', 8)
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .attr('stroke-width', 0.001);
  }

  function getCoordinates(count) {
    let points = [];
    const lgaPath = document.getElementById('thePath');
    // svg client rect
    let cr = lgaPath.getBoundingClientRect();

    let circlesLength = count;
    if (circlesLength == 0) {
      return;
    }

    let n = 0; //a counter

    for (let i = 0; i < 100; i++) {
      // get a random point on the svg canvas
      let x = randomIntFromInterval(cr.x, cr.x + cr.width);
      let y = randomIntFromInterval(cr.y, cr.y + cr.height);

      //elementFromPoint returns the topmost Element at the specified coordinates (relative to the viewport).
      let elmt = document.elementFromPoint(x, y);
      // if the point is in path
      if (elmt && elmt.className.baseVal === 'path' && elmt.id === 'thePath') {
        //get the coordinates of the point on the svg
        let svgPoint = getPoint(x, y);
        //draw a circle with the center on the svg point

        points.push({
          cx: svgPoint.x,
          cy: svgPoint.y,
        }),
          //increase the counter
          n++;
      }
      // if you have allready 6 points break the loop
      if (n == circlesLength) {
        break;
      }
    }
    return points;
  }

  async function loaded() {
    const lgaNameFromUrl = window.location.search.substring(1).split('=')[1];
    lgaName = lgaNameFromUrl.charAt(0).toUpperCase() + lgaNameFromUrl.slice(1);
    const lgaSpan = document.getElementById('lga-name');
    lgaSpan.innerHTML = lgaName.replace('%20', ' ');
    try {
      const responsePromise = await fetch(
        `${MMDP_BASE_URL}/api/v1/matrix/lga?name=${lgaName}`,
      );
      const response = await responsePromise.json();
      const { name, path } = response.data[0];
      if (!name) {
        window.location.href = `http://${baseURL}/state.html`;
      }

      appendMap(path);
      const svg = document.getElementById('svg');

      let bb = thePath.getBBox();
      //set the svg viewBox attribute
      svg.setAttributeNS(
        null,
        'viewBox',
        `${bb.x} ${bb.y} ${bb.width} ${bb.height}`,
      );
      appendDefs();
      let stakeName;

      // add markers
      const servicesCount = await fetchCount();
      var myStringArray = servicesCount[3];
      var arrayLength = myStringArray.length;
      for (var i = 0; i < arrayLength; i++) {
        //Do something
        communityName = myStringArray[i];
      }

      const points = getCoordinates(arrayLength);
      for (let i = 0; i < points.length; i++) {
        drawCircle(
          {
            communityName: myStringArray[i],
            fill: 'red',
            class: 'marker',
            cx: points[i].cx,
            cy: points[i].cy,
            r: 0.004,
          },
          svg,
        );
      }

      $('.marker')
        .mouseover(function(e) {          
          var community = $(this).attr('communityName') || '';
          var stakeholders = servicesCount[1];
          var focusarea = servicesCount[2];
          var services = servicesCount[0];
          $(
            '<div class="info_panel">' +
              '<div class="community">Community Name: ' +
              community +
              '</div><br>' +
              '<div class="counts">Stakeholders: ' +
              stakeholders +
              '<br>' +
              'Focus Area: ' +
              focusarea +
              '<br>' +
              'Services: ' +
              services +
              '</div><br>' +
              '</div>',
          ).appendTo('body');
        })
        .mouseleave(function() {
          $('.info_panel').remove();
        })
        .mousemove(function(e) {          
          var mouseX = e.pageX,
            mouseY = e.pageY;            

          $('.info_panel').css({
            top: mouseY - 50,
            left: mouseX - $('.info_panel').width() / 2,
          });
        });
    } catch (error) {
      throw(error);
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, true);
})();
