(function(){
    var default_settings = {

    };

    var Stage = function(){
	    StageObject.apply(this);
	    
	    var self = this;
	    this.id = 'stage';
	    
        console.log('stage.construct');
        
        this.layers = {};
        
        this.on('connected', function(){
	        console.log('Stage connected');
	        
	        self.trigger('check.renderobject', this.ctx.renderer);
	        
	        this.engine = this.findByID('engine');
	        this.engine.on('engine.tick', function(delta){
				self.trigger('stage.tick');
			});
        });
    };

    Stage.prototype.init = function(settings){
		
		this.settings = O.extend({}, default_settings, settings);
		
		console.log('stage init', this.settings);
    };

	Stage.prototype.get = function(){
		
	};

	Stage.prototype.render = function(delta){
		this.renderer.render(this.stage);	
	};

	var StageObject = O.get('stage.object');
    O.create(Stage, StageObject);

    O.set('universe.stage', Stage);
})();