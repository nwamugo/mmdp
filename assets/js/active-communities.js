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
  let stateName;
  const baseURL = window.location.host;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const backToState = document.getElementById('back-state');

  stateName = getqueryName('stateName');

  backToState.innerText = `Back to ${stateName.replace('%20', ' ')} state`;
  backToState.addEventListener(
    'click',
    () =>
      (window.location.href = `http://${baseURL}/state.html?state=${stateName.replace(
        '%20',
        ' '
      )}`)
  );

  async function fetchCount() {
    let counts = [];
    let query;
    query = `lga=${lgaName}`;
    try {
      const stakeholderData = await fetch(
        `${MMDP_BASE_URL}/api/v1/location?${query}&focusAreaName`
      );
      const data = await stakeholderData.json();

      const {
        beneficiaryServicesCount,
        stakeholderCount,
        focusAreasCount
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
        uniqueNames
      );

      return counts;
    } catch (error) {}
  }

  // a function to get the svg coordinates of a point on the svg canvas
  function getPoint(x, y) {
    const svg = document.getElementById('svg');

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

  function setAttributes(node, attributes) {
    for (var name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        node.setAttributeNS(null, name, attributes[name]);
      }
    }
  }

  async function drawSvg(o, parent, number) {
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
      y: o.cy + 0.012
    };

    setAttributes(circle, o);
    setAttributes(text, textAttributes);

    text.textContent = number;

    group.appendChild(circle);
    group.appendChild(text);
    parent.appendChild(group);
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
      let x = cr.x + cr.width * 0.26;
      let y = cr.y + cr.height / 2;

      //elementFromPoint returns the topmost Element at the specified coordinates (relative to the viewport).
      let elmt = document.elementFromPoint(x, y);
      // if the point is in path
      if (elmt && elmt.className.baseVal === 'path' && elmt.id === 'thePath') {
        //get the coordinates of the point on the svg
        let svgPoint = getPoint(x, y);
        //draw a circle with the center on the svg point

        points.push({
          cx: svgPoint.x,
          cy: svgPoint.y
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

  function getCoord() {
    const lgaPath = document.getElementById('thePath');

    // svg client rect
    let cr = lgaPath.getBBox();

    let x = cr.x + cr.width * 0.5;
    let y = cr.y + cr.height * 0.5;

    let x1 = cr.x + cr.width * 0.5 + 0.052;

    return [{ x, y }, { x: x1, y }];
  }

  async function loaded() {
    lgaName = getqueryName('lgaName');
    const lgaSpan = document.getElementById('lga-name');
    lgaSpan.innerHTML = lgaName.replace('%20', ' ');
    try {
      const responsePromise = await fetch(
        `${MMDP_BASE_URL}/api/v1/matrix/lga?name=${lgaName}`
      );
      const response = await responsePromise.json();
      const { name, path } = response.data[0];
      if (!name) {
        window.location.href = `http://${baseURL}/state.html`;
      }

      appendMap(path);
      const svg = document.getElementById('svg');
      const hideMe = document.getElementById('remove');
      $('#show-active-div').click(function() {
        $('#show-active-div').hide();
        $('#lga-report-button').show();
        $('.red-marker').show();
        $('g').hide();
        $('#hide-active-div').toggle();

        fetchCommunities(MMDP_BASE_URL, lgaName, true);
      });

      $('#hide-active-div').click(function() {
        $('#hide-active-div').hide();
        $('#show-active-div').toggle();
        $('g').show();
        $('.red-marker').hide();
        $('#lga-report-button').hide();

        fetchCommunities(MMDP_BASE_URL, lgaName, false);
      });

      let bb = thePath.getBBox();
      //set the svg viewBox attribute
      svg.setAttributeNS(
        null,
        'viewBox',
        `${bb.x} ${bb.y} ${bb.width} ${bb.height}`
      );
      appendDefs();
      // add markers
      const points = getCoord();
      const counts = await fetchCount();
      let fill = ['red', 'green'];
      if (points.length > 0) {
        for (let i = 0; i <= points.length; i++) {
          if (typeof points[i] === 'object') {
            drawSvg(
              {
                fill: '#FFF',
                class: 'marker',
                stroke: fill[i],
                'stroke-width': 0.005,
                cx: points[i].x - 0.034,
                cy: points[i].y,
                r: 0.02
              },
              svg,
              counts[i]
            );
          }
        }
      }
    } catch (error) {
      throw error;
    }

    async function fetchCommunities(MMDP_BASE_URL, lgaName, showBtn = true) {
      lgaName = getqueryName('lgaName');
      const lgaSpan = document.getElementById('lga-name');
      lgaSpan.innerHTML = lgaName.replace('%20', ' ');
      try {
        const responsePromise = await fetch(
          `${MMDP_BASE_URL}/api/v1/matrix/lga?name=${lgaName}`
        );
        const response = await responsePromise.json();
        const { name, path } = response.data[0];
        if (!name) {
          window.location.href = `http://${baseURL}/state.html`;
        }

        appendMap(path);
        const svg = document.getElementById('svg');
        const thePath = document.getElementById('thePath');
        let bb = thePath.getBBox();
        //set the svg viewBox attribute
        svg.setAttributeNS(
          null,
          'viewBox',
          `${bb.x} ${bb.y} ${bb.width} ${bb.height}`
        );
        appendDefs();

        // add markers
        let servicesCount = await fetchCount();
        if (servicesCount) {
          var myStringArray = servicesCount[3];
          var arrayLength = myStringArray.length;
          for (var i = 0; i < arrayLength; i++) {
            communityName = myStringArray[i];
          }
        } else {
          return false;
        }

        const points = getCoordinates(arrayLength);
        if (points.length > 0 && showBtn) {
          for (let i = 0; i < points.length; i++) {
            drawCircle(
              {
                communityName: myStringArray[i],
                fill: 'red',
                class: 'red-marker',
                cx: points[i].cx,
                cy: points[i].cy,
                r: 0.004
              },
              svg
            );
          }
        }

        $('.red-marker')
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
                '</div>'
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
              left: mouseX - $('.info_panel').width() / 2
            });
          });
      } catch (error) {
        throw error;
      }
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, true);
})();
