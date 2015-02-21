(function(){
    var default_settings = {

    };

    var StageObject = function(){
	    Unit.apply(this);
	    //console.log('object.construct');
	    
	    var self = this;
	    this.type = 'stage.object';
	    
	    this.renderObject = new PIXI.DisplayObjectContainer();
        
        this.on('check.renderobject', function(unit){
	        if(unit.renderObject !== undefined){
		        //console.log('Object has render object', unit.renderObject);
		        self.renderParent = unit;
		        self.renderParent.renderObject.addChild(self.renderObject);
		        console.log('render.parent.connected', unit.id);
	        }
        });
        
        this.on('connect', function(unit){
	        if(self.ctx === undefined){
		        self.ctx = this.findByID('context');
		        if(self.ctx !== undefined){
			        self.connected = true;
			        console.log('object.connected', self.id);
			        self.trigger('check.renderobject', unit);
			        self.trigger('connected');
		        }
	        }
	        else if(self.renderParent === undefined){
				self.trigger('check.renderobject', unit);
	        }
        });
        
        this.on('disconnect', function(unit){
	        if(unit === self.renderParent){
		        console.log('render.lost', self.id);
		        self.renderParent.renderObject.removeChild(self.renderObject);
				self.renderParent = undefined;
	        }
        });
        
        this.on('alone', function(){
	        console.log("alone", self.id);
	        self.connected = false;
			self.ctx = undefined;
        });
    };

    StageObject.prototype.init = function(settings){
		
		this.settings = O.extend({}, default_settings, settings);

    };

	var Unit = O.get('universe.unit');
    O.create(StageObject, Unit);

    O.set('stage.object', StageObject);
})();