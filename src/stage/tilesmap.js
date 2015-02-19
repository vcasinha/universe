(function(){
	var TilesMap = function(){
		this.tiles = [];
		console.log('tilesmap');
		this.settings.area = this.settings.width * this.settings.height;
		
		for(var c = 0;c < this.settings.area;c++){
			this.tiles[c] = undefined;
		}

	};
	
	TilesMap.prototype.classes = ['stage.entity'];
	
	TilesMap.prototype.setTile = function(position, new_tile){
		var index = position.x + position.y * this.settings.width;
		if(index > this.tiles.length){
			throw('Out of bounds');
		}
		
		var current_tile = this.tiles[index];
		this.remove(current_tile);
		
		this.tiles[index] = new_tile;
		this.add(new_tile);
		
		return this;
	};
	
	TilesMap.prototype.unsetTile = function(position, new_tile){
		var index = position.x + position.y * this.settings.width;
		if(index > this.tiles.length){
			throw('Out of bounds');
		}
		
		var current_tile = this.tiles[index];
		this.remove(current_tile);
		this.tiles[index] = undefined;
		
		return this;
	};
	
	TilesMap.prototype.defaultSettings = {
		width: 10,
		height: 10,
	};
	
	O.register('stage.tilesmap', TilesMap);
})();