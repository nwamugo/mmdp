function loaded() {
  $("#map").load(
    `https://s3.amazonaws.com/mmdp-img-assets/assets/documents/tv7BEAdCYkHMAbI5`,
    function(responseTxt, statusTxt, xhr) {
      if (statusTxt == "success") {
        const [, xmlPart, svgPart] = responseTxt.match(
          /([\s\S.]*)(<svg[\s\S]*<\/svg>)/
        );
        $('#map').html(svgPart);
        document.querySelectorAll("path").forEach(stateMap => {
          stateMap.setAttribute("fill", "#fcffff");
        });
        $.get("http://mmdp-cms-app.4rpphcs76y.us-west-2.elasticbeanstalk.com:3000/api/v1/ActiveStates/", function(data) {
          var states = data.states;
          for (var i = 0; i < states.length; i++) {
            document
              .querySelector(`[fme\\:StateName=${states[i]}]`)
              .setAttribute("fill", "#296d81");
          }
        });
      }

      $("path")
        .mouseover(function(e) {
          var state = $(this).attr("fme:statename");
          var capital = $(this).attr("fme:statecapital");
          if (state === undefined) {
            $(
              '<div class="info_panel">' +
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
            '<div class="info_panel">' +
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
          $(".info_panel").remove();
        })
        .mousemove(function(e) {
          var mouseX = e.pageX,
            mouseY = e.pageY;

          $(".info_panel").css({
            top: mouseY - 50,
            left: mouseX - $(".info_panel").width() / 2
          });
        })
        .click(function() {
          var stateName = $(this).attr("fme:statename");
          baseURL = window.location.host;
          window.location.href = `http://${baseURL}/state.html?state=${stateName}`;
        });

      if (statusTxt == "error") return xhr;
    }
  );
}
document.addEventListener("DOMContentLoaded", loaded, false);

$("#tap").load("../assets/svg/tap.svg", function(statusText) {
  if (statusText == "success") {
    document.querySelectorAll("path").forEach(pointer => {
      pointer.setAttribute("fill", "green");
    });
  }
});

$('#stakeholder-directory').load(
  '/state.html',
  function() {
  }
);
