const mediaUrl = 'resources/repository/media';
let currentMediaData, player, videoElem, video, playButton, skipButtons,
  rangeSliders, progress, progressBar;

function render(data) {
  renderMedia(data.media);
  renderPagination(data.pagination);
}

function getElements() {
  player = $('#modal-video');
  videoElem = $('.media-player__video');
  video = videoElem.get(0);
  progress = $('.media-player-progress');
  progressBar = $('.media-player-progress__filled');
  playButton = $('.media-player__button.toggle');
  skipButtons = $('[data-skip]');
  rangeSliders = $('.media-player__slider');
}
function togglePlay() {
  if (video.paused) return video.play();
  video.pause();
}

function togglePlayButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  playButton.text(icon);
}

function handleSkip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeSliderUpdate() {
  // set video property, volume or playbackRate
  video[this.name] = this.value;
}

function handleProgress() {
  const duration = video.duration || 0;
  const percent = (video.currentTime / duration) * 100 || 0;
  progressBar.get(0).style.flexBasis = `${percent}%`;
}

function scrub(event) {
  const duration = video.duration || 0;
  // the ratio of x-axis position of the timeline clicked to the 
  // total width of the video timeline progress bar * the video duration will give the new time in secs
  const scrubTime = (event.offsetX / progress.get(0).offsetWidth) * duration;
  video.currentTime = scrubTime;
}

function videoPlayback(event) {
  const videoLink = $(event).find('source').attr('src');
  video.pause();
  videoElem.attr('src', videoLink);
  video.load();
  $('#photos-videos__modal').modal('open');
}
function filterMediaData(data, mediaType) {
  return data.filter(function(media) {
    return media.mediaType === mediaType;
  });
}
function handleVideosCheckbox() {
  if (this.checked) {
    // if both "videos" and "photos" are checked, show all
    if ($('#photos-checkbox').is(':checked')) return renderMedia(currentMediaData.media);
    // if just "videos" is checked
    const filteredData = filterMediaData(currentMediaData.media, 'video')
    renderMedia(filteredData);
  } else {
    // if both "videos" and "photos" are not checked, show all
    if (!$('#photos-checkbox').is(':checked')) return renderMedia(currentMediaData.media)
    // if "photo" is checked, show photos
    const filteredData = filterMediaData(currentMediaData.media, 'photo');
    renderMedia(filteredData);
  }
}
function handlePhotosCheckbox() {
  if (this.checked) {
    // if both "photos" and "videos" are checked, show all
    if ($('#videos-checkbox').is(':checked')) return renderMedia(currentMediaData.media);
    // if just "photos" is checked
    const filteredData = filterMediaData(currentMediaData.media, 'photo');
    renderMedia(filteredData);
  } else {
    // if both "photos" and "videos" are not checked, show all
    if (!$('#videos-checkbox').is(':checked')) return renderMedia(currentMediaData.media)
    // if "videos" is checked show videos
    const filteredData = filterMediaData(currentMediaData.media, 'video');
    renderMedia(filteredData);
  }
}

function registerEvents() {
  $('.modal').modal();
  $('#close-media-player').click(function() {
    video.pause();
  });
  $('#photos-checkbox').change(handlePhotosCheckbox);
  $('#videos-checkbox').change(handleVideosCheckbox);
  videoElem.click(togglePlay);
  videoElem.on('timeupdate', handleProgress);
  videoElem.on('play pause', togglePlayButton);
  playButton.click(togglePlay);
  skipButtons.each(function(index, button){
    $(button).click(handleSkip)
  });
  rangeSliders.each(function(index, rangeSlider) {
    $(rangeSlider).on('change mousemove', handleRangeSliderUpdate)
  });
  let mouseDownOnTimeline = false
  progress
    .click(scrub)
    .mousedown(function () {mouseDownOnTimeline = true})
    .mouseup(function () {mouseDownOnTimeline = false})
    .mousemove(function(e){mouseDownOnTimeline && scrub(e)})

}
function renderMedia(mediaData) {
  let mediaHtml = '';
  if (!mediaData.length) {
    const noResultHtml = `<div class="card-panel red lighten-5 pagination__no-results">
    There are no results to display.
  </div>`;
    $('div#media-container').html(noResultHtml);
    return;
  }
  chunk(mediaData, 3).forEach(function(mediaRow) {
    let mediaRowHtml = '';
    mediaRow.forEach(function(media){
      if (media.mediaType === 'video') {
        mediaRowHtml += `<div class="col s12 m4 photos-videos__media-area video-trigger"
        data-media-type="video" onclick="videoPlayback(this)">
        <div class="play-button"><img src="/assets/images/common/play.svg" /></div>
        <video class="photos-videos__media">
          <source src="${media.mediaFile.url}" type="${media.mediaFile.mimetype}">
            Sorry, your browser does not support HTML5 video.
        </video>
      </div>`
      } else {
        mediaRowHtml += `<div class="col s12 m4 photos-videos__media-area">
        <img alt="image" class="photos-videos__media" src="${media.mediaFile.url}" />
      </div>`
      }
    });
    mediaHtml += `
    <div class="row media-row">${mediaRowHtml}</div>
    `
  });
  $('div#media-container').html(mediaHtml);
}

function renderPagination(pagination) {
  const paginationHtml = pagination.total && pagination.totalPages > 1 ?
  `<div class="research-content__pagination">
      <div class="pagination__page">Page</div>
      <div class="current-page square-shape">${pagination.currentPage}</div>
      <div class="pagination__total-items">
        of <span class="available_pages">${pagination.totalPages}</span>
      </div>
      <a href="#photos-videos" onclick="fetchMedia(${pagination.previous})">
        <div class="previous-button square-shape ${pagination.previous ? '' : 'very-pale'}">
        <i class="material-icons">navigate_before</i>
        </div>
      </a>
      <a href="#photos-videos" onclick="fetchMedia(${pagination.next})">
        <div class="next-button square-shape ${pagination.next ? '' : 'very-pale'}">
        <i class="material-icons">navigate_next</i>
        </div>
      </a>
  </div>`: '';
  $('#media-pagination').html(paginationHtml);
}

function fetchMedia(page = 1) {
  client(`${mediaUrl}?page=${page}`)
    .then(res => res.json())
    .then((data)=>{
      currentMediaData = Object.assign({}, data.data);
      render(data.data);
      scrollToTop();
    })
    .catch(err => console.log(err))
}

function cmsLoad() {
  getElements();
  registerEvents();
  fetchMedia();
}
