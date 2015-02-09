(function(Oo){
	var Context = function(items){
		OO.call(this);
		Oo.EventManager.call(this);
		Oo.extend(this.items, items);
	};
	
	Context.prototype.clone = function(){
		var ctx = new Context(this.items);
		
		return ctx;
	};
	
	Context.prototype.constructor = Context;
	
	var Engine = function(){
		OO.call(this);
		this.ctx = new Context();
		this.stateMachines = new OO();
		
		console.log("engine boot");
		this.ctx.display = new Engine.DisplayManager(this.ctx);
		this.ctx.assets = new Engine.AssetsController(this.ctx);
	}
	
	Engine.states = new OO();
	Engine.stateMachines = new OO();
	
	Engine.prototype = Object.create(OO.prototype);
	Engine.prototype.constructor = Engine;
	
	Engine.prototype.init = function(settings){
		this.ctx.trigger('init', [settings]);
	};
	
	Engine.prototype.addStateMachine = function(name, StateMachine){
		console.log("engine.addStateMachine", name, StateMachine);
		this.stateMachines.set(name, StateMachine);
	};
	
	Engine.prototype.setStateMachine = function(name){
		if(this.updateCallback){
			this.ctx.off('display.update', this.updateCallback);
		}
	
		var StateMachine = this.stateMachines.get(name);
		console.log("engine.setStateMachine", name, StateMachine);
		
		this.ctx.sm = new StateMachine(this.ctx);
		this.updateCallback = this.ctx.sm.update.bind(this.ctx.sm);
		this.ctx.on('display.update', this.updateCallback);
	}
	
	Engine.prototype.updateCallback = null;
	Engine.prototype.stateMachines = {};
	
	window.Engine = Engine;
})(Oo);