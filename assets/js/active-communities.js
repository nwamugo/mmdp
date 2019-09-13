(function() {
  let lgaName;
  let stateName;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const backToState = document.getElementById('back-state');

  stateName = getqueryName('stateName');

  backToState.innerText = `Back to ${stateName.replace('%20', ' ')} state`;
  backToState.addEventListener(
    'click',
    () =>
      (window.location.href = `http://${locationUrl}/state.html?state=${stateName.replace(
        '%20',
        ' '
      )}`)
  );

  async function fetchCount(lgaName) {
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
        focusAreasCount,
      } = data;

      let services = [];
      const uniqueFocusAreas = new Set();
      for (const stakeholder of data.filteredStakeholders) {
        for (const beneficiary of stakeholder.beneficiaries) {
          let focusAreaName = beneficiary.focusArea.focusAreaName.focusAreaName;
          uniqueFocusAreas.add(focusAreaName);
          services.push(beneficiary.serviceName);
        }
      }

      let servicesCount = services.length;

      const communities = data.filteredStakeholders.map(community => {
        return community.beneficiaries[0].communities;
      });

      const commArray = communities.reduce(function(arr, e) {
        return arr.concat(e);
      });

      const commName = commArray.map(name => {
        return name.communityId.communityName;
      });

      let uniqueNames = [];
      $.each(commName, function(i, el) {
        if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
      });

      counts['uniqueNames'] = uniqueNames;

      counts.push(
        focusAreasCount,
        servicesCount,
        [...uniqueFocusAreas],
        services,
        'Focus Areas',
        'Services',
        beneficiaryServicesCount,
        stakeholderCount
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

  function createPopupList(list) {
    let unorderedList = document.createElement('ol');
    for (const item of list) {
      let listItem = document.createElement('li');
      let span = document.createElement('span');
      span.innerHTML = item;
      listItem.innerHTML = span.outerHTML;
      unorderedList.appendChild(listItem);
    }
    return unorderedList;
  }

  function appendCircle(svg) {
    const circleIconX = 5;
    const circleIconY = 7.5;
    const circleIconRadius = 11;
    svg
      .append('circle')
      .attr('r', circleIconRadius)
      .attr('cx', circleIconX)
      .attr('cy', circleIconY)
      .attr('fill', '#fff')
      .style('cursor', 'pointer')
      .attr('stroke', 'red')
      .attr('stroke-width', 3)
      .attr('class', 'focus-area-icon');

    svg
      .append('circle')
      .attr('r', circleIconRadius)
      .attr('cx', circleIconX + 26)
      .attr('cy', circleIconY)
      .attr('fill', '#fff')
      .style('cursor', 'pointer')
      .attr('stroke', 'green')
      .attr('stroke-width', 3)
      .attr('class', 'services-icon');
  }

  function appendText(svg, numberOne, numberTwo) {
    // if the number is composed with one digit, return 0 otherwise return the number
    // of digits and subtract it from the current x axis in order to center the text
    const textXOne =
      2 - (`${numberOne}`.length === 1 ? 0 : `${numberOne}`.length * 2);
    const textYOne = 10;

    const textXTwo =
      28 - (`${numberTwo}`.length === 1 ? 0 : `${numberTwo}`.length * 2);
    const textYTwo = 10;

    svg
      .append('text')
      .attr('fill', 'black')
      .attr('font-size', 10.5)
      .attr('font-weight', 'bold')
      .attr('x', textXOne)
      .attr('y', textYOne)
      .attr('class', 'focus-area-icon')
      .style('cursor', 'pointer')
      .html(numberOne);

    svg
      .append('text')
      .attr('fill', 'black')
      .attr('font-size', 10.5)
      .attr('font-weight', 'bold')
      .attr('x', textXTwo)
      .attr('y', textYTwo)
      .attr('class', 'services-icon')
      .style('cursor', 'pointer')
      .html(numberTwo);
  }

  function showPopup(menu, icon) {
    //get the position of the placeholder element
    let rect = $(icon)[0].getBoundingClientRect();
    //show the menu directly over the placeholder
    $(menu).css({
      position: 'fixed',
      zIndex: 5000,
      display: 'block',
      left: `${rect.x - 50}px`,
      top: `${rect.y - 100}px`,
    });
    $('#popup .top-bar b').css({
      fontSize: '17px',
      textAlign: 'left',
    });
    $('#popup .top-bar ol li').css({
      fontSize: '14px',
      textAlign: 'left',
    });
    $(window).scroll(function(e) {
      rect = $(icon)[0].getBoundingClientRect();
      if ($(menu).css('display') === 'block') {
        $(menu).css({
          position: 'fixed',
          zIndex: 5000,
          display: 'block',
          left: `${rect.x - 50}px`,
          top: `${rect.y - 100}px`,
        });
      }
    });
    $(window).click(function(e) {
      const { nodeName } = $(e.target)[0];
      if (nodeName !== 'circle' && nodeName !== 'text') {
        $(menu).css({
          display: 'none',
        });
      }
    });
  }

  function drawSvgIcons(counts) {
    let title = '';
    let list = [];

    let popUp = document.getElementById('popup');
    $('#svg-container-icons circle, #svg-container-icons text').on(
      'click',
      function(e) {
        $('#myPopup').html('');
        let popupContent = document.createElement('div');
        let popupTitle = document.createElement('b');
        if ($(this).hasClass('focus-area-icon')) {
          title = counts[4];
          list = counts[2];
        } else if ($(this).hasClass('services-icon')) {
          title = counts[5];
          list = counts[3];
        }
        popupTitle.innerHTML = title;

        let popupList = createPopupList(list);

        popupContent.appendChild(popupTitle);
        popupContent.appendChild(popupList);

        $('#myPopup').html(popupContent);
        showPopup(popUp, this);
      }
    );

    const pathRectangle = $('#thePath')[0].getBoundingClientRect();

    const { x, y } = createMapGrid({
      clientRect: pathRectangle,
      cellSize: 46,
      maxNumberOfNeighbors: 8,
      minNumberOfNeighbors: 4,
      showGrid: false,
    });

    $('#svg-container-icons').css({
      top: y + 20,
      left: x,
      display: 'block',
    });

    $(window).scroll(() => {
      $('#svg-container-icons').css({
        top: y + 20 - window.scrollY,
        left: x,
      });
    });
  }

  function appendMap(path, counts) {
    const mainSvg = d3.select('#svg-container').append('svg');
    mainSvg
      .attr('transform', 'scale(1.0)')
      .style('-ms-transform', 'scaleY(-1)')
      .style('-webkit-transform', 'scaleY(-1)')
      .style('transform', 'scaleY(-1)')
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

    let bboxRect = $('#thePath')[0].getBBox();

    mainSvg.attr(
      'viewBox',
      `${bboxRect.x} ${bboxRect.y} ${bboxRect.width} ${bboxRect.height}`
    );

    const interval = setInterval(() => {
      if (bboxRect.width > 0 || bb.height > 0) {
        clearInterval(interval);
      }
      bboxRect = $('#thePath')[0].getBBox();
      svg.setAttributeNS(
        null,
        'viewBox',
        `${bboxRect.x} ${bboxRect.y} ${bboxRect.width} ${bboxRect.height}`
      );
    }, 100);

    if (counts.length > 0 && counts[0] && counts[1]) {
      $('#svg-container').append(`<div id="svg-container-icons"></div>`);

      $('#svg-container-icons').css({
        width: '90px',
        height: '46px',
        position: 'fixed',
        display: 'none',
      });

      const mainSvgIcons = d3.select('#svg-container-icons').append('svg');

      mainSvgIcons
        .attr('id', 'active-communities-map-icons')
        .attr('width', 80)
        .attr('height', 72)
        .attr('viewBox', `${-5} ${-5} ${46} ${46}`);

      appendCircle(mainSvgIcons);
      appendText(mainSvgIcons, counts[0], counts[1]);

      drawSvgIcons(counts);
    }
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
      //get the coordinates of the point on the svg
      let svgPoint = getPoint(x, y);
      let path = d3.select('path');
      // check if point is in fill
      let isInFill = isPointInFill(svgPoint, path);

      // if the point is in path fill
      if (
        elmt &&
        elmt.className.baseVal === 'path' &&
        elmt.id === 'thePath' &&
        isInFill
      ) {
        //draw a circle with the center on the svg point

        points.push({
          cx: svgPoint.x,
          cy: svgPoint.y,
        }),
          //increase the counter
          n++;
      }
      // if you have allready n points break the loop
      if (n == circlesLength) {
        break;
      }
    }
    return points;
  }

  // a function to get a random integer from an interval
  function randomIntFromInterval(mn, mx) {
    return ~~(Math.random() * (mx - mn + 1) + mn);
  }

  async function loaded() {
    lgaName = getqueryName('lgaName');
    const lgaSpan = document.getElementById('lga-name');
    lgaSpan.innerHTML = lgaName.replace('%20', ' ');
    try {
      const responsePromise = await fetch(
        `${MMDP_BASE_URL}/api/v1/matrix/lga?name=${lgaName}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.userToken}`,
          },
        }
      );
      const response = await responsePromise.json();
      const { name, path } = response.data[0];
      if (!name) {
        window.location.href = `http://${locationUrl}/state.html`;
      }
      const counts = (await fetchCount(lgaName)) || [];

      appendMap(path, counts);
      const svg = document.getElementById('svg');
      const hideMe = document.getElementById('remove');
      $('#show-active-div').click(function() {
        $('#show-active-div').hide();
        $('#svg-container-icons').hide();
        $('#hide-active-div').toggle();

        fetchCommunities(MMDP_BASE_URL, lgaName, true);
      });

      $('#hide-active-div').click(function() {
        $('#hide-active-div').hide();
        $('#show-active-div').toggle();
        $('#svg-container-icons').show();
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
    } catch (error) {
      throw error;
    }

    async function fetchCommunities(MMDP_BASE_URL, lgaName, showBtn = true) {
      lgaName = getqueryName('lgaName');
      const lgaSpan = document.getElementById('lga-name');
      lgaSpan.innerHTML = lgaName.replace('%20', ' ');
      try {
        const responsePromise = await fetch(
          `${MMDP_BASE_URL}/api/v1/matrix/lga?name=${lgaName}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.userToken}`,
            },
          }
        );
        const response = await responsePromise.json();
        const { name, path } = response.data[0];
        if (!name) {
          window.location.href = `http://${locationUrl}/state.html`;
        }

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
        let servicesCount = await fetchCount(lgaName);
        if (servicesCount) {
          var myStringArray = servicesCount['uniqueNames'];
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
                fill: 'rgba(255,0,0,0.5)',
                class: 'red-marker',
                cx: points[i].cx,
                cy: points[i].cy,
                r: 0.006,
              },
              svg
            );
            drawCircle(
              {
                communityName: myStringArray[i],
                fill: 'red',
                class: 'red-marker',
                cx: points[i].cx,
                cy: points[i].cy,
                r: 0.004,
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
            $(`<div class="info_panel">
                <div class="community">
                  <b>Community Name:</b> ${community}
                </div><br>
                <div class="counts">
                  <b>Stakeholders:</b> ${stakeholders}<br>
                  <b>Focus Area:</b> ${focusarea}<br>
                  <b>Services:</b> ${services}<br>
                </div>
              </div>`).appendTo('body');
            $('.info_panel').css({
              border: 'solid 1px #ccc',
              display: 'block',
              width: $(window).width() > 600 ? 'auto' : '200px!important',
              fontSize: '14px',
              fontWeight: 'normal',
            });
          })
          .mouseleave(function() {
            $('.info_panel').remove();
          })
          .mousemove(function(e) {
            var mouseX = e.pageX,
              mouseY = e.pageY;

            $('.info_panel').css({
              top: mouseY - 50,
              left:
                $(window).width() > 600
                  ? mouseX - $('.info_panel').width() / 2
                  : 10,
            });
          });
      } catch (error) {
        throw error;
      }
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, true);
})();
