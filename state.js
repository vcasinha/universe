(function(Engine){
	var State = function(ctx){
		this.stage = ctx.stage;
		this.stage.reset();		
	};
	
	State.prototype.classes = ['engine.object']
	
	State.prototype.update = function(){
	};
	
	O.register('engine.state', State);
})(Engine);