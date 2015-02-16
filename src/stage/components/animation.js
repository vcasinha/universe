(function(){
	var Animation = function(parent, user_settings, sprite){
		this.sprite = sprite;
		this.animations = {};
		this.currentAnimation = null;
		
        if(user_settings.load){
            for(var i in user_settings.load){
                this.add(user_settings.load[i]);
            }
        }
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
		
		
		parent.on('addon.update', update);
		this.sprite.setFrame(0);
	};
	
	Animation.prototype.classes = ['engine.component'];
	
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
		//console.log("animation.play", this.currentAnimation);
	};
	
	O.register('addon.animation', Animation);
})();