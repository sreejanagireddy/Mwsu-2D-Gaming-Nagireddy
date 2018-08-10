var preload = {
	preload:function(){
		console.log("preload.js");
		game.stage.backgroundColor = game.globals.bg_color;

		var loading_border = this.add.image(game.width/2,game.height/2,'assets/images/loading_border')
		loading_border.anchor.setTo(.5,.5)
		var loading = this.add.sprite(game.width/2,game.height/2,'assets/images/loading')
		loading.anchor.setTo(.5,.5)
		this.load.setPreloadSprite(loading)
		
		
		// game entities/world
		game.load.image('pause', 'assets/images/pause.png');
		
		game.load.image('space', 'assets/images/space.jpg');
		game.load.image('bullet', 'assets/images/bullet99.png');
		game.load.image('starfield', 'assets/images/back3.png');
		game.load.image('target', 'assets/images/target.png');
	//	game.load.image('star', 'assets/images/star2.png');
		//game.load.image('earth', 'assets/images/planet.png');

		// Load all my new obstacles
		for(i=0;i<game.globals.obstacle_icons.length;i++){
			name = game.globals.obstacle_icons[i];
			if(name == 'rrr')
			{
				this.w = 128;
				this.h = 128;
			}
			if(name == 'asteroid')
			{
				this.w = 64;
				this.h = 64;
			}
			if(name == 'ttt')
			{
				this.w = 72;
				this.h = 72
			}
			game.load.image('icon-'+name, 'assets/images/icon-'+name+'.png');
			game.load.spritesheet('icon-'+name, 'assets/sprites/icon-'+name+'.png',this.w,this.h);
			
		}

		game.load.spritesheet('kaboom', 'assets/sprites/Explosion.png', 256, 128);
		game.load.spritesheet('kaboom1', 'assets/sprites/explosion2.png', 96,96);

		//game.load.spritesheet('earth', 'assets/sprites/Earth.png', 213,160,13);
		
		game.load.spritesheet('earth', 'assets/sprites/icon-rrr.png',128,128);
		game.load.spritesheet('earth1', 'assets/sprites/icon-asteroid.png',64,64);
		game.load.spritesheet('ttt', 'assets/sprites/icon-ttt.png',72,72);
		
		game.load.atlas('ufoAtlas','assets/sprites/spritesheet.png','assets/sprites/sprites.json');
		//game.load.spritesheet('ppppp', 'assets/images/icon-rrr.png',128,128 );
		// audio
		game.load.audio('bg_spin', 'assets/sounds/spin_bg_music.mp3')
		game.load.audio('bg_edm', 'assets/sounds/edm_bg_music.mp3')
		game.load.audio('score', 'assets/sounds/score.wav')
		game.load.audio('kill', 'assets/sounds/Ouch.ogg')
		game.load.audio('music', 'assets/sounds/abstractionRapidAcrobatics.wav')

		// font
		game.load.bitmapFont('fontUsed', 'assets/font/ganonwhite/font.png', 'assets/font/ganonwhite/font.xml');

	},
	
	create:function(){
		
		game.state.start('mainMenu');
	}
}