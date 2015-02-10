(function(Engine){
	var Loader = function(ctx){
		this.queue = [];

		this.loadersByType = {
			'image': PIXI.ImageLoader,
			'json': PIXI.JsonLoader,
			'atlas': PIXI.AtlasLoader,
			'anim': PIXI.SpineLoader,
			'font': PIXI.BitmapFontLoader
		};
	};
	
	var prototype = {};
	
	prototype.queueList = function(list){
		list.forEach(function(asset){
			this.queueAsset(asset);
		}.bind(this));
	};

	prototype.queueAsset = function(asset){		
		for(var i in this.queue){
			if(this.queue[i].name == asset.name){
				//console.warn("assets.queueAsset.replace", asset.name, asset);
				this.queue[i] = asset;
				return this;
			}
		}

		//Force asset type to be lower case
		asset.type = asset.type.toLowerCase();
		
		//console.log("loader.queueAsset", asset.name, asset.type);
		
		this.queue.push(asset);
		return this;
	};
	
	prototype.load = function(list, callback){
		this.queueList(list);
		this.processQueue();
		if(typeof callback == 'function'){
			this.ctx.once('assets.loaded', callback);
		}
		return this;
	};
	
	prototype.processQueue = function(){
		this.queue.forEach(function(asset){
			//console.log("loader.load", asset.name, asset.location);
			
			this.ctx.once(asset.type + '.loaded.' + asset.name, function(asset){
				//console.log("loader.load.asset.loaded", asset.name, asset);
				this.removeFromQueue(asset);
				//console.log("Queue", this.queue);
				if(this.queue.length === 0){
					
					this.ctx.trigger('assets.loaded');
				}
			}.bind(this));
			
			switch(asset.type){
				case 'image':
					this.handlePIXI(asset);
				break;
				case 'audio':
					this.handleAudio(asset);
				break;
				default: 
					throw "loader.load.invalid asset type " + asset.type;
				break;
			}
		}.bind(this));

		return this;
	};
	
	prototype.handlePIXI = function(asset){
		//console.log("loader.handlePIXI.load", asset.name);
		var Constructor = this.loadersByType[asset.type];
		if(!Constructor)
			throw new Error(asset.type + ' is an unsupported file type');

		var that = this;
		var loader = new Constructor(asset.location, false);
		loader.on('loaded', function(){
			this.ctx.display.set(asset.name, asset);
			//console.log("loader.handlePIXI.loaded", asset.name, asset);
			that.ctx.trigger(asset.type + '.loaded.' + asset.name, [asset]);
		}.bind(this));

		loader.load();
	};

	prototype.handleAudio = function(asset){
		//console.log("loader.handleAudio", asset.name);
		this.ctx.audio.load(asset);
	};

	prototype.removeFromQueue = function(asset){
		this.queue.splice(this.queue.indexOf(asset), 1);
		return this;
	};
	
	O.register('engine.loader', Loader, prototype, ['engine.object']);
	
})();