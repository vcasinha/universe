(function(O, Engine){
	var Application = function(settings){
		
	};
	
	var prototype = {
		init: function(settings){
			this.universe = new Engine();
			
			///console.log("World", world);
			this.universe.init(settings);
			this.ctx = this.universe.ctx;
			
			var stage_element = $('#stage');
			stage_element.dblclick(this.universe.ctx.display.requestFullScreen.bind(this.universe.ctx.display));
			stage_element.append(this.universe.ctx.display.renderer.view);
			$(window).on('resize', function(){
				this.universe.ctx.display.resize(stage_element.width(),stage_element.height());
			});
			
			this.universe.addStateMachine('main');
			this.universe.setStateMachine('main');
	
			this.universe.ctx.sm.start('boot');
		}
	};
	
	O.set('engine.application', O.createClass(Application, prototype));
})(O, Engine);