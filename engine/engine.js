(function(Oo){
	var Context = function(items){
		OO.call(this);
		Oo.EventManager.call(this);
		Oo.extend(this.items, items);
	};
	
	Context.prototype.clone = function(){
		var ctx = new Context(this.items);
		ctx.display = this.display;
		ctx.loader = this.loader;
		ctx.audio = this.audio;
		return ctx;
	};
	
	Context.prototype.constructor = Context;
	
	var Engine = function(){
		OO.call(this);
		this.ctx = new Context();
		this.stateMachines = new OO();
		
		//console.log("engine boot");
		this.ctx.display = new Engine.DisplayManager(this.ctx);
		this.ctx.loader = new Engine.Loader(this.ctx);
		this.ctx.audio = new Engine.AudioManager(this.ctx);
	}

	//Singleton methods
	Engine.states = new OO();
	Engine.stateMachines = new OO();
	Engine.extend = function(){
		$.extend.apply($, arguments);		
		return this;
	};

	//Object methods
	Engine.prototype = Object.create(OO.prototype);
	Engine.prototype.constructor = Engine;
	
	Engine.prototype.init = function(settings){
		this.ctx.trigger('init', [settings]);
	};
	
	Engine.prototype.addStateMachine = function(name, StateMachine){
		//console.log("engine.addStateMachine", name, StateMachine);
		this.stateMachines.set(name, StateMachine);
	};
	
	Engine.prototype.setStateMachine = function(name){
		if(this.updateCallback){
			this.ctx.off('display.update', this.updateCallback);
		}
	
		var StateMachine = this.stateMachines.get(name);
		//console.log("engine.setStateMachine", name, StateMachine);
		
		this.ctx.sm = new StateMachine(this.ctx);
		this.updateCallback = this.ctx.sm.update.bind(this.ctx.sm);
		this.ctx.on('display.update', this.updateCallback);
	}

	Engine.prototype.updateCallback = null;
	Engine.prototype.stateMachines = {};
	
	window.Engine = Engine;
})(Oo);