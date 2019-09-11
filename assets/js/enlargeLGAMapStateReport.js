const CELL_SIZE = 36;
let isPathClicked = false;

function removeCreatedElements(element) {
  return element
    ? $(element).remove()
    : $('#enlarged-lga-map-wrapper, #map-grid').remove();
}

function appendEnlargedLGAMapWrapper() {
  removeCreatedElements('#enlarged-lga-map-wrapper');

  $('body').append(`
    <div id="enlarged-lga-map-wrapper">
      <button id="enlarged-lga-map-close-btn" type="button" class="btn">
        <i class="fas fa-times" style="color: #fff;"></i>
      </button>
    </div>`);

  $('#enlarged-lga-map-wrapper').css({
    position: 'absolute',
    height: $('.state__map .banner__desc').height() + 72,
    width: $('.state__map .banner__desc').width() + 72,
    background: '#f8f8f8',
    top: $('#header-section').height()
  });

  $('#enlarged-lga-map-close-btn').css({
    position: 'absolute',
    backgroundColor: '#3faaca',
    top: 15,
    right: 0,
    display: isPathClicked ? 'initial' : 'none'
  });

  d3.select('#enlarged-lga-map-wrapper')
    .append('svg')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('id', 'enlarged-lga-map-main-svg')
    .attr('transform', 'scale(1.0)')
    .style('-ms-transform', 'scaleY(-1)')
    .style('-webkit-transform', 'scaleY(-1)')
    .style('transform', 'scaleY(-1)')
    .attr('height', $('.state__map .banner__desc').height())
    .attr('width', $('.state__map .banner__desc').width());
}

function appendEnlargedLGAMapPath(path) {
  const svg = d3.select('#enlarged-lga-map-main-svg');

  svg
    .append('svg')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('id', 'enlarged-lga-map')
    .attr('fill', 'none')
    .append('path')
    .attr('id', 'enlarged-lga-map-path')
    .attr('d', $(path).attr('d'))
    .attr('fill', $(path).attr('fill'))
    .attr('stroke', 'black')
    .attr('stroke-width', '0.1%');

  const bboxRect = $('#enlarged-lga-map-path')[0].getBBox();

  $('#enlarged-lga-map').attr(
    'viewBox',
    `${bboxRect.x} ${bboxRect.y} ${bboxRect.width} ${bboxRect.height}`
  );

  const lgaName = getLgaName($(path)[0]);

  $('#enlarged-lga-map-wrapper')
    .prepend(`<h5>${lgaName}</h5>`)
    .css({ textAlign: 'center' });

  return {
    svg,
    bboxRect,
    clientRect: $('#enlarged-lga-map-path')[0].getBoundingClientRect()
  };
}

function appendEnlargedHandsImage(svg) {
  const [handsIconX, handsIconY] = [-10, 6];
  const [handsIconWidth, handsIconHeight] = [36, 36];
  svg
    .append('image')
    .attr('x', handsIconX)
    .attr('y', handsIconY)
    .attr('width', handsIconWidth)
    .attr('height', handsIconHeight)
    .attr(
      'xlink:href',
      'https://mmdp-img-assets.s3.amazonaws.com/assets/icons/hand-icon%402x.svg'
    );
}

function appendEnlargedCircle(svg) {
  const [circleIconX, circleIconY] = [7, 6];
  const circleIconRadius = 10;
  svg
    .append('circle')
    .attr('r', circleIconRadius)
    .attr('cx', circleIconX)
    .attr('cy', circleIconY)
    .attr('fill', '#000')
    .style('cursor', 'pointer');
}

function appendEnlargedNumberOfPartnerships(svg, number) {
  // if the number is composed with one digit, return 0 otherwise return the number
  // of digits and subtract it from the current x axis in order to center the text
  const textX = 4 - (`${number}`.length === 1 ? 0 : `${number}`.length * 2);
  const textY = 10;

  svg
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 10.5)
    .attr('font-weight', 'bold')
    .attr('x', textX)
    .attr('y', textY)
    .style('cursor', 'pointer')
    .html(number);
}

function appendEnlargedPillars(svg, pillars) {
  const [pillarIconX, pillarIconY] = [26, 25];
  const [pillarIconWidth, pillarIconHeight] = [20, 10];

  (pillars || []).sort(function(pillarA, pillarB) {
    const nameA = pillarA.name.toUpperCase();
    const nameB = pillarB.name.toUpperCase();
    return (nameA < nameB && -1) || (nameA > nameB && 1) || 0;
  });

  return pillars
    ? pillars.forEach((pillar, index) => {
        svg
          .append('rect')
          .attr('width', pillarIconWidth)
          .attr('height', pillarIconHeight)
          .attr('x', pillarIconX)
          .attr('y', pillarIconY - pillarIconHeight * index)
          .attr('fill', getPillarColor(pillar.name));
      })
    : false;
}

