(function(Engine){
    var AudioManager = function(ctx){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    };

    var prototype = {
        load: function(asset){
	        var settings = {
		        onload: function(){
			        this.set(asset.name, sound);
	                console.log("audio.load.decode", asset.name, asset);
	                this.ctx.trigger('audio.loaded.' + asset.name, [asset]);
	
				}.bind(this)
	        };
	        
	        settings.urls = (typeof asset.location === 'string') ? [asset.location] : asset.location;
			var sound = new Howl(settings);
			//console.log("HOWL", sound);
        },
    };

    AudioManager = Oo.createClass(AudioManager, prototype, [OO, Engine.Object]);
    
    //console.log("AudioManager", AudioManager, prototype);

    Engine.AudioManager = AudioManager;

})(Engine);