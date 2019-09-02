const variablesUsedByTwoFxn = {
  svgArguments: []
};

// download function of file
function download(filename, url, filename2, url2) {
  const elem = window.document.createElement("a");
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
  if (filename2) {
    setTimeout(() => {
      download((filename = filename2), (url = url2));
    }, 2000);
  }
}

// create desirable file format
function convert(fileName, type) {
  let promise = new Promise(function(resolve, reject) {
    const svgContainer = d3.select(reportMapPillarsID).select("svg");
    const svgNode = svgContainer["_groups"][0][0];
    const mapData = new XMLSerializer().serializeToString(svgNode);
    const editedMapData = mapData.replace(
      /href="https:\/\/mmdp-img-assets.s3.amazonaws.com\/assets\/icons\/hand-icon%402x.svg"/g,
      'href="https://mmdp-img-assets.s3.amazonaws.com/assets/icons/hand-icon%402x.svg?cacheblock=true"'
    );

    const legendNode = $(mapLegendsID)[0];

    const mapCanvas = document.createElement("canvas");
    const jointCanvas = document.createElement("canvas");

    const widthDimension4Map = (mapCanvas.width = 704);
    const heightDimension4Map = (mapCanvas.height = 600);
    const widthDimension4Legend = 214;
    const heightDimension4Legend = 172;

    html2canvas(legendNode).then(function(legendCanvas) {
      try {
        const legendDataUrl = legendCanvas.toDataURL("image/png");
        const stateName = getTrimmedStateNameFromUrl(type);

        if (type === "svg") {
          continueConversionAsSVG(stateName, fileName, legendDataUrl, mapData);
        } else {
          canvg(mapCanvas, editedMapData, {
            useCORS: true,
            renderCallback: function() {
              const mapDataUrl = mapCanvas.toDataURL("image/png");
  
              if (type === "pdf") {
                downloadIntoPDF(stateName, fileName, mapDataUrl, legendDataUrl);
              } else {
                continueConversionForPNGJPEG(
                  fileName,
                  type,
                  mapDataUrl,
                  legendDataUrl,
                  jointCanvas,
                  widthDimension4Map,
                  heightDimension4Map,
                  widthDimension4Legend,
                  heightDimension4Legend
                );
              }
            }
          });
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
  return promise;
}

function downloadIntoPDF(stateName, fileName, mapDataUrl, legendDataUrl) {
  /*
  * l stands for landscape
  * px stands for the units we will be using
  * a4 stands for the type of paper
  */
  const pdf = new jsPDF("l", "px", "a4");
  pdf.setFontSize(18);
  
  /*
  * The first figure is for the x-coordinate position on the paper
  * The second figure is for the y-coordinate position on the paper
  */
  pdf.text(
    `Gap Analysis and Collaboration Report - ${stateName} State`,
    20,
    20
  );

  /*
  * The first figure is for the x-coordinate position on the paper
  * The second figure is for the y-coordinate position on the paper
  * The third figure is for the width we are giving the image
  * The fourth figure is for the height we are giving the image
  */
  pdf.addImage(mapDataUrl, "PNG", 20, 30, 450, 400);
  pdf.addImage(legendDataUrl, "PNG", 500, 360, 120, 80);

  pdf.save(fileName);
}

function continueConversionAsSVG(stateName, fileName, legendDataUrl, mapData) {
  const legendElem = window.document.createElement("svg");
  legendElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  legendElem.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  legendElem.style.position = "fixed";
  legendElem.style.top = "50%";
  legendElem.style.left = "50%";
  legendElem.style.transform = "translate(-5%, -18%)";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "image");
  svg.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    legendDataUrl
  );

  document.body.appendChild(legendElem);
  legendElem.appendChild(svg);

  const legendElemGeneratedUrl =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(legendElem.outerHTML);
  const mapGeneratedUrl =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(mapData);
  document.body.removeChild(legendElem);


  variablesUsedByTwoFxn["svgArguments"] = [];
  return variablesUsedByTwoFxn["svgArguments"].push(
    fileName,
    mapGeneratedUrl,
    `${stateName.toLowerCase()}-report-legend.svg`,
    legendElemGeneratedUrl
  );
}

function continueConversionForPNGJPEG(
  fileName,
  type,
  mapDataUrl,
  legendDataUrl,
  jointCanvas,
  widthDimension4Map,
  heightDimension4Map,
  widthDimension4Legend,
  heightDimension4Legend
) {
  let imageLoaded = 0;

  function checkload() {
    imageLoaded++;
    if (imageLoaded < 2) {
      return;
    }

    const jointCanvasCtx = jointCanvas.getContext("2d");
    jointCanvas.width = widthDimension4Legend + widthDimension4Map + 120;
    jointCanvas.height = heightDimension4Legend + heightDimension4Map;

    jointCanvasCtx.drawImage(
      mapImage,
      50,
      50,
      widthDimension4Map,
      heightDimension4Map
    );
    jointCanvasCtx.drawImage(legendImage, 790, 50, 220, 180);

    let jointCanvasDataUrl;
    if (type === "jpg") {
      const imageData = jointCanvasCtx.getImageData(
        0,
        0,
        jointCanvas.width,
        jointCanvas.height
      );
      const compositeOperation = jointCanvasCtx.globalCompositeOperation;

      jointCanvasCtx.globalCompositeOperation = "destination-over";
      jointCanvasCtx.fillStyle = "#fff";
      jointCanvasCtx.fillRect(0, 0, jointCanvas.width, jointCanvas.height);

      jointCanvasDataUrl = jointCanvas.toDataURL("image/jpeg");

      jointCanvasCtx.clearRect(0, 0, jointCanvas.width, jointCanvas.height);
      jointCanvasCtx.putImageData(imageData, 0, 0);
      jointCanvasCtx.globalCompositeOperation = compositeOperation;
    } else {
      jointCanvasDataUrl = jointCanvas.toDataURL("image/png");
    }
    download(fileName, jointCanvasDataUrl);
  }

  const mapImage = new Image();
  mapImage.onload = checkload;
  mapImage.src = mapDataUrl;

  const legendImage = new Image();
  legendImage.onload = checkload;
  legendImage.src = legendDataUrl;
}
