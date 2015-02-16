(function(){
	var StagePhysics = function(parent, user_settings, stage){
        var default_settings = {
            scale: 100
        };

        this.settings = O.extend({}, default_settings, user_settings);
        this.physics = stage.ctx.physics;
        this.parent = parent;

        this.position = parent.position.clone();
        this.angle = parent.rotation;
        
        //this.position.divide(this.settings.scale);
        console.log('physics.construct.position', this.position);
        if(this.settings.body){
            this.attachBody(this.settings.body);
        }

        var position_update = function(position){
            if(this.body && this.body.setTransform && position != this.position){
                console.log('physics.position.update', position);
                //position.divide(this.settings.scale);
                //this.position.set(position);
                //this.body.setTransform(position.x / this.settings.scale, position.y / this.settings.scale, this.angle);
            }
        }.bind(this);
        parent.on('position.update', position_update);

        var addon_update = function(){
            if(this.body){
                var body_position = this.body.GetPosition();
                var position = O.i('vec2', body_position);
                position.multiply(this.settings.scale);
                
                //console.log('position.update', this.position.x, this.position.y);
                if(this.position.compare(body_position) === false){
                    this.position.set(position);
                    this.parent.trigger('position.update', this.position);
                }

                var angle = this.body.GetAngle();
                if(this.angle != angle){
                    this.angle = angle;
                    this.parent.trigger('rotation.update', angle);
                }
            }

        }.bind(this);
        this.physics.on('physics.update', addon_update);
    };
    
    StagePhysics.prototype.classes = ['engine.component'];

	StagePhysics.prototype.attachBody = function(settings){
		settings.position = this.position;
		this.body = this.physics.createBody(settings).body;
        console.log("physics.attachBody", this.body);
	};
    
	O.register('addon.physics', StagePhysics);
})();