(function(){
	var Engine = function(){
		console.log("engine.init", O);
		this.ctx = O.instance('engine.context');
		
		//console.log("engine boot");
		this.ctx.display = O.instance('engine.display.manager', this.ctx);
		this.ctx.loader = O.instance('engine.loader', this.ctx);
		this.ctx.audio = O.instance('engine.audio.manager', this.ctx);
		this.stateMachines = new O();
	}

	Engine.extend = function(){
		$.extend.apply($, arguments);
		return this;
	};
	
	Engine.prototype.init = function(settings){
		this.ctx.trigger('init', [settings]);
	};
	
	Engine.prototype.addStateMachine = function(name){
		var StateMachine = O.get('app.sm.' + name);
		
		//console.log("engine.addStateMachine", name, typeof StateMachine, O.dump());
		if(typeof StateMachine !== 'function'){
			throw "Invalid state machine for '" + name + "'";
		}
		
		//console.log("engine.addStateMachine", name, StateMachine);
		
		this.stateMachines.set(name, StateMachine);
	};
	
	Engine.prototype.setStateMachine = function(name){
		if(this.updateCallback){
			this.ctx.off('display.update', this.updateCallback);
		}
	
		var Constructor = this.stateMachines.get(name);
		
		this.ctx.sm = new Constructor(this.ctx);
		this.updateCallback =  function(){
			this.ctx.sm.update();
		}.bind(this);

		this.ctx.on('display.update', this.updateCallback);

		console.log("engine.setStateMachine.end", name, this.ctx.sm);
	}

	O.register('engine', Engine);
	
	window.Engine = Engine;
})();