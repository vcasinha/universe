(function(){
	var Parser = function(data){
		
		data.layers.forEach(function(layer, i){
			console.log("layer", layer);
			switch(layer.type){
				case 'tilelayer':
					this.parseTileLayer(layer, data.tilesets[i]);
				break;
				case 'objectgroup':
					this.parseObjectLayer(layer);
				break;
			}
		}.bind(this));
	};
	
	Parser.prototype.classes = [];
	
	Parser.prototype.parseTileLayer = function(layer, settings){
		console.log("tmx.tilelayer", layer, settings);
	};
	
	Parser.prototype.parseObjectLayer = function(layer){
		layer.objects.forEach(function(object){
			console.log('tmx.objectlayer', object);
		}.bind(this));
	};
	
	O.register('parser.tmx', Parser);
})();