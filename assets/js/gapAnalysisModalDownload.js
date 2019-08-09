$(document).ready(async function () {

  $('.gap_analysis_download').click(function () {
    $('.gap-analysis-popup-menu').toggle();
  })

  /**
   * @description - Get the download format
   */
  $('#save-gap-as-pdf, #save-gap-as-png, #save-gap-as-jpg').click(function () {
    const stateName = getTrimmedStateNameFromUrl('btn');

    switch (this.id) {
      case 'save-gap-as-png':
        convertToFormat(`${stateName}-gap-analysis.png`, 'png');
        break;
      case 'save-gap-as-jpg':
        convertToFormat(`${stateName}-gap-analysis.jpg`, 'jpg');
        break;
      case 'save-gap-as-pdf':
        convertToFormat(`${stateName}-gap-analysis.pdf`, 'pdf');
        break;
      default:
        break;
    }
  })

  /**
   * @description - Retrieve all the card nodes from the parent DOM node
   * @param {array} parentNode  // DOM node with all the card nodes
   */
  function getNodeArray(parentNode) {
    const finalChildArray = [];
    parentNode.childNodes.forEach(function (node) {
      if (node.className !== undefined) finalChildArray.push(node);
    });
    return finalChildArray;
  };

  /**
   * @description - Toggle the css class to make the modal body visible
   */
  function toggleCSSProperties() {
    $('.modal-body')[0].classList.toggle('canvas-needed-properties');
  };

  /**
   * @description - Convert the modal to pdf
   * @param {string} stateNameText 
   * @param {string} nodeArray // Array of all the card DOM nodes
   * @param {string} filename
   */
  async function convertToPdf(stateNameText, nodeArray, filename) {
    const pdf = new jsPDF("l", "px", "a4");
      pdf.setFontSize(30);
      pdf.text(
        `Gap Analysis Report For ${stateNameText} State`,
        300,
        200,
        null,
        null,
        'center'
      );
      for (let i=0; i<nodeArray.length; i++) {
        try {
          const gapAnalysisCanvas = await html2canvas($(nodeArray[i]));
          const gapAnalysisModalUrl = await gapAnalysisCanvas.toDataURL('image/png');
          await pdf.addPage();
          await pdf.addImage(gapAnalysisModalUrl, "PNG", 140, 130, 350, 200);
        } catch (e) {
          throw e;
        }
      }
      await pdf.save(filename)
  }

  /**
   * @description - Convert to the selected format
   * @param {string} filename 
   * @param {string} type
   */
  async function convertToFormat(filename, type) {
    const stateNameText = getTrimmedStateNameFromUrl(type);
    const gapAnalysisModalNode = $('.modal-body')[0]; // Capture the DOM node that has the modal
    const gapAnalysisModalChildNode = $('.modal-grid-container');
    const nodeArray = getNodeArray(gapAnalysisModalChildNode[0])

    toggleCSSProperties();

    let useWidth = $('.modal-body').prop('scrollWidth');
    let useHeight = $('.modal-body').prop('scrollHeight');

    html2canvas(gapAnalysisModalNode, {
      height: useHeight + 150,
      width: useWidth,
      onrendered: function (gapAnalysisCanvas) {
        const gapAnalysisModalUrl = gapAnalysisCanvas.toDataURL('image/png');

        if (type === 'png') {
          download(`Gap-Analysis-Report-${stateNameText}-State`, gapAnalysisModalUrl);
        }

        if (type === 'jpg') {
          download(`Gap-Analysis-Report-${stateNameText}-State.jpg`, gapAnalysisModalUrl);
        }
        toggleCSSProperties();
      }
    });

    if (type === 'pdf') {
      convertToPdf(stateNameText, nodeArray, filename);
    }
  }
})
