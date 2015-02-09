(function(Engine){
    var AudioManager = function(ctx){
        this.ctx = ctx;
        this.assets = new OO();
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    };

    var prototype = {
        load: function(asset){
            var ajax_settings = {
                url: asset.location,
                type: 'GET',
                dataType: 'binary',
                processData: false,
                success: function(audio_data){
	                console.log("audio.load.success", asset.name, audio_data);
	                var that = this;
					var fileReader = new FileReader();
					fileReader.onload = function() {
						console.log("ARRAYBUFFER", this, arguments);
					    asset.data = this.result;
					    that.decodeAudio(asset);
					};
					fileReader.readAsArrayBuffer(audio_data);
	                
                }.bind(this),
                error: function(xhr, error, message){
                    console.error("failed", asset.name, message);
                }.bind(this)
            };
            
            $.ajax(ajax_settings);
        },
        decodeAudio: function(asset){
	        var decodeSuccess = function(buffer) {
		        this.assets.set(asset.name, new AudioAsset(this.audioContext, buffer));
                console.log("audio.load.decode", asset.name, asset);
                this.ctx.trigger('audio.loaded.' + asset.name, [asset]);
			}.bind(this);
	        
	        var decodeError = function(){
                console.error("audio.load.decode.fail", asset.name, asset);
                //this.ctx.trigger('audio.loaded.' + asset.name, [asset]);
	        }.bind(this);
	        
	        console.log("audio.decodeAudio", asset.name, asset);
	        this.audioContext.decodeAudioData(asset.data, decodeSuccess, decodeError);
        }
    };

    AudioManager = Oo.createClass(AudioManager, prototype);
    
    console.log("AudioManager", AudioManager, prototype);

    Engine.AudioManager = AudioManager;

	var AudioAsset = function(audioContext, audioBuffer){
		var source;
		
		this.play = function() {
			this.stop();
			
			source = audioContext.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(audioContext.destination);
			source.start(0);
		};
		
		this.stop = function(){
			if(source){
				source.stop();
				source = null;
			}
		};
	}

})(Engine);