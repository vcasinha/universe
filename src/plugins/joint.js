(function(){	
	var Joint = function(){
		this.id = this.id || 'joint.plugin';
		this.$parent.apply(this, arguments);
		
		//console.log("sprite.construct", this.entity.transform);
	};
	
	Joint.prototype.start = function(){
		this.physics = this.components.physics;
		
		var joint = O.extend({}, this.settings);
		
		if(this.settings.from === 'ground'){
			joint.from = this.physics.getGroundBody();
		}
		else{
			joint.from = this.settings.from.body.body || undefined;
		}
	
		if(this.settings.to === undefined || this.settings.to === 'ground'){
			joint.to = this.physics.getGroundBody();
		}
		else{
			joint.to = this.settings.to.body.body;
		}
		
		console.log('joint.start', joint);
		
		this.type = joint.type;
		
		this.joint = this.physics.createJoint(joint);
		this.joint.SetUserData(this.entity);
		this.physics.addJoint(this);
	};
	
	Joint.prototype.setTarget = function(target){
		var position = O('vector2', target);
		position.divide(this.physics.scale);
		this.joint.SetTarget(position);
	};
	
/*
	Joint.prototype.update = function(){
		if(this.type === 'mouse'){
			this.setTarget(currentMousePos);
		}
	};
*/
	
	Joint.prototype.stop = function(){
		this.components.physics.removeJoint(this.joint);
	};
	
	O.create(Joint, 'plugin');
	O.set('plugin.joint', Joint);
})();