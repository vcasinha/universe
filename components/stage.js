(function(){
	var Stage = function(){
		console.log("component.construct");
		this.objects = {};
		
		var step = this.settings.step || 1/60;
		var current_step = 0;
		var time_before = new Date().getTime();
		var update = function(dt){
			if(dt < current_step){
				current_step -= dt;
				return false;
			}
			time_now = new Date().getTime();
			time_delta = time_now - time_before;
			time_before = time_now;
			//console.log("stage update");
			this.update(time_delta / 1000);
			current_step = step;
			
		}.bind(this);
		
		var init = function(){
			this.start();
			this.reset();
		}.bind(this);
		
		var stop = function(){
			this.stop();
			this.ctx.off('update', update);
		}.bind(this);

		this.ctx.once('init', init);
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
		this.container = this.ctx.renderer.layer();
		this.ctx.renderer.add(this.container);
	};
	
	Stage.prototype.stop = function(){
		for(var i in this.objects){
			this.objects[i].stop();
			delete this.objects[i];
		}
	};
	
	Stage.prototype.reset = function(){
		this.stop();
		this.entities = {};
	};
	
	Stage.prototype.get = function(object_name){
		return this.objects[object_name];
	};
	
	Stage.prototype.add = function(user_settings){		
		var default_settings = {
			id: (typeof user_settings === 'string') ? user_settings : (new Date().getTime()).toString(16),
			objName: 'stage.object',
			anchor: {
				x: 0.5,
				y: 0.5
			}
		};
		
		var settings = O.extend({}, default_settings, user_settings);
		
		console.log('stage.add', settings);
		
		var object = this.objects[settings.id] = O.instance(settings.objName, this, settings);

		return object;
	};
	
	Stage.prototype.addObject = function(object_name, settings){
		var object = O.instance(object_name, this, settings);
		console.log('stage.add', object.settings);
		this.objects[object.settings.name] = object;

		return this;
	}
	
	Stage.prototype.remove = function(object_name){
		if(typeof object_name === 'object'){
			object_name = object.settings.name;
		}
		
		var object = this.get(object_name).stop();
		if(object){
			object.stop();
			delete this.objects[object_name];
		}

		return this;
	};
	
	Stage.prototype.update = function(dt){
/*
	    if(dt < this.step){
		    this.step -= dt;
	    }
	    else{
		    var show = true;
		    this.step = 1;
	    }
*/
	    
		for(var i in this.objects){
/*
			if(show){
				console.log("stage.update", i, this.objects);
			}
*/
			
			this.objects[i].update(dt);
		}
	};
	
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
	
	O.register('component.stage', Stage);
})();