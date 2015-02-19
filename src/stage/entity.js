(function(){
    var StageObject = function(parent, user_settings){
        this.position = O.i('vec2', this.settings.position);
		this.anchor = O.i('vec2', this.settings.anchor);
		this.rotation = this.settings.rotation;
		
		this.renderContainer = O.i('engine.layer');
		this.renderContainer.anchor = this.anchor;
		this.renderContainer.position  = this.position;
		this.renderContainer.rotation = this.rotation;
		
		this.parent.renderContainer.addChild(this.renderContainer);
		
        var position_update = function(position){
            //console.log('stage.object position.update', position);
            this.position.x = position.x;
            this.position.y = position.y;
        }.bind(this);

        var rotation_update = function(angle){
            this.rotation = angle;
        }.bind(this);
        
        this.on('stop', function(){
	        this.renderContainer.removeStageReference();
	        this.parent.cancelBroadcast(this);
        });
        
        this.on('position.update', position_update);
        this.on('rotation.update', rotation_update);
    };
    
    StageObject.prototype.classes = ['stage.object'];

    StageObject.prototype.defaultSettings = {
        position:{
            x: 0,
            y: 0
        },
        anchor:{
	        x: 0.5,
	        y: 0.5
        },
        rotation: 0
    };
    
    O.register('stage.entity', StageObject);
})();