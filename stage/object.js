(function(){
	
	function uuid(){
		return parseInt(new Date().getTime()).toString(16);
	}
	
	var StageObject = function(stage, settings){
		this.stage = stage;
		this.ctx = stage.ctx;
		
		var default_settings = {
			id: uuid(),
			x: 0,
			y: 0,
			anchor: {
				x: 0.5, 
				y:0.5
			}
		};
		
		this.settings = O.extend({}, default_settings, settings);
		
		//console.log('stage.object.construct', this.id, this.settings, this.ctx);
    };
    
    StageObject.prototype.classes = ['o.events'];
    
    StageObject.prototype.update = function(dt){
	    this.trigger('update', dt);
	    
    };
    
    O.register('stage.object', StageObject);
})();