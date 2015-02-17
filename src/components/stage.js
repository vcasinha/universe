(function(){
	var Stage = function(){
		console.log("stage.construct", this.settings);
		this.objects = {};
		
		var step = this.settings.step || 1/60;
		var current_step = 0;
		var time_before = new Date().getTime();

		var update = function(dt){			
			//Update listeners
			
			//this.trigger('update', dt);
			this.trigger('addon.update', dt);
			
			//Update attached objects
			this.update(dt);
			
		}.bind(this);
		
		var init = function(){
            console.log('stage.init');
            this.renderContainer = O.i('engine.layer');
            this.ctx.renderer.add(this.renderContainer);
			this.start();
			this.reset();
		}.bind(this);
		
		var stop = function(){
			this.stop();
			this.ctx.off('update', update);
		}.bind(this);

		this.ctx.once('start', init);
		this.ctx.once('stop', stop);
		this.ctx.on('update', update);
	};
	
	Stage.prototype.classes = ['engine.component', 'o.events'];
	
	Stage.prototype.width = function(){
		return this.ctx.renderer.width;
	};
	
	Stage.prototype.height = function(){
		return this.ctx.renderer.height;
	};
	
	Stage.prototype.start = function(){
	};
	
	Stage.prototype.stop = function(){

	};
	
	Stage.prototype.reset = function(){
        for(var id in this.objects){
            this.objects[id].stop();
            delete this.objects[i];
        }
	};
	
	Stage.prototype.get = function(object_name){
		return this.objects[object_name];
	};
	
	Stage.prototype.createAdd = function(user_settings){	
        console.log('stage.createAdd', user_settings);

		user_settings.instance = user_settings.instance || 'stage.object';
		var object = O.instance(user_settings.instance, user_settings);
		this.add(object);

		return object;
	};
	
	Stage.prototype.add = function(object){
		if(typeof object !== 'object' || object.settings.id === undefined){
			console.warn("stage.add Invalid object", object);
			throw("Object is undefined invalid");
		}
		
		//console.log('stage.add', object.settings.id);
        object.stage = this;
        object.ctx = this.ctx;
		this.objects[object.settings.id] = object;
		this.renderContainer.addChild(object.renderContainer);

        object.trigger('start');

		return this;
	};
	
	Stage.prototype.remove = function(id){
		if(typeof id === 'object'){
			id = object.getID();
		}
		
		var object = this.get(id);
		if(object){
			object.stop();
			delete this.objects[id];
		}

		return this;
	};
	
	Stage.prototype.settingsDefault = {
		step: 1/60
	};

	Stage.prototype.update = function(dt){
		//rateLimit.message('stage.update', 1/dt);
		for(var id in this.objects){
			this.objects[id].trigger('addon.update', dt);
			this.objects[id].trigger('update', dt);
		}
	};
	/*
	Stage.prototype.createContainer = function(){
		return this.ctx.renderer.layer();
	};
	
	Stage.prototype.createSprite = function(name, settings){
		if(typeof name === 'object' && settings === undefined){
			settings = name;
			name = undefined;
		}
		
		var default_settings = {
			anchor: {
				x: 0.5,
				y: 0.5
			},
			interactive: false,
		};
		
		var settings = $.extend({}, default_settings, settings);
		
		//console.log("stage.createSprite", name, settings);
		var element = this.ctx.renderer.sprite(name);
		this.container.addChild(element);
		
		if(settings.x && settings.y){
			element.position.x = settings.x;
			element.position.y = settings.y;
		}
		
		if(settings.width){
			element.width = settings.width;
		}
		
		if(settings.height){
			element.height = settings.height;
		}
		
		element.interactive = settings.interactive;
		
		element.anchor.x = settings.anchor.x;
		element.anchor.y = settings.anchor.y;
		
		if(typeof settings.physics === 'object'){
			this.ctx.stage.attachBody(element, settings.physics);
		}
		
		return element;
	};
	
	Stage.prototype.createBody = function(settings){
		var default_settings = {
			type: 'static',
			friction: 0.5	
		};
		
		return this.ctx.physics.createBody(O.extend({}, default_settings, settings));
	};
	
	Stage.prototype.attachBody = function(entity, settings){
		settings.x = entity.x;
		settings.y = entity.y;
		if(!settings.shape || settings.shape == 'box'){
			settings.width = entity.width;
			settings.height = entity.height;
			console.log("stage.attachBody.custom", settings);
		}
		
		this.ctx.physics.attachBody(entity, settings);
	};
	
	Stage.prototype.graphics = function(){
		//console.log('stage.graphics');
		var element = new PIXI.Graphics();
		this.container.addChild(element);
		
		return element;
	};
	*/
	O.register('component.stage', Stage);
})();