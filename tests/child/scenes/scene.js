(function(){
	var Scene = function(){
		this.id = 'scene';
		this.$parent.apply(this);
		//console.log('scene.construct', this.settings);
		
		this.counter = 0;
		this.timer = 0;
	};
	
	Scene.prototype.start = function(){
		//this.components.audio.queueMusic('music');
		//this.components.audio.nextMusic();
		console.log('scene.start');
		//Bottom
		this.addChild(O('object', {
			id: 'floor',
			transform: {
				position: {
					x: 400, 
					y: 400
				},
				rotation: 0,
			},
			physics: {
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: 800,
		            height: 10
		        }
			}
		}));
		
		this.addChild(O('object', {
			id: 'leftWall',
			transform: {
				position: {
					x: 0, 
					y: -100
				}
			},
			physics: {
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: 10,
		            height: 1000
		        }
			}
		}));
		
		this.addChild(O('object', {
			id: 'rightWall',
			transform: {
				position: {
					x: 800, 
					y: -100
				}
			},
			physics: {
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: 10,
		            height: 1000
		        }
			}
		}));
		
		//Support to attach balls
		this.addChild(O('object', {
			id: 'support',
			transform: {
				position: {
					x: 400, 
					y: 0
				}
			},
			physics: {
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: 10,
		            height: 10
		        }
			}
		}));
		
		var previous = this.getByID('support');
		
		for(var i = 0;i < 6;i++){
			var settings = {
				id: 'ball#' + i,
				transform: {
					position: {
						x: 400 + i * 30, 
						y: 64 + i * 64
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
			        texture: this.components.assets.get('texture.ball')
		        },
		        input: true
			};
			
			var child = O('object', settings);
			this.addChild(child);
			
			this.addChild(O('object', {
				id: 'joint' + i,
				transform: {},
				joint: {
					type: 'distance',
					from: previous,
					to: child,
					length: 62
				}
			}));
			
			previous = child;
		}
		
		var settings = {
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
		        texture: this.components.assets.texture('ball')
	        },
	        input: true,
	        logic: {
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
			        endContact: function(){
				        //this.sprite.sprite.tint = 0xffffff;
			        },
			        update: function(){
				        if(!this.jump && this.input.down('W')){
					        this.jump = true;
					        console.log('press');
					        //this.entity.body.applyImpulse(0.1);
				        }
				        
				        if(this.jump && !this.input.down('W')){
					        this.jump = false;
					        console.log('depress');
					        //this.entity.body.applyImpulse(0.1);
				        }
			        }
		        }
	        }
		};
		
		var child = O('object', settings);
		this.addChild(child);
	};
	
	Scene.prototype.update = function(dt){

/*
		this.timer += dt;
		if(this.timer > 0.2){
			this.timer = 0;
			this.counter++;
			
			var settings = {
				transform: {
					position: {
						x: 395 + Math.random(), 
						y: -50
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
			            restitution: 0.2
			        },
				},
		        sprite: {
			        texture: PIXI.Texture.fromImage('../assets/ball1.png')
		        }
			};
			
			var child = O('object', settings);
			this.addChild(child);

			if(this.counter > 50){
				var child = this.children[4];
				this.removeChild(child);
			}
		}
*/

	};
	
	O.create(Scene, 'entity');
	O.set('scene.main', Scene);
})();