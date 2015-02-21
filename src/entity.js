(function(){
	var Unit = O.get('universe.unit');
	
	var Entity = function(){
		//console.log('Entity.constructor', this.$parent);
		Unit.apply(this);
		
		this.on('connect', function(unit){
			if(this.ctx === undefined){
				if(unit.ctx){
					this.ctx = unit.ctx;
				}
				else {
					this.ctx = this.findByID('context');
				}
				
				this.trigger('ready');
			}
		});
		
		this.on('disconnect', function(){
			if(this.connections.length === 0){
				this.ctx = undefined;
			}
		});
	};
	
	O.create(Entity, Unit);
	
	O.set('universe.entity', Entity);
})();