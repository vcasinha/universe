(function(){
	"use strict";
	
	var GameObject = function(settings){
		this.type = this.type || 'game.object';
		this.id = this.id || settings.id || 'clone';
		this.$parent.apply(this);
		
		var self = this;
		
		this.position = O('vector2', settings.position);
		this.rotation = 0;
		
		
		this.id = this.id || settings.id || parseInt(Math.random() * 99999999).toString(16);
		
		var tick = function(){
			if(self.target){
				//console.log("Target");
				var impulse = O('vector2', self.target);
				impulse.subtract(self.sprite.position)
					.divide(self.ctx.physics.scale)
					.multiply(self.body.body.GetMass());

				self.body.applyImpulse(impulse);
			}
		};
		
		this.on('connected', function(){
			this.stage.on('stage.tick', tick);
			if(self.body){
				//console.log('Connect body');
				self.body.connect(self);
			}
			//console.log('bird.ready');
		});
		
		this.on('disconnected', function(){
			this.stage.off('stage.tick', tick);
		});
		
		//Initialize sprite
		var sprite_settings = O.extend({
			anchor: {
				x: 0.5,
				y: 0.5
			}
		}, settings.sprite);
		
		self.sprite = new PIXI.Sprite();
		self.sprite.interactive = true;
		self.sprite.position.set(self.position.x, self.position.y);
		if(sprite_settings.texture){
			self.sprite.setTexture(settings.sprite.texture);
		}
		
		self.sprite.anchor.set(sprite_settings.anchor.x, sprite_settings.anchor.y);
		self.renderObject.addChild(self.sprite);
		
		//Physics
		if(typeof settings.body === 'object'){
			settings.body.position = self.position;
			self.body = O('physics.body.box2d', settings.body);
			self.body.on('rigidbody.update', function(position, rotation){
				self.sprite.position.set(position.x, position.y);
				self.sprite.rotation = rotation;
			});
		}
		
		//Interaction
		self.sprite.mousedown = self.sprite.touchstart = function(data){
			self.target = data.getLocalPosition(this.parent);
			this.data = data;
			this.tint = 0x00ff00;
			//console.log("touch", self.id, data, self);
		};
		
		self.sprite.mouseup = self.sprite.touchend = self.sprite.mouseupoutside = this.touchendoutside = function(){
			this.data = null;
			self.target = false;
			this.tint = 0xffffff;
		};
		
		self.sprite.mousemove = self.sprite.touchmove = function(i){
			if(self.target){
				self.target = this.data.getLocalPosition(this.parent);
			}
		}
	};
	
	O.create(GameObject, 'stage.object');
	
	O.set('game.object', GameObject);
})();