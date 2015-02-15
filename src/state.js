(function(){
	var State = function(ctx){
		this.stage = ctx.stage;
		this.stage.reset();		
	};
	
	State.prototype.classes = ['engine.component']
	
	State.prototype.update = function(){
	};
	
	O.register('engine.state', State);
})();