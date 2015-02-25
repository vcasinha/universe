(function(){
    "use strict";
    
    var default_settings = {

    };

    var Layer = function(){
	    O.exec('stage.object', this);
	    
	    var self = this;
	    
	    this.type = 'layer';
    };

    Layer.prototype.init = function(settings){
		this.settings = O.extend({}, default_settings, settings);
    };

	Layer.prototype.setAlpha = function(alpha){
		this.renderObject.alpha = alpha;
	};
	
	Layer.prototype.setScale = function(x, y){
		this.renderObject.scale.set(x, y);
	};

	Layer.prototype.setMask = function(mask){
		this.renderObject.mask = mask;
	};

    O.create(Layer, 'stage.object');

    O.set('stage.layer', Layer);
})();