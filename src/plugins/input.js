(function(){
	var Input = function(settings){
		this.debug = false;
		this.click = false;
		this.id = this.id || 'input.plugin';
		//console.log('object.construct', settings);
		this.$parent.apply(this, arguments);
		
	};
	
	Input.prototype.start = function(){
		var sensor = this.sensor = this.entity.sprite.sprite;
		var logic = this.entity.logic;
		
		console.log('input.start', this.id, logic);
		if(logic){
			sensor.interactive = true;
			sensor.mousedown = sensor.touchstart = function(interaction){
				logic.exec('mouseDown', interaction);
			};
			
			sensor.mousemove = function(interaction){
				logic.exec('mouseMove', interaction);
			};
			
			sensor.mouseup = sensor.mouseupoutside = sensor.touchend = sensor.touchendoutside = function(interaction){
				logic.exec('mouseUp', interaction);
			};
		}
		else{
			console.warn('Input but no logic');
		}
	};
	
	O.create(Input, 'plugin');
	O.set('plugin.input', Input);
})();