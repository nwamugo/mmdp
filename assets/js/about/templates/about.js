/*jshint laxbreak:true */
(function (window) {
	'use strict';

	/**
	 * Sets up defaults for governor message Template methods
	 *
	 * @constructor
	 */
	function Template() {
        this.defaultTemplate
        = `<div class="governors-image animated fadeIn">
        <img src={{url}} />
        <h6 class="governors-name animated fadeIn delay-1s">{{governorName}}</h6>
        <p>Executive Governor, Edo State</p>
        <hr class="hr-divider">
		</div> `;

		this.noContentTemplate
        = `<div class="governors-image center-align valign-wrapper animated fadeIn faster">
        <h5 class="governors-name center-align muted animated fadeIn delay-1s">
		No content to display at the moment
		</h5>
		</div> `;

		this.coordSection = `
		<div class="col s12 m12 l6 xl6  ">
		  <div class="coord-section equalHeight{{equalCard}}">
            <h1 class="coord-num">{{id}}</h1>
                <p class="main__content-section-wrapper">
                    {{name}}
                </p>
            </div>
		</div>
		`;
	}

	/**
	 * Creates an element HTML string and returns it for placement in your app.
	 *
	 * NOTE: In real life you should be using a templating engine such as Mustache
	 * or Handlebars, however, this is a vanilla JS example.
	 *
	 * @param {object} data The object containing keys you want to find in the
	 *                      template to replace.
	 *
	 * @example
	 * view.show({
	 *	governorName: 1,
	 *	governorMessage: "Hello World",
	 *	governorPhoto: {
         bucket: "mmdp-img-assets"
         etag: ""e1c26ac9f98fa7f4d553d7ecba217a66""
         filename: "2H9AOS513UDYRHNl"
         mimetype: "image/png"
         path: "/assets/images"
         size: 436425
         url: "https://s3.amazonaws.com/mmdp-img-assets/assets/images/2H9AOS513UDYRHNl"},
	 * });
	 */
	Template.prototype.showGovernorMessage = function (data) {
		var view = '', i, l;
		var template = this.defaultTemplate;
		if  (data.length > 0 ) {

			for (i = 0, l = data.length; i < l; i++) {
				

				template = template.replace('{{governorName}}', data[i].governorName);
				template = template.replace('{{governorMessage}}', escape(data[i].governorMessage));
				if (data[i].governorPhoto) {
					template = template.replace('{{url}}', data[i].governorPhoto.url);
				}			

				view = view + template;
			}
			return view
	    } 

		return this.noContentTemplate;
	};
	
	Template.prototype.showCoordCard = function (data) {
		var view = '', i, l;
		if  (data.length > 0 ) {
			for (i = 0, l = data.length; i < l; i++) {
				var template = this.coordSection;

				template = template.replace('{{name}}', data[i].name);
				template = template.replace('{{id}}', '0' + (parseInt(i) +1) );
				
				template = i < 2 ? template.replace('{{equalCard}}', '1') : template.replace('{{equalCard}}', '');
				
				view = view + template;
			}

			return view;
		} 

		return this.noContentTemplate;
	};

	Template.prototype.noContent = function () {
		return this.noContentTemplate;
	};

	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);
