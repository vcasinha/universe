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
			//rateLimit.message('behavior.update', 1/dt);
			this.update(dt);
		}.bind(this);
		
		var init = function(){
			//console.log("component.state.init", this.settings);
			for(var i in this.settings.states){
				var state = this.settings.states[i];

				console.log('behavior.init', i, state);
				this.addState(state, 'sm.' + state);
			}
		}.bind(this);
		
		var stop = function(){
			this.stop();
		}.bind(this);
		
		var start = function(){
			var state = this.settings.boot || 'boot';
			this.start(state);
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
			console.log('behavior.stop', this.currentState.name);
			this.currentState.instance.trigger('stop');
		}
		
		return this;
	};
	
	StateMachine.prototype.start = function(state_id){
		if(this.currentState){
			this.stop();
		}
		
		var state_name = this.states[state_id];
		var state_instance = O.instance(state_name, this.ctx);
		console.log('behavior.start', state_id, '(' + state_name + ')');
		if(state_instance === undefined){
			throw("Undefined state " + state_name);
		}
		
		this.currentState = {
			name: state_name,
			instance: state_instance
		};

		this.currentState.instance.trigger('start');
	}
	
	StateMachine.prototype.update = function(dt){
		if(this.currentState){
			//console.log('behavior.update', dt);
			this.currentState.instance.trigger('update', dt);
		}
	};
	
	O.register('component.state', StateMachine);

})();