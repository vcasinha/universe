(function(Engine){
	var StateMachine = function(ctx){
		this.ctx = ctx;
		//console.log("sm.construct", this.stateContext.extension);

		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
		
		var update = function(dt){
			this.update(dt);
		}.bind(this);
		
		var stop = function(){
			ctx.off('update', update);
		}.bind(this);
		
		ctx.on('update', update);
		ctx.once('stop', stop);
	};

	StateMachine.prototype.classes = ['engine.object'];

	StateMachine.prototype.changeTo = function(state_name){
		this.stop();
		this.start(state_name);
	};
	
	StateMachine.prototype.addState = function(state_name, state_object){
		this.states[state_name] = state_object;
	};
	
	StateMachine.prototype.stop = function(){
		if(this.currentState){
			console.log('state.stop', this.currentState.name);
			this.currentState.instance.stop();
		}
		
		return this;
	};
	
	StateMachine.prototype.start = function(state_name){
		if(this.currentState){
			this.stop();
		}
		
		console.log('state.start', state_name);
		var state = this.states[state_name];
		var state_instance = O.instance(state, this.ctx);
		
		if(state_instance === undefined){
			throw("Undefined state " + state_name);
		}
		
		this.currentState = {
			name: state_name,
			instance: state_instance
		};
		
		this.currentState.instance.start();
	}
	
	StateMachine.prototype.update = function(dt){
		if(this.currentState){
			this.currentState.instance.update(dt);
		}
	};
	
	O.register('engine.state.machine', StateMachine, StateMachine.prototype);

})();