(function(){
	var Input = function(settings){
		this.debug = false;
		this.click = false;
		this.id = this.id || settings.id || 'gameObject';
		//console.log('object.construct', settings);
		this.$parent.apply(this, arguments);
		this.sensor = this.entity.sprite.sprite;
		
		if(this.entity.logic){
			var logic = this.entity.logic;
			this.sensor.interactive = true;
			this.sensor.mousedown = this.sensor.touchstart = function(interaction){
				logic.exec('mouseDown', interaction);
			};
			
			this.sensor.mouseup = this.sensor.mouseupoutside = function(interaction){
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