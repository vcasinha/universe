(function(PIXI){
	var RendererPixi = function(ctx, settings){
		console.log('renderer.construct', this.settings);

		var update = function(dt){
			//rateLimit.message('renderer.update', 1/dt);
			this.renderer.render(this.stage);
		}.bind(this);
		
		var init = function(){
			// create an new instance of a pixi stage
			this.stage = new PIXI.Stage(settings.background || 0x000000, settings.interactive);
	
			// create a renderer instance.
			this.renderer = PIXI.autoDetectRenderer(settings.width, settings.height, settings.renderer);
		}.bind(this);
		
		var stop = function(){
			ctx.off('update', update);
		}.bind(this);
		
		ctx.once('init', init);
		ctx.on('update', update);
		ctx.once('stop', stop);
		
		this.assets = new O();
	};

	RendererPixi.prototype.classes = ['engine.component'];
	
	RendererPixi.prototype.getElement = function(){
		return this.renderer.view;
	};
	
	RendererPixi.prototype.resize = function(width, height){
	    this.width = width;
	    this.height = height;
	    
	    if(this.renderer){
		    this.renderer.resize(this.width, this.height);
		}
	};
	
	RendererPixi.prototype.createLayer = function(){
		return new PIXI.DisplayObjectContainer();
	};
	
	RendererPixi.prototype.createGroup = function(){
		return new PIXI.DisplayObjectContainer();
	};
	
	RendererPixi.prototype.getTexture = function(name){
		var asset = this.assets.get(name);
		if(asset === undefined){
			throw("Asset not loaded " + name);
		}
		
		//console.log("renderer.pixi.texture", name, asset);
		return PIXI.Texture.fromImage(asset.location);
	};
	
	RendererPixi.prototype.getAnimationTextures = function(settings){
		var width = settings.width;
		var height = settings.height;
		
		var textures = [];
		//console.log("renderer.getAnimationTextures", settings);
		var frame_count = settings.frameCount || 0;
		
		var texture = this.getTexture(settings.name);
		var current_frame = 0;
		for(var y = settings.y || 0;y < texture.height;y += height){
			for(var x = settings.x || 0;x < texture.width;x += width){
				if(x + width > texture.width || y + height > texture.width){
					continue;
				}
				
				current_frame++;
				
				var frame_rect = new PIXI.Rectangle(x, y, width, height);
				var frame_crop = frame_rect.clone();
				var frame_trim = null;
				
				var frame = new PIXI.Texture(texture, frame_rect, frame_crop, frame_trim);
				textures.push(frame);
				//console.log(frame_count, current_frame);
				if(frame_count && frame_count == current_frame){
					break;
				}
			}
		}
		
		return textures;
	}
	
	RendererPixi.prototype.getAnimation = function(settings){
		var textures = this.getAnimationTextures(settings);
		var animation = new PIXI.MovieClip(textures);
		
		return animation;
	};
	
	RendererPixi.prototype.getSprite = function(name){
		var texture;
		//console.log("renderer.pixi.sprite", name);
		if(name !== undefined){
			texture = this.getTexture(name);
		}
		
		return new PIXI.Sprite(texture);
	}
	
	RendererPixi.prototype.requestFullScreen = function(){
		//console.log("renderer.pixi.requestFullScreen", this);
		if(this.renderer.view.webkitRequestFullScreen) {
			this.renderer.view.webkitRequestFullScreen();
		}
		else{
			this.renderer.view.mozRequestFullScreen();
		}
	};
	
	RendererPixi.prototype.add = function(child){
		//console.log("renderer.pixi.add", child);
		return this.stage.addChild(child);
	};
	
	RendererPixi.prototype.remove = function(child){
		//console.log("renderer.pixi.add", child);
		return this.stage.removeChild(child);
	};
	
	O.register('component.renderer.pixi', RendererPixi);
})(PIXI);