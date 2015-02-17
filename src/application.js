(function(){
	var Application = function(settings){
	};
	
	Application.prototype.init = function(settings){
		this.engine = O.instance('engine', settings);
		this.engine.init();
		
		this.ctx = this.engine.ctx;
		
		var stage_element = $('#stage');
		stage_element.append(this.engine.getElement());
		
		var fs = function(){
			this.engine.handleFullScreen();
			stage_element.off('click', fs);
		}.bind(this);
		
		stage_element.click(fs);
		
		this.engine.handleResize(stage_element.width(),stage_element.height());
		
		$(window).on('resize', function(){
			this.engine.handleResize(stage_element.width(),stage_element.height());
		}.bind(this));
		
	};
	
    Application.prototype.step = function(){
    	console.log('application.step');
        this.ctx.trigger('engine.update', 1/60, true);
    };

	Application.prototype.start = function(){
		this.engine.start();
	};
	
	Application.prototype.stop = function(){
		this.engine.stop();
	};
	
	Application.prototype.togglePause = function(){
		//Pause audio too
		this.engine.isRunning = !this.engine.isRunning;
		console.log('application.togglePause', this.engine.isRunning);
	};
	
	O.register('engine.application', Application);
})();