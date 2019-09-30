const urls = (function () {
  switch(window.location.hostname) {
    //staging
    case 'staging-site.mmdp.ng':
      return ['http://cms.mmdp.ng:3001', 'http://cms.mmdp.ng:3001/api/v1', window.location.host];
    //production
    case 'mmdp.ng':
      return ['http://cms.mmdp.ng:3000', 'http://cms.mmdp.ng:3000/api/v1', window.location.host];
    //localhost
    default:
      return ['http://localhost:3000', 'http://localhost:3000/api/v1', window.location.host];
  }
})();

const [MMDP_BASE_URL, baseUrl, locationUrl] = urls;
