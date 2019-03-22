(function getAllEvents() {

  let pastList = [];
  let mainEventList = [];
  let commingList = [];
  let mainList = [];

  fetch(`${baseUrl}/events?perPage=12`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(response => {

      if (response && response.data) {
        window.ListEvents = response.data;
        mainList = response.data;
        createEventLists(mainList, mainEventList, commingList, pastList);
      }
      $('#main-event').html(RenderAllEvents(mainEventList, 1, true, mainEventsHtml));
      $('#past-events').html(RenderAllEvents(pastList, 6, false, pastEventsHtml));
      $('#up-events').html(RenderAllEvents(commingList, 3, true, ComingEventsHtml));
    })
    .catch((error) => console.log(error));

  // Web Sockets
  const socket = io(SocketUrl);
  socket.on('connect', function () {
    const current_date = new Date
    const ISO_Date = current_date.toISOString()

    // When a new Event is Added
    socket.on('addEvent', (data) => {
      mainList.push(data);
      const newList = createEventLists(mainList, mainEventList, commingList, pastList);

      $('#main-event').html(RenderAllEvents(newList[0], 1, true, mainEventsHtml));
      $('#past-events').html(RenderAllEvents(newList[1], 6, false, pastEventsHtml));
      $('#up-events').html(RenderAllEvents(newList[2], 3, true, ComingEventsHtml));

    });

    // When an Event is Updated
    socket.on('updateEvent', (data) => {
      let index = mainList.findIndex(x => x._id === data._id);
      mainList[index] = data;
      const newList = createEventLists(mainList, mainEventList, commingList, pastList);

      $('#main-event').html(RenderAllEvents(newList[0], 1, true, mainEventsHtml));
      $('#past-events').html(RenderAllEvents(newList[1], 6, false, pastEventsHtml));
      $('#up-events').html(RenderAllEvents(newList[2], 3, true, ComingEventsHtml));

    });

    // When an Event id Delete
    socket.on('deleteEvent', (data) => {
      let index = mainList.findIndex(x => x._id === data);
      mainList.splice(index, 1)
      const newList = createEventLists(mainList, mainEventList, commingList, pastList);

      $('#main-event').html(RenderAllEvents(newList[0], 1, true, mainEventsHtml));
      $('#past-events').html(RenderAllEvents(newList[1], 6, false, pastEventsHtml));
      $('#up-events').html(RenderAllEvents(newList[2], 3, true, ComingEventsHtml));
    });
  });
}
)();

const createEventLists = (arr, mainEventList, commingList, pastList) => {

  if (mainEventList.length > 0 || commingList.length > 0 || pastList.length > 0) {
    mainEventList = []; commingList = []; pastList = [];
  }
  const current_date = new Date
  const ISO_Date = current_date.toISOString()
  arr.forEach((item) => {
    if (item.mainEvent === true) {
      mainEventList.push(item)
    }

    if (item.eventDate < ISO_Date) { pastList.push(item) }
    else { commingList.push(item) }
  });

  return [mainEventList, pastList, commingList];
};


// Function to Render All Events

const RenderAllEvents = (arr, chunk_size, sort, html) => {
  if (sort === true) {
    arr.sort((a, b) => (a.eventDate > b.eventDate) ? 1 : ((b.eventDate > a.eventDate) ? -1 : 0));
  } else {
    arr.sort((a, b) => (a.eventDate < b.eventDate) ? 1 : ((b.eventDate < a.eventDate) ? -1 : 0));
  }
  let HtmlData = '';
  arr.slice(0, chunk_size).map((item) => {
    HtmlData += html(item)

  });
  return HtmlData
}

const ComingEventsHtml = (item) => (
  `
        <div class="row up-events">
        <hr class="events-hr" />
      </div>
      <div class="row up-events mt-48">
        <div class="col up-left">
          <div class="events-date">
            ${new Date(item.eventDate).toDateString()}
          </div>
        </div>
        <div class="col up-right">
          <span class="event-title">
            ${item.title}
          </span>
          <br />
          <div class="up-events-card__desc-body-coming">
            ${item.details}
          </div>
          <br />
          <br />
          <a href="event-info.html?id=${item._id}" class="events-info">More Information</a>
        </div>
      </div>
              `
);

const pastEventsHtml = (item) => (
  `
  <div class="past-events-card" data-id="${item._id}">
  <div class="past-events-card__header">
  <img src="${item.headerImage.url}"/>
  </div>
  <div class="past-events-card__body">
    <span class="past-event-title">
      ${item.title}
    </span>
    <br />
    <span class="events-date">
      ${new Date(item.eventDate).toDateString()}
    </span>
    <br />
    <br />
    <div class="up-events-card__desc-body-past now">
    ${item.details}
    </div>
<br />
<a href='event-info.html?id=${item._id}' class="events-info past-event-link">Continue reading</a>
  </div >
</div >
`
);

const mainEventsHtml = (item) => (
  `
  <div class="row up-event up-events-card">
    <div class="col up-events-card__desc">
      <div class="up-events-card__desc-text">
        <span class="event-title">
          ${item.title}
      </span>
        <br />
        <span class="events-date sm">${new Date(item.eventDate).toDateString()}</span>
        <br />
        <span class="up-events-card__desc-body-past">
         ${item.details}
      </span>
        <br />
        <a href="event-info.html?id=${item._id}"><button class="up-events-card__button">
          More Information
        </button></a>
      </div>
    </div>
    <div class="col up-events-card__img">
    <img src="${item.headerImage.url}" />
    </div>
  </div>
  `
);