function showEnlargedLgaMapPopup(e, lgaName, numberOfPartnerships) {
  removeCreatedElements('#enlarged-lga-map-popup');

  $('#enlarged-lga-map-wrapper').append(
    '<div id="enlarged-lga-map-popup"></div>'
  );

  $('#enlarged-lga-map-popup').css({
    position: 'fixed',
    zIndex: 12345,
    display: 'block',
    border: 'solid 1px #ccc',
    borderRadius: '5px',
    padding: '5px',
    textAlign: 'left',
    backgroundColor: '#fff',
    left: `${e.clientX - e.offsetX}px`,
    top: `${e.clientY - 56}px`
  });
  $('#enlarged-lga-map-popup').html(
    `${lgaName}
    <br />
    Number of potential partnership: ${numberOfPartnerships}
    <br />
    <a href="#table" id="${lgaName}" class="partnershipLink">View potential partnership / collaboration</a>`
  );

  getFilteredTable();
  $(window).click(function(e) {
    const { nodeName } = $(e.target)[0];
    if (nodeName !== 'circle' && nodeName !== 'text') {
      $('#enlarged-lga-map-popup').remove();
    }
  });
}

function appendEnlargedLGAMapIcons(x, y, path) {
  removeCreatedElements('#enlarged-lga-map-wrapper-icons');

  const lgaName = getLgaName($(path)[0])
  const numberOfPartnerships = $(`symbol[id*="${lgaName}"] tspan`).html();
  const { thematicPillarCountPerLGA } = window.stakeholderData;
  const lgaThematicPillars = thematicPillarCountPerLGA.filter(
    thematicPillar => thematicPillar.lgaName === lgaName
  )[0];
  const { pillars } = lgaThematicPillars || {};

  // if the LGA doesn't have data to display, don't show icons
  if (!numberOfPartnerships && !pillars) return false;

  $('#enlarged-lga-map-wrapper').append(
    '<div id="enlarged-lga-map-wrapper-icons"></div>'
  );

  $('#enlarged-lga-map-wrapper #enlarged-lga-map-wrapper-icons').css({
    position: 'fixed',
    top: y,
    left: x - CELL_SIZE,
    height: 72,
    width: 72
  });

  const iconsSvg = d3
    .select('#enlarged-lga-map-wrapper #enlarged-lga-map-wrapper-icons')
    .append('svg')
    .attr('id', 'enlarged-lga-map-icons')
    .attr('width', 88)
    .attr('height', 72)
    .attr('viewBox', `${-5} ${-5} ${46} ${46}`);

  if (numberOfPartnerships) {
    appendEnlargedHandsImage(iconsSvg);
    appendEnlargedCircle(iconsSvg);
    appendEnlargedNumberOfPartnerships(iconsSvg, numberOfPartnerships);
    $(document).on(
      'click',
      `#enlarged-lga-map-icons circle, #enlarged-lga-map-icons text`,
      e => showEnlargedLgaMapPopup(e, lgaName, numberOfPartnerships)
    );
  }
  appendEnlargedPillars(iconsSvg, pillars);
}

function showEnlargedLGAMap(path) {
  try {
    removeCreatedElements();
    appendEnlargedLGAMapWrapper();
    const { clientRect } = appendEnlargedLGAMapPath(path);
    const { x, y } = createMapGrid({
      clientRect,
      cellSize: CELL_SIZE,
      maxNumberOfNeighbors: 8,
      minNumberOfNeighbors: 4,
      showGrid: false
    });

    appendEnlargedLGAMapIcons(x, y, path);
  } catch (error) {
    console.log(error);
  }
}

$(document).ready(function() {
  if ($(window).width() > 1024) {
    $(document).on(
      'mouseover',
      `#report-map-pillars path[fme\\:id]`,
      function() {
        if (isPathClicked) return;
        return showEnlargedLGAMap($(this));
      }
    );
    $(document).on(
      'mouseout',
      `#report-map-pillars path[fme\\:id]`,
      function() {
        if (isPathClicked) return;
        return removeCreatedElements();
      }
    );
    $(document).scroll(function(e) {
      isPathClicked = false;
      $('#enlarged-lga-map-wrapper').fadeOut(() => removeCreatedElements());
    });
    $(document).on('click', `#report-map-pillars path[fme\\:id]`, function() {
      isPathClicked = true;
      return showEnlargedLGAMap($(this));
    });

    $(document).on('click', `#enlarged-lga-map-close-btn`, function() {
      isPathClicked = false;
      $('#enlarged-lga-map-wrapper').fadeOut(() => removeCreatedElements());
    });
  }
});
