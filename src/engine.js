(function(){
    var default_settings = {

    };

    var Engine = function(settings){
		O.get('universe.unit').apply(this);
        
        this.id = 'engine';
        
        console.log('universe.construct');

		this.ctx = O('universe.context');
		this.ctx.connect(this);
		
		console.log('engine context', this.ctx);
		
		var self = this;
		
		//Animation frame cycle
        var previous_timestamp = 0;
        var update = function(current_timestamp){
            requestAnimationFrame(update);

            //rateLimit.message('engine.update', "engine.update.step fps", 1/delta);

            previous_timestamp = previous_timestamp || current_timestamp;
            delta = (current_timestamp - previous_timestamp) / 1000;
            previous_timestamp = current_timestamp;
            
            
            if(self.pause === false){
	            self.trigger('engine.tick', delta);
            }
        };
        
        console.log('engine.construct request animation frame');
        requestAnimationFrame(update);
    };

	O.create(Engine, 'universe.unit');

    Engine.prototype.pause = true;

    Engine.prototype.init = function(settings){
        console.log('universe.init', settings);
        this.settings = O.extend({}, default_settings, settings);
        
        this.ctx.init(settings.context);
        
        $('body').append(this.ctx.renderer.renderer.view);
        console.log("View", this.ctx.renderer.renderer.view);
        
        this.width = this.ctx.renderer.renderer.width;
        this.height = this.ctx.renderer.renderer.height;
        
        this.pause = false;
    };

    Engine.prototype.start = function(){
        this.pause = false;
    };

    O.set('universe', Engine);
})();