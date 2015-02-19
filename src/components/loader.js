(function(Engine){
	var Loader = function(){
		this.queue = [];
	};
	
	Loader.prototype.classes = ['engine.component'];
	
	Loader.prototype.queueList = function(list){
		list.forEach(function(asset){
			this.queueAsset(asset);
		}.bind(this));
	};

	Loader.prototype.queueAsset = function(asset){		
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
	
	Loader.prototype.load = function(list, callback){
		this.queueList(list);
		this.processQueue();
		if(typeof callback == 'function'){
			this.ctx.once('assets.loaded', callback);
		}
		return this;
	};
	
	Loader.prototype.processQueue = function(){
		console.log(this.queue);
		
		for(var i = 0;i<this.queue.length;i++){
			var asset = this.queue[i];
			asset.loaded = false;
			console.log("loader.load", asset.name, asset.location);
			
			this.ctx.once(asset.type + '.loaded.' + asset.name, function(asset){
				console.log("loader.load.asset.loaded", asset.name, asset);
				
				asset.loaded = true;
				var loaded = 0;
				
				for(var i = 0;i < this.queue.length;i++){
					var asset = this.queue[i];
					if(asset.loaded === true){
						
						loaded++;;
					}
				}
				
				if(loaded === this.queue.length){
					console.log('assets.loaded', this.queue);
					this.ctx.trigger('assets.loaded');
				}
			}.bind(this));
			
			switch(asset.type){
				case 'json':
					this.handleJSON(asset);
				break;
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
		}

		return this;
	};
	
	Loader.prototype.handlePIXI = function(asset){
		var loaderByType = {
			'image': PIXI.ImageLoader,
			'json': PIXI.JsonLoader,
			'atlas': PIXI.AtlasLoader,
			'anim': PIXI.SpineLoader,
			'font': PIXI.BitmapFontLoader
		};
		//console.log("loader.handlePIXI.load", asset.name);
		var Constructor = loaderByType[asset.type];
		if(!Constructor)
			throw new Error(asset.type + ' is an unsupported file type');

		var loader = new Constructor(asset.location, false);
		loader.on('loaded', function(){
			this.ctx.renderer.assets.set(asset.name, asset);
			//console.log("loader.handlePIXI.loaded", asset.name, asset);
			this.ctx.trigger(asset.type + '.loaded.' + asset.name, asset);
		}.bind(this));

		loader.load();
	};

	Loader.prototype.handleAudio = function(asset){
		//console.log("loader.handleAudio", asset.name);
		this.ctx.audio.load(asset);
	};

	Loader.prototype.handleJSON = function(asset){
		$.get(asset.location, function(data){
			console.log("DATA Loaded", data);
			window.jsondata = data;
			O.i('parser.tmx', data);
			
			this.ctx.trigger(asset.type + '.loaded.' + asset.name, asset);
		}.bind(this));
		//console.log("loader.handleAudio", asset.name);
		this.ctx.audio.load(asset);
	};

	Loader.prototype.removeFromQueue = function(asset){
		var ix = this.queue.indexOf(asset);
		this.queue.splice(ix, 1);
		return this;
	};
	
	O.register('component.loader', Loader);
	
})();