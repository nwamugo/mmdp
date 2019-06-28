(function (window) {
	'use strict';

	/**
	 * Takes a model and view and acts as the controller between them
	 *
	 * @constructor
	 * @param {object} model The model instance
	 * @param {object} view The view instance
	 */
    function Controller(view) {
        var self = this;
        self.view = view;
        self.url = '#'
    };


    /**
	 * An event to fire on load. Will make a request to the server  and render its content
	 */
    Controller.prototype.show = function (url, page) {
        var self = this;
        let config = {}
        
        axios.get(url, config)
        .then(function (response) {
            // handle success
            self.view.render(page, response.data.items);            
        })
        .catch(function (error) {
            // handle error
            throw error;
        });
    }    
	
    // Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);