(function(){
	var LogicComponent = function(){
		this.logics = [];
	};
	
	LogicComponent.prototype.update = function(dt){
		for(var i = 0;i < this.logics.length;i++){
			var logic = this.logics[i];
			logic.exec('update');
		}
	};
	
	LogicComponent.prototype.addLogic = function(logic){
		if(this.logics.indexOf(logic) >= 0){
			return this;
		}
		
		this.logics.push(logic);
		
		return this;
	};
	
	LogicComponent.prototype.removeLogic = function(logic){
		for(var i = 0;i < this.logics.length;i++){
			if(this.logics[i] === logic){
				this.logics.splice(i, 1);
			}
		}
		
		return this;
	};
	
	O.create(LogicComponent, 'component');
	O.set('component.logic', LogicComponent);
})();