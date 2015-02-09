(function(Engine){
	var App = function(){
		var world = new Engine();
		
		var stage_element = $('#stage');
		var settings = {
			background: 0xffffff,
			width: 800,
			height: 600
		};
		
		///console.log("World", world);
		world.init(settings);
		
		stage_element.dblclick(world.ctx.display.requestFullScreen.bind(world.ctx.display));
		$(window).on('resize', function(){
			world.ctx.display.resize(stage_element.width(),stage_element.height());
		});
		
		stage_element.append(world.ctx.display.renderer.view);
		world.addStateMachine('main', Engine.stateMachines.get('main'));
		world.setStateMachine('main');

		world.ctx.sm.start('boot');
		this.ctx = world.ctx;
	};
	
	window.App = App;
})(Engine);