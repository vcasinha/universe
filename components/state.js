(function(Engine){
	var StateMachine = function(){
		console.log("component.state.construct");

		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
		
		var step = this.settings.step || 1/30;
		var current_step = 0;
		
		var update = function(dt){
			if(dt < current_step){
				current_step -= dt;
				return false;
			}

// 			console.log("state update");
			this.update(dt);
			current_step = step;
			
		}.bind(this);
		
		var init = function(){
			console.log("component.state.init", this.settings);
			for(var i in this.settings.states){
				var state = this.settings.states[i];
				this.addState(state, 'sm.' + state);
			}
		}.bind(this);
		
		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		var start = function(){
			this.start(this.settings.boot || 'boot');
		}.bind(this);
		
		this.ctx.once('init', init);
		this.ctx.once('start', start);
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
	};

	StateMachine.prototype.classes = ['engine.component'];

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
	
	O.register('component.state', StateMachine);

})();