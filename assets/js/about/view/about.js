(function (window) {
	'use strict';

	/**
     * View that abstracts away the browser's DOM completely.
     * It has one simple entry points:
     *
     * - render(page, parameterObject)
     *     Renders the given page with the options
     */
	function View(template) {
		this.template = template;

        this.$main = qs('.main__content-render');
		this.$message = qs('.about__message');
		this.$background = qs('.about__background');
		this.$loader = qs('.lds-roller');
		this.$introToHighlights = qs('.coordination-p');
		this.$image1 = qs('.image1');
		this.$image2 = qs('.image2');
	}

	View.prototype.render = function (page, parameter) {
		var self = this;
		self.$loader.remove();
		if  (parameter.length === 0 ) {
			self.$main.innerHTML = self.template.noContent();
			self.$message.innerHTML = self.template.noContent();
			return false;
		}
		switch (page) {
			case 'showGovernorMessage':
				self.$main.innerHTML = self.template.showGovernorMessage(parameter);
				self.$message.innerHTML = parameter[0].governorMessage;
				break;
			case 'showAboutMMDP':
				self.$message.innerHTML = parameter[0].about;				
				self.$background.innerHTML = parameter[0].background;
				if (parameter[0].image1) {
					self.$image1.src = parameter[0].image1.url
					self.$image2.src = parameter[0].image2.url
				}				
				break;
			case 'showAboutCordination':
				self.$message.innerHTML = parameter[0].coordination;
				self.$background.innerHTML = parameter[0].whatAreWeDoing;
				self.$introToHighlights.innerHTML = parameter[0].introToHighlights;
				self.$main.innerHTML = self.template.showCoordCard(parameter[0].highlight);
				break;
			case 'showAboutObjectives':
				self.$main.innerHTML = parameter[0].Objectives;
				break;
			case 'showAboutStateApproach':
			    qs('.about__message').innerHTML = parameter[0].theEdoStateApproach;
				break;
		
			default:
				break;
		}
	};
	
	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));
