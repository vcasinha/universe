(function(){
	var Stage = function(ctx){
		console.log("stage.construct");
		this.entities = [];
		
		var start = function(){
			//console.log("stage.start");
			this.container = this.ctx.renderer.createGroup();
		}.bind(this);
		
		var stop = function(){
			//console.log("stage.stop");
			this.reset();
			this.ctx.renderer.remove(this.container);
			ctx.off('update', update);
		}.bind(this);

		var update = function(dt){
			this.update(this, dt);
		}.bind(this);

		this.once('component.start', start);
		this.once('component.stop', stop);
		this.on('component.update', update);
		this.data = {};
	};
	
	Stage.prototype.classes = ['o.events', 'engine.object'];
	
	Stage.prototype.width = function(){
		return this.ctx.renderer.width;
	};
	
	Stage.prototype.height = function(){
		return this.ctx.renderer.height;
	};
	
	Stage.prototype.reset = function(){
		this.entities.forEach(function(entity){
			entity.stop();
		});
		
		this.ctx.renderer.remove(this.container);
		
		this.container = this.ctx.renderer.layer();
		this.ctx.renderer.add(this.container);
		this.entities = [];
	};
	
	Stage.prototype.add = function(entity){
		if(this.entities.indexOf(entity) < 0){
			this.entities.push(entity);
		}
		else{
			console.warn("Duplicate entity, not adding to stage");
		}
		return this;
	};
	
	Stage.prototype.remove = function(entity){
		var ix = this.entities.indexOf(entity);
		if(ix >= 0){
			this.entities.splice(ix, 1);
		}
		
		return this;
	};
	
	Stage.prototype.update = function(dt){
		this.entities.forEach(function(entity){
			entity.update(dt);
		});
	};
	
	Stage.prototype.createContainer = function(){
		return this.ctx.renderer.layer();
	};
	
	Stage.prototype.sprite = function(name, settings){
		var default_settings = {
			anchor: {
				x: 0.5,
				y: 0.5
			},
		};
		
		var settings = $.extend({}, default_settings, settings);
		
		//console.log("stage.sprite", name);
		var element = this.ctx.renderer.sprite(name);
		this.container.addChild(element);
		
		if(typeof settings.position === 'object'){
			element.position.x = settings.position.x;
			element.position.y = settings.position.y;
		}
		
		element.anchor.x = settings.anchor.x;
		element.anchor.y = settings.anchor.y;
		
		if(typeof settings.physics === 'object'){
			this.ctx.stage.attachBody(element, settings.physics);
		}
		
		return element;
	};
	
	Stage.prototype.attachBody = function(entity, settings){
		settings.x = entity.position.x;
		settings.y = entity.position.y;
		this.ctx.physics.attachBody(entity, settings);
	};
	
	Stage.prototype.graphics = function(){
		//console.log('stage.graphics');
		var element = new PIXI.Graphics();
		this.container.addChild(element);
		
		return element;
	};
	
	O.register('engine.stage', Stage);
})();