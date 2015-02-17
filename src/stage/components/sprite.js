(function(){
	var StageSprite = function(parent, user_settings){
		this.frames = [];
		this.renderer = this.ctx.renderer;
		
		this.currentFrame = null;
		this.parent = parent;
		
        //console.log('addon.start', this.id, this.settings);
        
        //Create sprite
        this.sprite = this.renderer.getSprite();
        this.parent.renderContainer.addChild(this.sprite);
        
        this.sprite.anchor.set(this.settings.anchor.x, this.settings.anchor.y);
        this.sprite.position.set(this.parent.x, this.parent.y);
        this.scale = this.sprite.scale;
        
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;

        var position_update = function(position){
            this.sprite.position.set(position.x, position.y);
        }.bind(this);
        parent.on('position.update', position_update);

        var rotation_update = function(angle){
            this.sprite.rotation = angle;
        }.bind(this);
        parent.on('rotation.update', rotation_update);
    };
    
    StageSprite.prototype.classes = ['stage.component'];

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
        }
    };

	O.register('addon.sprite', StageSprite);
})();