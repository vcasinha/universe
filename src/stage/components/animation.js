(function(){
	var Animation = function(){
		this.paused = true;
		this.animations = {};
		this.frames = [];
		this.currentAnimation = null;
		this.sprite = this.parent.sprite;
		if(this.parent.sprite === undefined){
			throw("Parent must have a sprite to attach animations");
		}
	
        if(this.settings.load){
            for(var i in this.settings.load){
                this.add(this.settings.load[i]);
            }
        }
        
        if(this.settings.start){
	        this.play(this.settings.start);
        }
		//console.log('animation.construct', sprite);
		//Handle events
		var step = 1 / 60;
		var time_passed = 0;
				
		this.ctx.on('stage.update', function(dt){
			if(this.paused === true){
				return false;
			}
			
			time_passed += dt;
			if(this.currentAnimation && time_passed > 1 / this.currentAnimation.fps){
				this.currentAnimation.currentFrame++;
				if(this.currentAnimation.currentFrame > this.currentAnimation.endFrame){
					this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
				}
				
				this.sprite.setFrame(this.currentAnimation.currentFrame);
				
				time_passed = 0;
			}
		}.bind(this));
		
		this.sprite.setFrame(0);
	};
	
	Animation.prototype.classes = ['stage.addon'];
	
	Animation.prototype.add = function(animation){
		if(typeof animation !== 'object'){
			console.error("animation.add Invalida animation argument", animation);
			throw("");
		}
		
		animation.startFrame = this.sprite.frames.length;
		
		var frames = this.sprite.loadAnimation(animation);
		animation.endFrame = animation.startFrame + this.sprite.frames.length;
		animation.currentFrame = animation.startFrame;
		
		this.animations[animation.name] = animation;
	};
	
	Animation.prototype.play = function(name){
		if(typeof name === 'string'){
			this.currentAnimation = O.extend({}, this.animations[name]);
			this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
		}
		
		this.paused = false;
		//console.log("animation.play", this.currentAnimation);
	};
	
	Animation.prototype.pause = function(){
		this.paused = true;
	};
	
	O.register('addon.animation', Animation);
})();