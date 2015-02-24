(function(){
	var SpriteController = function(){
		this.frames = [];
		this.currentFrame = 0;
		this.renderObject = new PIXI.Sprite();
	};

	SpriteController.prototype.setFrame = function(frame){
		if(frame < 0){
			frame = 0;
		}
		
		if(frame >= this.frames.length){
			frame = this.frames.length;
		}
		
		this.currentFrame = frame;
		this.sprite.setTexture(this.frames[this.currentFrame]);
		
		return this;
	};	

	SpriteController.prototype

	O.create(SpriteController, 'stage.object');

	O.set('controller.sprite');
})();