(function(){
	var Animation = function(parent, sprite){
		this.sprite = this.settings.sprite;
		this.animations = {};
		this.currentAnimation = null;
		
		//console.log('animation.construct', sprite);
		//Handle events
		var step = 1 / 1;
		var time_remaining = 0;
		
		var update = function(dt){
			if(dt < time_remaining){
				time_remaining -= dt;
				return false;
			}
			
			if(this.currentAnimation){
				this.currentAnimation.currentFrame++;
				if(this.currentAnimation.currentFrame > this.currentAnimation.endFrame){
					this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
				}
				time_remaining = 1 / this.currentAnimation.fps;
				this.sprite.setFrame(this.currentAnimation.currentFrame);
			}
		}.bind(this);
		
		var stop = function(){
			this.off(update);
		}.bind(this);
		
		parent.on('addon.update', update);
		parent.once('stop', stop);
		this.sprite.setFrame(0);
	};
	
	Animation.prototype.classes = ['stage.object'];
	
	Animation.prototype.add = function(animation){
		if(typeof animation !== 'object'){
			console.error("animation.add Invalida animation argument", animation);
			throw("");
		}
		
		animation.startFrame = this.sprite.frames.length;
		var frames = this.sprite.loadAnimation(animation);
		animation.endFrame = animation.startFrame + frames.length;
		animation.currentFrame = animation.startFrame;
		
		this.animations[animation.name] = animation;
	};
	
	Animation.prototype.play = function(name){
		if(typeof name !== 'string'){
			console.error('animation.play Invalid animation name argument', name);
			throw("");
		}
		
		this.currentAnimation = this.animations[name];
		this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
		console.log("animation.play", this.currentAnimation);
	}
	
	O.register('addon.animation', Animation);
})();