function plusIndex(n) {
    const url_string = window.location.href
    const url = new URL(url_string);
    const id = url.searchParams.get("id");

    let index = window.ListEvents.findIndex(x => x._id === id);
    if (index !== -1) {
        IndexPagination(index += n);
    }
}

function IndexPagination(n) {
    let id
    if (n >= window.ListEvents.length) {
        id = window.ListEvents[0]._id
    } else if (n === -1) {
        id = window.ListEvents[window.ListEvents.length - 1]._id
    } else {
        id = window.ListEvents[n]._id
    }
    const new_url = `event-info.html?id=${id}`;
    window.location.replace(new_url);
}