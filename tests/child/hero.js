(function(){
	O.set('hero.logic', );
	
	O.set('hero', {
		id: 'hero',
		transform: {
			position: {
				x: 300, 
				y: 50
			},
			rotation: 0,
	        anchor: {
		        x: 0.5,
		        y: 0.5
	        },
		},
		physics: {
			body: {
	            shape:'circle', 
	            radius: 32, 
	            friction: 0.5, 
	            density: 3,
	            restitution: 0.8
	        },
		},
        sprite: {
	        texture: 'ball'
        },
        input: true,
        logic: {
        context: {
	        onGround: false
        },
        methods: {
	        mouseDown: function(i){
		        //this.body.applyImpulse({x: 7.5 - Math.random() * 15, y: -Math.random() * 10});
		        console.log('mouse down', i.originalEvent.clientX, i.originalEvent.clientY);
		        var target = O('vector2', {x: i.originalEvent.clientX, y: i.originalEvent.clientY});
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
	        mouseUp: function(i){
		        this.mouseJoint._stop();
	        },
	        contactForce: function(other, force){
				
		        //this.sprite.sprite.tint = 0xff0000;
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
			        this.contacts = false;
		        }
	        },
	        update: function(){
		       	if(this.input.down('S')){
			       	console.log(this.contacts);
		       	}
		       	
		       	//if contacts
		        if(this.onGround && this.input.down('W')){
			        this.entity.body.applyImpulse({x:0, y: -2});
		        }
		        
		        if(this.input.down('A')){
			        this.jump = true;
			        console.log('press');
			        this.entity.body.applyImpulse({x: -0.5, y: 0});
		        }
		        
		        if(this.input.down('D')){
			        this.jump = false;
			        //console.log('depress');
			        this.entity.body.applyImpulse({x: 0.5, y: 0});
		        }
	        }
        }
    }
	});
})();