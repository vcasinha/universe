(function(){
	var StagePhysics = function(parent, user_settings, stage){
        var default_settings = {
            scale: 100
        };

        this.settings = O.extend({}, default_settings, user_settings);
        this.physics = stage.ctx.physics;
        this.parent = parent;

        this.position = parent.position.clone();
        this.position.divide(this.settings.scale);
        this.angle = parent.rotation;
        
        
        console.log('physics.construct.position', this.position.x, this.position.y);
        
       
        if(this.settings.body){
            this.settings.body.position = this.position;
            this.attachBody(this.settings.body);
            this.body.SetPosition(this.position);
        }

        var position_update = function(position){
            if(this.body && position != this.position){
                position.divide(this.settings.scale);
                rateLimit.message('physics.position.update', position.x, position.y, this.body.SetPosition);
                this.position.set(position);
                this.body.SetPosition(this.position);
            }
        }.bind(this);
        parent.on('position.update', position_update);

        var physics_update = function(){
            if(this.body){
                var body_position = this.body.GetPosition();
                var position = O.i('vec2', body_position);
                position.multiply(this.settings.scale);
                rateLimit.message('physics.update', position.x, position.y);
                //console.log('position.update', this.position.x, this.position.y);
                if(this.position.compare(position) === false){
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
        this.physics.on('physics.update', physics_update);
    };
    
    StagePhysics.prototype.classes = ['engine.component'];

	StagePhysics.prototype.attachBody = function(settings){
		settings.position = this.position;
		this.body = this.physics.createBody(settings).body;
	};
    
	O.register('addon.physics', StagePhysics);
})();