(function(Engine){
	var AssetsController = function(ctx){
		this.ctx = ctx;
		this.assets = new OO();
		this.queue = [];
		
		this.ctx.on('assets.loaded', function(){
			
		});
	};
	
	AssetsController.prototype.construct = AssetsController;
	
	AssetsController.prototype.queueAsset = function(name, location){
		var that = this;
		
		var asset = {
			name: name,
			location: location
		};
		
		//Check type and attach decoder
		
		this.queue.push(asset);
		return this;
	};
	
	AssetsController.prototype.loadQueue = function(){
		var that = this;
		var defer = $.Deferred();
		
		this.queue.forEach(function(asset){
			console.log("Loading", asset.name, asset.location);
			
			var ajax_settings = {
				url: asset.location,
				type: "GET",
				dataType: 'binary',
				processData: false,
				success: this.process.bind(that)
			};
			
			$.ajax(ajax_settings);
		});
		
		return defer;
	};
	
	AssetsController.prototype.process = function(data){
		this.queue.splice(this.queue.indexOf(asset), 1);
		
		asset.data = data;
		asset.processed = false;
		
		this.assets.set(asset.name, asset);
		
		console.log("assets.loadQueue.loaded", asset.name, this.queue.length);
		if(this.queue.length == 0){
			this.ctx.trigger('assets.loaded');
		}
	};
	
	Engine.AssetsController = AssetsController;
	
})(Engine);