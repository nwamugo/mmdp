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
  let stateName;
  const baseURL = window.location.host;

  function getNumberOfServices(lgaServices, lgaName) {
    for(const lgaService of lgaServices){
      if (lgaService.lgaName === lgaName){
        return lgaService.serviceCount
      }
    }
  }
  function handleMapClick(lgaName) {
    window.location.href = `http://${baseURL}/lga.html?lga=${lgaName}`;
  }
  async function loaded() {
    const stateNameFromUrl = window.location.search.substring(1).split('=')[1];
    if(!stateNameFromUrl){
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
    }
    stateName =
      stateNameFromUrl.charAt(0).toUpperCase() + stateNameFromUrl.slice(1);
    const stateSpan = document.getElementById('state-name');
    stateSpan.innerHTML = stateName.replace('%20', ' ');
    try {
      const responsePromise = await fetch(`${MMDP_BASE_URL}/api/v1/state-map/${stateName}`)
    const response = await responsePromise.json()
    const {stateUrl, lgaServices} = response.data
    if(!stateUrl){
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
    }
    $('#svg-container').load(stateUrl,
      function(responseTxt, statusTxt, xhr) {
        if (statusTxt == 'success') {
          const [, xmlPart, svgPart] = responseTxt.match(
            /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
          );
          $('#svg-container').html(svgPart);
          $('g#Nigeria_LGA_Boundary')
            .parents('svg')
            .addClass('banner__image animated fadeInLeft slow state-map__svg');
          const lgsIds = responseTxt.match(/STL\d{6}/gm);
          let lgaName = ""
          let lgasArray = []
          let statesArray = []
          lgsIds.map(lgsId => {
            const svgPath = document.querySelector(`[fme\\:ID=${lgsId}]`);
            lgaName = svgPath.getAttribute('fme:lga_name');
            const numberOfServices = getNumberOfServices(lgaServices, lgaName)
            if (numberOfServices >= 35) {
              svgPath.setAttribute('fill', '#296d81');
            } else if (numberOfServices < 35 && numberOfServices >= 25) {
              svgPath.setAttribute('fill', '#83c4d8');
            } else if (numberOfServices < 25 && numberOfServices >= 5) {
              svgPath.setAttribute('fill', '#bad9e3');
            } else if (numberOfServices < 5) {
              svgPath.setAttribute('fill', '#eaf9fe');
            }else{
              svgPath.setAttribute('fill', '#eaf9fe');
            }
            svgPath.innerHTML = `<title>${lgaName}</title>`;
            svgPath.addEventListener('click', () => handleMapClick(lgaName), false);
            lgasArray.push(lgaName)
            window.variable = lgasArray
          });
        }
      }
    );
    } catch (error) {
      window.location.href = `http://${baseURL}/index-cordination-matrix.html`;
    }
    
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
