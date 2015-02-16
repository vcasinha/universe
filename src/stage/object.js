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
        
		this.position = O.instance('vec2');

        var position_update = function(position){
            //console.log('stage.object position.update', position);
            this.position.x = position.x;
            this.position.y = position.y;
        }.bind(this);

        var rotation_update = function(angle){
            this.rotation = angle;
        }.bind(this);

		var update = function(){
            this.trigger('addon.update');
		}.bind(this);

        this.on('position.update', position_update);
        this.on('rotation.update', rotation_update);
		this.ctx.on('update', update, 'stop');
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