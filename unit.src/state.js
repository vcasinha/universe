(function(){
	var UnitState = function(unit){
		if(typeof unit !== 'object'){
			console.error('unit.state.construct Invalid unit argument');
		}
		
		this.unit = unit;
	};
})();