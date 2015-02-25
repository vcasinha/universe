(function(){
	var Hero = function(){
		
	};
	
	Hero.prototype.mouseDown = function(){
		console.log('mouse down');
	};
	
	O.create(Hero, 'plugin');
	
	O.set('logic.hero', Hero);
})();