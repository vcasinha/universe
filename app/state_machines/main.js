(function(Engine, App){
	var StateMachine = function(ctx){
		Engine.StateMachine.call(this, ctx);
		
		this.addState('boot', Engine.states.get('states.boot'));
		this.addLogic({name: 'loaded', callback: function(current_state){
			if(current_state === 'boot'){
				return 'loader';
			}
			
			return false;
		}});
	};
	
	StateMachine.prototype = Object.create(Engine.StateMachine.prototype);
	StateMachine.prototype.constructor = StateMachine;
	
	console.log("statemachine.main", StateMachine);
	Engine.stateMachines.set('main', StateMachine);
	
})(Engine, App);