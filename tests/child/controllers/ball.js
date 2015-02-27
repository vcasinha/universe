O.set('controller.ball', {
    context: {
        onGround: false
    },
    methods: {
        mouseDown: function(i){
	        //this.body.applyImpulse({x: 7.5 - Math.random() * 15, y: -Math.random() * 10});
	        //console.log('mouse down', this.entity.id, i.originalEvent.clientX, i.originalEvent.clientY);
	        var target = O('vector2', {
		        x: i.originalEvent.clientX, 
		        y: i.originalEvent.clientY
		    });
		    
	        this.mouseJoint = O('object', {
				id: 'joint' + i,
				transform: {},
				joint: {
					type: 'mouse',
					from: this.entity,
					target: target
				},
				logic: {
					methods: {
						update: function(){
							
						}
					}
				}
			});
			
			this.entity.addChild(this.mouseJoint);
        },
        mouseMove: function(i){
	        var target = O('vector2', {
		        x: i.originalEvent.clientX, 
		        y: i.originalEvent.clientY
		    });
		    
		    if(this.mouseJoint){
			    this.mouseJoint.joint.setTarget(target);
		    }
        },
        mouseUp: function(i){
        	//console.log('mouse up', this.entity.id);
        	if(this.mouseJoint){
	        	console.log('Destroy mouseJoint');
		        this.mouseJoint.destroy();
		        delete this.mouseJoint;
        	}
        },
        contactForce: function(other, force){
			
	        //this.sprite.sprite.tint = force * 1000;
	        if(force > 50){
		        var volume = force / 1000;
		        var px = (this.transform.position.x - 400) / 800;
		        var py = (this.transform.position.y - 200) / 400;
		        var pz = 0;
		        
		        //console.log('contact', force, px, py, pz);
		        
		        this.components.audio.play('ball')
		        	.volume(volume.limit())
		        	.pos3d(px, py, pz);
	        }
	        
        },
        beginContact: function(other){
	        if(other.id === 'floor'){
		        this.onGround = true;
	        }
        },
        endContact: function(other){
	        if(other.id === 'floor'){
		        this.onGround = false;
	        }
        },
        update: function(){
        	//console.log('logic update');
	       	if(this.input.down('S')){
		       	console.log(this.entity.transform);
	       	}
	       	
	        if(this.onGround && this.input.down('W')){
		        this.entity.body.applyImpulse({x:0, y: -2});
	        }
	        
	        if(this.input.down('A')){
		        this.jump = true;
		        this.entity.body.applyImpulse({x: -0.3, y: 0});
	        }
	        
	        if(this.input.down('D')){
		        this.jump = false;
		        //console.log('depress');
		        this.entity.body.applyImpulse({x: 0.3, y: 0});
	        }
        }
    }
});