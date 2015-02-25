(function(){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	var AudioManager = function(){
		this.$parent.apply(this, arguments);
		this.playing = {};
		this.context = new AudioContext();
		this.musicQueue = [];
		this.currentMusic = -1;
	};
	
	AudioManager.prototype.queueMusic = function(music_id){
		this.musicQueue.push(music_id);
		return this;
	};
	
	AudioManager.prototype.nextMusic = function(){
		if(this.musicQueue.length === 0){
			return false;
		}
		
		this.currentMusic++;
		if(this.currentMusic > this.musicQueue.length){
			this.currentMusic = 0;
		}
		
		this.musicPlay(this.musicQueue[this.currentMusic]);
		return this;
	};
	
	AudioManager.prototype.musicPlay = function(id){
		this.musicStop();
		console.log('loading', id);
		var sound = this.components.assets.get('audio.' + id);
		sound.play();
		
		this.playing['__music__'] = sound;
	};

	AudioManager.prototype.musicPause = function(id){
		if(this.playing['__music__']){
			this.playing['__music__'].pause();
		}
	};
	
	AudioManager.prototype.musicStop = function(id){
		if(this.playing['__music__']){
			this.playing['__music__'].stop();
		}
	};

	AudioManager.prototype.play = function(id, time){
		var sound = this.components.assets.get('audio.' + id);
		sound.play();
		
		this.playing[id] = sound;
		
		return sound;
	};
	
	AudioManager.prototype.update = function(){
		for(var i = 0;i < this.playing.length;i++){
			var audio = this.playing[i];
		}
	};
	
	O.create(AudioManager, 'component');
	O.set('component.audio', AudioManager);
})();