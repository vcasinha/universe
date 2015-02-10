(function(Engine){
	var State = function(ctx){
		this.ctx = ctx;
	};
	
	O.set('engine.statemachine.state', O.createClass(State));
})(Engine);