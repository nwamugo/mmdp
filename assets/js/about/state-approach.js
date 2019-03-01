 /*global app, $on, baseUrl */
 (function () {
	'use strict';

	function About(name) {
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.view);
	}

	var about = new About('about-page');
    var url = `${baseUrl}/about/edo-state-approach/list`;
    var page = 'showAboutStateApproach';
    
    window.cmsLoad = about.controller.show(url, page);
})();

  
  