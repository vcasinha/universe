(function(){
    "use strict";
    
    var default_settings = {

    };

    var StageObject = function(){
	    this.link = {
		    ctx: 'context',
		    stage: 'stage'
	    };
	    
	    O.exec('universe.entity', this);
	    //console.log('object.construct');
	    
	    var self = this;
	    this.type = 'stage.object';
	    
	    this.renderObject = new PIXI.DisplayObjectContainer();
        
        this.on('connected', function(unit){
	        if(self.renderParent === undefined){
		        if(unit.renderObject !== undefined){
			        //console.log('Render parent', this.id, unit.id);
			        self.renderParent = unit;
			        self.renderParent.renderObject.addChild(self.renderObject);
		        }
		        else{
			        console.error('not suitable render parent', this.id, unit.id);
		        }
	        }
	        else{
		        //console.log('Already have a Render parent', this.id, unit.id);
	        }
        });
    };

    StageObject.prototype.init = function(settings){
		this.settings = O.extend({}, default_settings, settings);
    };

    O.create(StageObject, 'universe.entity');

    O.set('stage.object', StageObject);
})();