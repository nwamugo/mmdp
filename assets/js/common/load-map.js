function loadMap(redirectUrl) {
  redirectUnAuthUser("/coordination-matrix.html");
  $("#map").load(
    `https://s3.amazonaws.com/mmdp-img-assets/assets/documents/tv7BEAdCYkHMAbI5`,
    function(responseTxt, statusTxt, xhr) {
      if (statusTxt == "success") {
        const [, xmlPart, svgPart] = responseTxt.match(
          /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
        );
        $("#map").html(svgPart);
        document.querySelectorAll("path").forEach(stateMap => {
          stateMap.setAttribute("fill", "#fcffff");
        });

        $.get(
          `${MMDP_BASE_URL}/api/v1/stakeholders-directory?organisationName`,
          function(data) {
            const stakeholderDataJson = data;
            const getBeneficiaries = stakeholderDataJson.data.map(
              item => item.beneficiaries
            );
            const getStateName = getBeneficiaries.map(
              item => item[0].communities[0].stateId.stateName
            );

            for (var i = 0; i < getStateName.length; i++) {
              document
                .querySelector(`[fme\\:statename=${getStateName[i]}]`)
                .setAttribute("fill", "#296d81");
            }
          }
        );
      }

      $("path")
        .mouseover(function(e) {
          var state = $(this).attr("fme:statename");
          var capital = $(this).attr("fme:statecapital");
          if (state === undefined) {
            $(
              '<div class="map_box">' +
                "State Name:" +
                state +
                "<br>" +
                "State Capital:" +
                capital +
                "<br>" +
                "</div>"
            ).style.display = "none";
          }
          $(
            '<div class="map_box">' +
              "State Name:" +
              state +
              "<br>" +
              "State Capital:" +
              capital +
              "<br>" +
              "</div>"
          ).appendTo("body");
        })
        .mouseleave(function() {
          $(".map_box").remove();
        })
        .mousemove(function(e) {
          var mouseX = e.pageX,
            mouseY = e.pageY;

          $(".map_box").css({
            top: mouseY - 50,
            left: mouseX - $(".map_box").width() / 2
          });
        })
        .click(function() {
          var stateName = $(this).attr("fme:statename");
          window.location.href = `http://${locationUrl}/${redirectUrl}?state=${stateName}`;
        });

      if (statusTxt == "error") return xhr;
    }
  );
}
