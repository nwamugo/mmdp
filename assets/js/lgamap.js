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

  // link to show active communities
  const link = document.getElementById('show-active');
  link.addEventListener(
    'click',
    () =>
      (window.location.href = `http://${baseURL}/active-communities.html?lga=${lgaName}`),
  );

  // link to go back to edo state
  const backToEdo = document.getElementById('back-edo');
  backToEdo.addEventListener(
    'click',
    () => (window.location.href = `http://${baseURL}/state.html?state=Edo`),
  );

  // function to fetch the data to be dispayed in our markers.
  async function fetchCount() {
    let query;
    let counts = [];
    query = `lga=${lgaName}`;
    try {
      const stakeholderData = await fetch(
        `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName`,
      );
      const data = await stakeholderData.json();
      const { focusAreasCount, beneficiaryServicesCount } = data;
      counts.push(focusAreasCount, beneficiaryServicesCount);
      return counts;
    } catch (error) {}
  }

  function setAttributes(node, attributes) {
    for (var name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        node.setAttributeNS(null, name, attributes[name]);
      }
    }
  }
  // a function to draw a circle
  async function drawCircle(o, parent, number) {
    var circle = document.createElementNS(SVG_NS, 'circle');
    var group = document.createElementNS(SVG_NS, 'g');
    var text = document.createElementNS(SVG_NS, 'text');

    const textAttributes = {
      'text-anchor': 'middle',
      stroke: 'black',
      'stroke-width': 0.001,
      fill: '#1A1F37',
      'font-family': 'Muli-ExtraBold, Muli',
      'font-size': 0.03,
      'font-weight': 200,
      'letter-spacing': 0.001,
      x: o.cx,
      y: o.cy + 0.012,
    };

    setAttributes(circle, o);
    setAttributes(text, textAttributes);

    text.textContent = number;

    group.appendChild(circle);
    group.appendChild(text);
    parent.appendChild(group);
    return circle;
  }

  // function to append the path element in our SVG
  function appendMap(path) {
    d3.select('#svg-container')
      .append('svg')
      .attr('fill', 'none')
      .attr('height', 521)
      .attr('width', 584)
      .attr('id', 'svg')
      .append('path')
      .attr('id', 'thePath')
      .attr('class', 'path')
      .attr('d', path)
      .attr('fill', '#bad9e3')
      .attr('stroke', 'none')
      .attr('stroke-width', 1);
  }

  // function to get the locations of our markers
  function getCoord() {
    const lgaPath = document.getElementById('thePath');

    // svg client rect
    let cr = lgaPath.getBBox();

    let x = cr.x + cr.width * 0.5;
    let y = cr.y + cr.height * 0.5;

    let x1 = cr.x + cr.width * 0.5 + 0.052;

    return [{ x, y }, { x: x1, y }];
  }

  // function to load the map
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

      // add markers
      const points = getCoord();
      const counts = await fetchCount();
      let fill = ['red', 'green'];
      for (let i = 0; i <= points.length; i++) {
        drawCircle(
          {
            fill: '#FFF',
            class: 'marker',
            stroke: fill[i],
            'stroke-width': 0.005,
            cx: points[i].x - 0.034,
            cy: points[i].y,
            r: 0.02,
          },
          svg,
          counts[i],
        );
      }
    } catch (error) {
      // window.location.href = `http://${baseURL}/state.html`;
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, true);
})();
