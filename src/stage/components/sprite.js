(function(){
	var StageSprite = function(parent, user_settings){
		this.frames = [];
		this.renderer = this.ctx.renderer;
		
		this.currentFrame = null;
		this.parent = parent;
        //console.log('addon.start', parent);
        
        //Create sprite
        this.sprite = this.renderer.getSprite();
        this.parent.renderContainer.addChild(this.sprite);
        
        this.sprite.anchor.set(this.settings.anchor.x, this.settings.anchor.y);
        this.scale = this.sprite.scale;
        
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        
        parent.on('sprite.frame', function(frame){
	        this.setFrame(frame);
        }.bind(this))
    };
    
    StageSprite.prototype.classes = ['stage.addon'];

	StageSprite.prototype.loadFrame = function(name, index){
		index = index || this.frames.length;
		var texture = this.renderer.getTexture(name);
		this.frames[index] = texture;
		
		if(!this.frameCurrent){
			this.setFrame(0);	
		}
		
		return this;
	};
	
	StageSprite.prototype.onClick = function(callback){
		this.sprite.click = callback	
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
		//console.log("sprite.loadAnimation", frames.length);
		for(var i in frames){
			this.frames.push(frames[i]);
		}
		
		return frames;
    };
    
    StageSprite.prototype.defaultSettings = {
        x: 0,
        y: 0,
        anchor: {
            x: 0.5, 
            y:0.5
        },
        stage: false
    };

	O.register('addon.sprite', StageSprite);
})();