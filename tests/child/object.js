(function(){
	var GameObject = function(settings){
		this.debug = false;
		
		this.id = this.id || settings.id || 'gameObject';
		//console.log('object.construct', this.id);
		this.$parent.apply(this, arguments);
		this.tags = [].concat(this.tags, this.settings.tags);
		
		
		this.transform = O('plugin.transform', this, this.settings.transform);
		
		//initialize sprite
		if(settings.sprite){
			this.sprite = O('plugin.sprite', this, this.settings.sprite);
			this.plugins.push(this.sprite);
		}
		
		//Initialize physics
		if(settings.physics){
			this.body = O('plugin.body', this, this.settings.physics);
			this.plugins.push(this.body);
		}
		
		//Initialize physics
		if(settings.joint){
			this.joint = O('plugin.joint', this, this.settings.joint);
			this.plugins.push(this.joint);
		}
		
		if(settings.logic){
			this.logic = O('plugin.logic', this, this.settings.logic);
			this.plugins.push(this.logic);
		}
		
		//Initialize physics
		if(settings.input){
			this.input = O('plugin.input', this, this.settings.input);
			this.plugins.push(this.input);
		}
	};
	
	GameObject.prototype.distanceJoint = function(other){
		var joint = this.components.physics.createDistanceJoint(this.body.body, other.body.body);
		this.body.joints.push(joint);
		other.body.joints.push(joint);
	};
	
	O.create(GameObject, 'entity');
	O.set('object', GameObject);
})();