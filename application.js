(function(){
	var Application = function(settings){
		
	};
	
	Application.prototype.init = function(settings){
		this.engine = new Engine(settings);
		this.engine.init();
		
		if(typeof settings.states !== 'object'){
			throw("States are undefined");
		}
		
		settings.states.forEach(function(state){
			this.engine.addState(state, 'sm.' + state);
		}.bind(this));
		
		this.ctx = this.engine.ctx;
		
		var stage_element = $('#stage');
		stage_element.append(this.engine.getElement());
		stage_element.dblclick(this.engine.handleFullScreen());
		
		this.engine.handleResize(stage_element.width(),stage_element.height());
		
		$(window).on('resize', function(){
			this.engine.handleResize(stage_element.width(),stage_element.height());
		}.bind(this));
	};
	
	Application.prototype.start = function(){
		this.engine.start();
	};
	
	Application.prototype.stop = function(){
		this.engine.stop();
	};
	
	Application.prototype.togglePause = function(){
		//Pause audio too
		this.engine.paused = !this.engine.paused;
	};
	
	O.register('engine.application', Application);
})();