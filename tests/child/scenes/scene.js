(function(){
	var Scene = function(){
		this.id = 'scene';
		this.$parent.apply(this);
		//console.log('scene.construct', this.settings);
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
		
		for(var i = 0;i < 20;i++){
			var settings = {
				id: 'ball#' + i,
				transform: {
					position: {
						x: Math.random() * 800, 
						y: Math.random() * 400
					},
					scale: {
						x: 0.5,
						y: 0.5
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
			            radius: 16, 
			            friction: 0.5, 
			            density: 3,
			            restitution: 0.8
			        },
				},
		        sprite: {
			        texture: 'ball'
		        },
			};
			
			var child = O('object', settings);
			this.addChild(child);
			
/*
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
*/
			
			previous = child;
		}
		
		var settings = {
			id: 'hero',
			transform: {
				position: {
					x: 50, 
					y: 350
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
		            friction: 1, 
		            density: 3,
		            restitution: 0.1
		        },
			},
	        sprite: {
		        texture: 'ball'
	        },
	        input: true,
	        logic: O.get('controller.ball')
		};
		
		var child = O('object', settings);
		this.addChild(child);
	};
	
	O.create(Scene, 'entity');
	O.set('scene.main', Scene);
})();