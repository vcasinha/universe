(function(){
	var State = function(ctx){
        this.ctx = ctx;
		this.stage = ctx.stage;
		this.stage.reset();

	};
	
	State.prototype.classes = ['engine.component', 'o.events'];

	O.register('engine.state', State);
})();