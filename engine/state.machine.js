(function(Engine){
	Engine.StateMachine = function(ctx){
		this.ctx = ctx;
		
		this.statesLogic = [];
		this.bootState = null;
		this.currentStateName = null;
		this.states = {};
		this.currentState = null;
		
		if(this.bootState){
			this.start(bootState);
		}
	};
	
	Engine.StateMachine.prototype.constructor = Engine.StateMachine;
	
	Engine.StateMachine.prototype.changeTo = function(state_name){
		this.stop();
		this.start(state_name);
	};
	
	Engine.StateMachine.prototype.addLogic = function(state_logic){
		this.statesLogic.push(state_logic)
	};
	
	Engine.StateMachine.prototype.trigger = function(event_name){
		//console.log('em.trigger', event_name);
		this.statesLogic.forEach(function(state_logic){
			//console.log('em.trigger', event_name, state_logic.name);
			var new_state = state_logic.callback(this.currentStateName);
			this.start(new_state);
		}.bind(this));
	}
	
	Engine.StateMachine.prototype.addState = function(state_name, state_prototype){
		if(state_prototype === undefined){
			throw("sm.addState.undefined");
		}

		//console.log('sm.addState', state_name, state_prototype);
		this.states[state_name] = Oo.createClass(null, state_prototype, Engine.State);
	};
	
	Engine.StateMachine.prototype.stop = function(){
		var that = this;
		this.requestToStop = true;
		if(this.currentState){
			//console.log('sm.stop', this.currentState);
			this.ctx.onOnce('sm.state.stop', function(){
				this.currentState = undefined;
				this.ctx.trigger('sm.ready');
			}.bind(that));
			
			this.currentState.stop();
		}
		else{
			//console.log('sm.ready');
			this.ctx.trigger('sm.ready');
		}
	};
	
	Engine.StateMachine.prototype.start = function(state_name){
		var that = this;
		//console.log('sm.start', state_name);
		this.ctx.onOnce('sm.ready', function(){
			this.startState(state_name);
		}.bind(that));
		this.stop();
	};
	
	Engine.StateMachine.prototype.startState = function(state_name){
		//console.log('sm.startState', state_name, this.states);
		var Constructor = this.states[state_name]
		if(Constructor === undefined){
			throw("sm.startState unknown state " + state_name);
		}
		
		this.currentStateName = state_name;
		this.currentState = new this.states[state_name](this.ctx);
		this.currentState.start();
	}
	
	Engine.StateMachine.prototype.update = function(){
		if(this.currentState){
			this.currentState.update();
		}
	};
	
})(Engine);