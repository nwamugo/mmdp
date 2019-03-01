 /*global app, $on, baseUrl */
(function () {
	'use strict';

	function About() {
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.view);
	}

	var about = new About('about-page');
	var url = `${baseUrl}/about/governor-message/list`;
	var page = 'showGovernorMessage';
	window.cmsLoad = about.controller.show(url, page);
})();

  
  