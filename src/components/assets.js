(function(){
	var AssetManager = function(){
		this.$parent.apply(this, arguments);
		this.loaded = true;
		this.assets = {};
		this.queue = [];
	};
	
	AssetManager.prototype.load = function(assets){
		var audio_context = this.components.audio.context;
		var removeFromQueue = function(asset){
			console.log("assets.removeFromQueue", asset);
			for(var i = 0;i < this.queue.length;i++){
				if(this.queue[i] === asset){
					this.queue.splice(i, 1);
				}
			}
			
			if(this.queue.length === 0){
				this.loaded = true;
			}
		}.bind(this);
		
		for(var i = 0;i < assets.length;i++){
			this.loaded = false;
			var asset = assets[i];

			//console.log('assets.load', asset.type, asset.id, asset.location);
			asset.sequence = asset.type + '.' + asset.id;
			
			this.queue.push(asset);
			switch(asset.type){
				case 'texture':
					console.log('load texture');
					var loader = new PIXI.ImageLoader(asset.location);
					loader.asset = asset;
					loader.onLoaded = function(){
						console.log('load texture', this);
						this.asset.data = this.texture;
						removeFromQueue(this.asset);
					};
					loader.load();
				break;
				case 'audio':
					asset.data = new Howl({
						urls: [asset.location] || asset.urls,
						autoplay: false,
						loop: false,
						volume: 1,
						onload: function(){
							removeFromQueue(this.asset);
						}
					});
					
					asset.data.asset = asset;
/*
					var request = new XMLHttpRequest();
					request.open('GET', asset.location, true);
					request.responseType = 'arraybuffer';
					
					// Decode asynchronously
					request.onload = function() {
						console.log('loaded audio');
						audio_context.decodeAudioData(request.response, function(buffer){
							console.log('decoded audio');
						    asset.data = buffer;
						    removeFromQueue(asset);
						});
					};
					request.send();
*/
				break;
			}
			
			this.assets[asset.sequence] = asset;
		}
	};
	
	AssetManager.prototype.get = function(sequence){
		var asset = this.assets[sequence];

		return (asset ? asset.data : undefined);
	};
	
	AssetManager.prototype.texture = function(id){
		var texture = this.get('texture.' + id);
		return texture ? texture : O('box', 100, 100, 0xff0000);
	};
	
	AssetManager.prototype.onLoad = function(asset){
		console.log('assets.onload', asset.id);
		this.removeFromQueue(asset);
		if(this.queue.length === 0){
			this.loaded = true;
		}
	};
	
	O.create(AssetManager, 'component');
	
	O.set('assets', AssetManager);
})();