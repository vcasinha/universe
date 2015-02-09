(function(Engine, App){
	var StateMachine = function(ctx){
		var boot_state = {
			start: function(){
				console.log("boot.start");
				
				var assets = [
					
					{name: 'music', location: 'audio/bach.ogg', type: 'audio'},
					{name: 'texture', location: 'images/baddie.png', type: 'image'},
				];

				this.ctx.loader.queueList(assets);
				this.ctx.loader.load();
				this.ctx.trigger('sm.state.start');
				
				this.ctx.onOnce('assets.loaded', function(){
					this.ctx.sm.start('splash');
				}.bind(this))
			},
			stop: function(){
				console.log("boot.stop");
				this.ctx.trigger('sm.state.stop');
			},
			update: function(){
				this.ctx.trigger('sm.state.update');
				//console.log("boot.update");
			}
		};

		var splash_state = {
			start: function(){
				this.stage_ctx = this.ctx.clone();
				console.log("splash.start");
				this.actor = new Engine.Entity(this.stage_ctx);
				this.ctx.audio.assets.get('music').play();
			},
			stop: function(){
				console.log("boot.stop");
				this.ctx.trigger('sm.state.stop');
			},
			update: function(){
				this.actor.update();
				this.ctx.trigger('sm.state.update');
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
	
	StateMachine = Oo.createClass(StateMachine, {}, [Engine.StateMachine]);

	//console.log("statemachine.main", StateMachine);
	Engine.stateMachines.set('main', StateMachine);
	
})(Engine, App);