(function(Engine){
	var Data = function(){
		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
	};

	Data.prototype.classes = ['engine.component'];
	
	O.register('component.data', Data);

})();