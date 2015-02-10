(function(Engine){
	var StateMachine = function(ctx){
		this.ctx = ctx;
		
		this.state_ctx = ctx;

		this.statesLogic = [];
		this.bootState = null;
		this.currentStateName = null;
		this.states = {};
		this.currentState = null;
		this.paused = false;
		
		if(this.bootState){
			this.start(bootState);
		}
	};
	
	var prototype = {};
	prototype.classes = ['engine.object'];

	prototype.changeTo = function(state_name){
		this.stop();
		this.start(state_name);
	};
	
	prototype.addLogic = function(state_logic){
		this.statesLogic.push(state_logic)
	};
	
	prototype.trigger = function(event_name){
		//console.log('em.trigger', event_name);
		this.statesLogic.forEach(function(state_logic){
			//console.log('em.trigger', event_name, state_logic.name);
			var new_state = state_logic.callback(this.currentStateName);
			this.start(new_state);
		}.bind(this));
	}
	
	prototype.addState = function(state_name, state_prototype){
		if(state_prototype === undefined){
			throw("(StateMachine.addState) The prototype provided on argument #2 is undefined.");
		}

		//console.log('sm.addState', state_name, state_prototype);
		this.states[state_name] = O.createClass(null, state_prototype, ['engine.statemachine.state']);
	};
	
	prototype.stop = function(){
		var that = this;
		
		if(this.currentState){
			//console.log('sm.stop', this.currentState);
			this.ctx.once('sm.state.stop.after', function(){
				this.currentState = undefined;
				this.ctx.trigger('sm.state.ready');
			}.bind(that));
			
			this.ctx.trigger('sm.state.stop.before');
			this.currentState.stop(this.state_ctx);
			this.ctx.trigger('sm.state.stop.after');
		}
		else{
			//console.log('sm.state.ready');
			this.ctx.trigger('sm.state.ready');
		}
	};
	
	prototype.start = function(state_name){
		var that = this;
		//console.log('sm.start', state_name);
		this.ctx.once('sm.state.ready', function(){
			//console.log('sm.start.ready', state_name);
			this.startState(state_name);
		}.bind(that));
		this.stop();
	};
	
	prototype.startState = function(state_name){
		//console.log('sm.startState', state_name, this.states);
		var Constructor = this.states[state_name]
		if(Constructor === undefined){
			throw("sm.startState unknown state " + state_name);
		}
		
		this.currentStateName = state_name;
		this.currentState = new this.states[state_name](this.ctx);
		
		this.ctx.trigger('sm.state.start.before');
		this.currentState.start(this.state_ctx);
		this.ctx.trigger('sm.state.start.after');
	}
	
	prototype.update = function(){
		if(this.paused === false && this.currentState){
			this.ctx.trigger('sm.state.update.before');
			this.currentState.update(this.state_ctx);
			this.ctx.trigger('sm.state.update.after');
		}
	};
	
	O.register('engine.statemachine', StateMachine, prototype, ['engine.object']);

})();