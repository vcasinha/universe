(function(){
	var GameObject = function(settings){
		var self = this;
		
		this.position = O('vector2', settings.position);
		this.rotation = 0;
		
		this.$parent.apply(this);
		this.id = this.id || settings.id || parseInt(Math.random() * 99999999).toString(16);
		
		var tick = function(){
			if(self.target){
				var impulse = O('vector2', self.target);
				impulse.subtract(self.sprite.position).divide(self.ctx.physics.scale * 10);
				//console.log('impulse', impulse.x, impulse.y, self.ctx.physics.scale);
				self.body.applyImpulse(impulse);
			}
		};
		
		this.on('connected', function(){
			self.ctx.stage.on('stage.tick', tick);
			
			//console.log('bird.ready');
			if(self.body){
				self.body.connect(self);
			}
			
			if(self.sprite){
				self.renderObject.addChild(self.sprite);
			}
		});
		
		this.on('alone', function(){
			self.ctx.stage.off('stage.tick', tick);
		});
		
		var sprite_settings = O.extend({
			anchor: {
				x: 0.5,
				y: 0.5
			}
		}, settings.sprite);
		
		self.sprite = new PIXI.Sprite();
		self.sprite.interactive = true;
		
		this.drag = false;
		
		self.sprite.mousedown = self.sprite.touchstart = function(data){
			self.target = data.getLocalPosition(this.parent);
			this.data = data;
			this.tint = 0x00ff00;
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
		
		if(sprite_settings.texture){
			self.sprite.setTexture(settings.sprite.texture);
		}
		
		self.sprite.anchor.set(sprite_settings.anchor.x, sprite_settings.anchor.y);
		
		if(typeof settings.body === 'object'){
			settings.body.position = self.position;
			self.body = O('physics.body.box2d', settings.body);
			if(self.sprite){
				self.body.on('rigidbody.update', function(position, rotation){
					self.sprite.position.set(position.x, position.y);
					self.sprite.rotation = rotation;
				});
			}
		}
	};
	
	O.create(GameObject, 'stage.object');
	
	O.set('game.object', GameObject);
})();