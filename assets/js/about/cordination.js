 /*global app, $on, baseUrl */
 (function () {
	'use strict';

	function About(name) {
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.view);
    }
    
    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function equalHeight(resize, element="equalHeight") {
		var elements = document.getElementsByClassName(element),
			allHeights = [],
			i = 0;
		if(resize === true){
		  for(i = 0; i < elements.length; i++){
			elements[i].style.height = 'auto';
		  }
		}
		for(i = 0; i < elements.length; i++){
		  var elementHeight = elements[i].clientHeight;
		  allHeights.push(elementHeight);
		}
		for(i = 0; i < elements.length; i++){
		  elements[i].style.height = Math.max.apply( Math, allHeights) + 'px';
		  // Optional: Add show class to prevent FOUC
		  if(resize === false && !hasClass(elements[i], 'show')){
			elements[i].className = elements[i].className + " show";
		  }
		}
	  }
	  

	  window.onresize = function(){
		equalHeight(true);
      }
      
      window.onscroll = function() {
        equalHeight(false);
        equalHeight(false, 'equalHeight1');
      }
	  
      var about = new About('about-page');
      var url = `${baseUrl}/about/coordination/list`;
      var page = 'showAboutCordination';
      window.cmsLoad = about.controller.show(url, page);
})();

  
  