(() => {
  let url_string = window.location.href
  let url = new URL(url_string);
  let id = url.searchParams.get("id");
  const new_url = `${baseUrl}/events/${id}`;
  let singleEvent = ''

  fetch(new_url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(response => {

      if (response && response.data) {

        const { data: { details, title, eventDate, headerImage } } = response
        singleEvent += `
      <div class="row up-event pt-44">
      <span class="past-event-title">
       ${title}
      </span>
      <br />
      <span class="events-date sm"> ${new Date(eventDate).toDateString()} </span>
    </div>
    <div class="row event-image-1">
      <img src="${headerImage.url}" width="100%" height="572px"/>
    </div>
    <div class="row up-event">
      <div class="event up-events-card__desc-body justified">
        ${details}
      </div>
    </div>
    </div>
    <div class="row event event-pagination">
      <a class="col s6 eventPre" id="eventPre" onClick="plusIndex(-1)" >
        <img src="./assets/images/events/group-copy-3.png" alt="prev">
        <span class="events-info">Previous</span>
      </a>
      <a class="col s6 right-align" id="eventNext" onClick="plusIndex(1)">
        <span class="events-info">Next</span>
        <img src="./assets/images/events/group-copy-2.png" alt="prev">
      </a>
    </div>
      `
        $('#single-event-page').html(singleEvent)
      }
    }).catch((error) => console.log(error));

})();