(function(Engine){
	var BootState = function(ctx){
		Engine.State.call(this, ctx);
	};
	
	BootState.prototype = Object.create(Engine.State.prototype);
	BootState.prototype.constructor = BootState;
	
	BootState.prototype.start = function(){
		console.log("boot.start", this.ctx);
		
		this.ctx.assets.queueAsset('texture', 'images/baddie.png');
		this.ctx.assets.queueAsset('texture', 'audio/bach.ogg');
		this.ctx.assets.queueAsset('texture', 'images/baddie.png');
		this.ctx.assets.queueAsset('texture', 'images/baddie.png');
		this.ctx.assets.queueAsset('texture', 'images/baddie.png');
		this.ctx.assets.loadQueue();
		
		this.ctx.trigger('sm.state.start');
		
		this.ctx.onOnce('assets.loaded', function(){
			this.ctx.sm.start('splash');
		}.bind(this))
	};
	
	BootState.prototype.stop = function(){
		console.log("boot.stop", this);
		this.ctx.trigger('sm.state.stop');
	};
	
	BootState.prototype.update = function(){
		this.ctx.trigger('sm.state.update');
		console.log("boot.update");
	};
	
	Engine.states.set('states.boot', BootState);
	
})(Engine);