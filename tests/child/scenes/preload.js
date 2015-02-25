(function(){
	var Scene = function(){
		this.id = 'preload';
		this.$parent.apply(this);
		//console.log('scene.construct', this.settings);
		
		this.assets = {};
	};
	
	Scene.prototype.start = function(){
		console.log('preload.start');
		var assets = [
			{type: 'texture', location: '../assets/ball1.png', id: 'ball'},
			{type: 'audio', location: '../assets/ball.mp3', id: 'ball'},
			//{type: 'audio', location: '../assets/if.the.stars.were.mine.ogg', id: 'music'},
			
		];
		this.components.assets.load(assets);
	};
	
	Scene.prototype.update = function(dt){
		if(this.components.assets.loaded){
			engine.components.stage.setScene('main');
		}
	};
	
	O.create(Scene, 'entity');
	O.set('scene.preload', Scene);
})();