const urls = (function () {

  if (
    window.location.host.includes('127.0.0.1') ||
    window.location.host.includes('localhost')
  ) {
    return ['http://localhost:3000', 'http://localhost:3000/api/v1', window.location.host]
  } else {
    return ['http://cms-staging.mmdp.ng:3000', 'http://cms-staging.mmdp.ng:3000/api/v1', window.location.host]
  } 
})(); 

const [MMDP_BASE_URL, baseUrl, locationUrl] = urls;