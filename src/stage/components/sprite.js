(function(){
	var StageSprite = function(stage, user_settings){
		this.frames = [];
		this.renderer = this.ctx.renderer;
		
		this.currentFrame = null;
		
		this.stage = stage;
		this.ctx = stage.ctx;
		
		var default_settings = {
			x: 0,
			y: 0,
			anchor: {
				x: 0.5, 
				y:0.5
			}
		};
		
		this.settings = O.extend({}, default_settings, user_settings);
		
		//console.log('stage.sprite.construct', this.id, this.settings, this.ctx);
		
		//Create sprite
		this.sprite = this.ctx.renderer.getSprite();
		this.ctx.renderer.add(this.sprite);
		
		this.sprite.anchor.set(this.settings.anchor.x, this.settings.anchor.y);
		this.sprite.position.set(this.settings.x, this.settings.y);
		this.position = this.sprite.position;
		this.scale = this.sprite.scale;
		
		this.sprite.interactive = true;
		this.sprite.buttonMode = true;
    };
    
    StageSprite.prototype.classes = ['stage.object'];
	StageSprite.prototype.loadFrame = function(name, index){
		index = index || this.frames.length;
		var texture = this.renderer.getTexture(name);
		this.frames[index] = texture;
		
		if(!this.frameCurrent){
			this.setFrame(0);	
		}
		
		return this;
	};
	
	StageSprite.prototype.nextFrame = function(){
		this.setFrame(this.currentFrame + 1);
	};
	
	StageSprite.prototype.setFrame = function(index){
		if(this.frames.length === 0){
			return this;
		}
		
		if(index > this.frames.length - 1){
			index = 0;
		}
		
		if(index < 0){
			index = this.frames.length - 1;
		}
		
		this.currentFrame = index;
		//console.log('sprite.setFrame', index, this.sprite);
		this.sprite.setTexture(this.frames[this.currentFrame]);
		
		return this;
	};
    
    StageSprite.prototype.loadAnimation = function(settings){
		var frames = this.renderer.getAnimationTextures(settings);
		console.log("sprite.loadAnimation", frames.length);
		for(var i in frames){
			this.frames.push(frames[i]);
		}
		
		return frames;
    };
    
	O.register('addon.sprite', StageSprite);
})();