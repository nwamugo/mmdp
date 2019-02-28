const baseUrl = 'http://54.202.70.86:3000/api/v1';
/**
 * Client wrapper to make CMS calls.
 *
 * @param url
 * @returns {Promise<Response>}
 */
function client(url) {
  return fetch(`${baseUrl}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
}
/**
 * Format date to natch mock up format.
 *
 * @param date
 * @returns {string}
 */
function formatDate(date) {
  return date.toDateString()
}

/**
 *  Extract url parameters from an object
 *  params {Object} params
 */
function formatObjectToParams(params) {
  let url = '';
  if (typeof params === 'object') {
    if (Object.keys(params).length >= 1) {
      Object.keys(params).forEach((key) => {
        url += `${key}=${params[key]}&`;
      });
      // remove last &
      url = url.slice(0, -1);
    }
  }
  return url;
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function chunk (arr, chunkSize) {
  var chunkArr = []
  var arrCopy = arr.slice(0);
  while (arrCopy.length) chunkArr.push(arrCopy.splice(0, chunkSize));
  return chunkArr;
}
