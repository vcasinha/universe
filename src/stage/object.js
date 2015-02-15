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
		
		var update = function(){
			this.update();
		}.bind(this);
		
		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
		//console.log('stage.object.construct', this.id, this.settings, this.ctx);
    };
    
    StageObject.prototype.classes = ['o.events'];
    
    StageObject.prototype.update = function(dt){
	    //this.trigger('update', dt);
    };
    
    StageObject.prototype.getID = function(){
	    return this.settings.id;
    }
    
    O.register('stage.object', StageObject);
})();