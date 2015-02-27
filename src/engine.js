(function(){
	var Engine = function(settings){
		var self = this;
		
		this.settings = settings;
		this.components = {};
		
		var previous_timestamp;
        var update = function(current_timestamp){
            requestAnimationFrame(update);

            //rateLimit.message('engine.update', "engine.update.step fps", 1/delta);

            previous_timestamp = previous_timestamp || current_timestamp;
            var delta = (current_timestamp - previous_timestamp) / 1000;
            previous_timestamp = current_timestamp;
            
            if(self.pause === false){
				self.update(delta);
            }
        };
        
        console.log('engine.construct request animation frame');
        requestAnimationFrame(update);
	};
	
	Engine.prototype.init = function(){
		console.log('engine.init', this.settings);
		for(var com_name in this.settings.components){
			var settings = this.settings.components[com_name];
			var component = O(settings.component, settings, this.components);
			this.components[com_name] = component;
		}
		
		for(var com_name in this.components){
			//console.log("engine.init Component", com_name, settings);
			var component = this.components[com_name];
			component.init();
		}
		
		this.components.stage.engine = this;
		
		$(this.settings.container).html(this.getView());
	};

	Engine.prototype.start = function(){
		this.pause = false;
	};

	Engine.prototype.getView = function(){
		return this.components.renderer.renderer.view;
	};

	Engine.prototype.update = function(dt){
		var start_time = (new Date().getTime() / 1000);
		this.components.physics.update(dt);
		this.components.stage.update(dt);
		this.components.renderer.update(dt);
		var end_time = (new Date().getTime() / 1000);
		this.components.renderer.updateCost = Math.round((end_time - start_time) * 100000) / 100000;
	};

	Engine.prototype.getElement = function(){
		
	};
	
	Engine.prototype.getByID = function(id){
		return this.components.stage.getByID(id);
	};
	
	Engine.prototype.width = function(){
		return this.components.renderer.renderer.width;
	};

	Engine.prototype.height = function(){
		return this.components.renderer.renderer.height;
	};

	O.create(Engine);
	O.set('engine', Engine);
})();