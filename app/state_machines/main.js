(function(){
	var StateMachine = function(){
		var boot_state = {
			start: function(ctx){
				console.log("boot.start");
				
				var assets = [
					//{name: 'music', location: 'audio/bach.ogg', type: 'audio'},
					{name: 'texture', location: 'images/diamond.png', type: 'image'},
				];

				ctx.loader.queueList(assets);
				ctx.loader.load(assets, function(){
					ctx.sm.start('splash');
				}.bind(this));
				
				ctx.once('assets.loaded', function(){
					
				}.bind(this));
			},
			stop: function(ctx){
				console.log("boot.stop");
				ctx.trigger('sm.state.stop');
			},
			update: function(ctx){
				ctx.trigger('sm.state.update');
				//console.log("boot.update");
			}
		};

		var splash_state = {
			start: function(ctx){
				console.log("scene.splash.start");
				//ctx.audio.get('music').play();
				this.actor = O.instance('app.actor', ctx);
			},
			stop: function(ctx){
				console.log("boot.stop");
				ctx.trigger('sm.state.stop');
			},
			update: function(ctx){
				//this.actor.update();
				ctx.trigger('sm.state.update');
				//console.log("splash.update");
			}
		};

		this.addState('boot', boot_state);
		this.addState('splash', splash_state);

		this.addLogic({name: 'loaded', callback: function(current_state){
			if(current_state === 'boot'){
				return 'loader';
			}
			
			return false;
		}});
	};
	
	O.register('app.sm.main', StateMachine, {}, ['engine.statemachine']);
	
})();