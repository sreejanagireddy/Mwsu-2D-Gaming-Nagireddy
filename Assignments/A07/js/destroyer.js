var destroyer = {
	create: function () {
		console.log("play.js");

		//Client.sendNewPlayerRequest();

		this.player = new Ufo(game);
		this.rplayer = new Ufo(game);

		w = game.width // Game width and height for convenience
		h = game.height
		frame_counter = 0 // variable to help with the creation of obstacles

		//used for points right now
		this.item_destroyed = false;
		this.player_destroyed = false;
		this.vvvvar = false;
		

		this.rplayer_destroyed = false;

		//  The scrolling starfield background
		this.starfield = game.add.tileSprite(0, 0, w, h, 'starfield');
		//this.earth = this.game.add.group();
		//var max=1000;
        //var min=20;
		//var x=Math.random() * (max - min) + min;
        //var y=Math.random() * (max - min) + min;

		//this.earth = game.add.sprite(x, y, 'earth');

		//this.earth.animations.add('spin', 0, 48);
		//this.earth.animations.play('spin', 10, true);
		//this.earth.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4], 10, true);

            //  And play them
		//this.earth.callAll('animations.play', 'animations', 'spin');
	
		// Score sound
		this.sound.score = game.add.audio('score')
		this.sound.score.volume = .4
		
		this.count = 0;

		// Death sound
		this.sound.kill = game.add.audio('kill')

		// Music
		this.music = game.add.audio('music')
		this.music.play('', 0, 0.5, true)

		this.physics.startSystem(Phaser.Physics.ARCADE)

		// Obstacles (little icons of food)
		this.obstacles = game.add.group()

		//  An explosion pool that gets attached to each icon
		this.explosions = game.add.group();
		this.explosions1 = game.add.group();
		this.explosions.createMultiple(10, 'kaboom');
		this.explosions.createMultiple(14, 'kaboom1');
		this.explosions.forEach(this.setupObstacles, this);
		
		// Player
		//calls the create method of the ufo object
		this.player.create(80, 60, 0.75, 0.75); 
		this.rplayer.create(650, 60, 0.75, 0.75); 
		//for health bar
		
		this.player.max_health = 100;
		this.player.health = 100;
		this.rplayer.max_health = 100;
		this.rplayer.health = 100;
		
		this.healthBarConfig = this.createHealthBar();
		this.createHealthBar();
		this.renderHealthBar();
		
		this.healthBarConfig1 = this.createHealthBar1();
		this.createHealthBar1();
		this.renderHealthBar1();
		
		//this.player.ship.immovable = false; 
		//this.player.body.moves = false;

		// Score label
		this.bmpText = game.add.bitmapText(game.width / 2, 100, 'fontUsed', '', 150);
		this.bmpText.anchor.setTo(.5, .5)
		this.bmpText.scale.setTo(.3, .3)

		///// Tracking keyboard inputs /////////////

		// Fire the ufo big laser when the 'X' key is pressed
		laserFire = this.input.keyboard.addKey(Phaser.Keyboard.X);
		laserFire.onDown.add(this.player.startLaser, this.player);
		this.fortarget(game)

		// Assigns arrow keys for movement
		this.rplayer.assignMovementKeys(38, 40, 37, 39);

		// Assigns W,S,A,D keys for movement
		this.player.assignMovementKeys(Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D);
		//this.rplayer.assignMovementKeys(Phaser.Keyboard.up, Phaser.Keyboard.down, Phaser.Keyboard.left, Phaser.Keyboard.right);
		this.rplayer.assignFireKeys(Phaser.KeyCode.SPACEBAR);
		this.player.assignFireKeys(Phaser.KeyCode.SHIFT);

		this.pauseAndUnpause(game)
		
		
	},

	createHealthBar : function () {
		console.log("health");
		return {
			
			x: this.player.x,
			y: this.player.y,
			xoffset: 40,
			yoffset: 40,
			width: 50,
			height: 7,
			percent: 100
		};
	},

	createHealthBar1 : function () {
		console.log("health");
		return {
			
			x1: this.rplayer.x,
			y1: this.rplayer.y,
			xoffset1: 670,
			yoffset1: 50,
			width1: 50,
			height1: 7,
			percent1: 100
		};
	},

	

	renderHealthBar:function () {
		
		console.log('render');
		var width = this.healthBarConfig.width;
		var height = this.healthBarConfig.height;
		var xoff = this.healthBarConfig.xoffset;
		var yoff = this.healthBarConfig.yoffset;
		

		var hurt_ratio = 1 - (this.player.health / this.player.max_health);
		console.log("this.player.health  "+this.player.health);
	
		if (typeof (this.healthbar) === 'object') {
			this.healthbar.destroy()
		}
		if(this.player.health == 0){
			this.boom(this.player.ship);

		}
		this.healthbar = game.add.graphics(this.player.x, this.player.y);
		console.log("hurt_ratio  "+hurt_ratio );
		if (hurt_ratio < 1) {
			//Draw green bar
			this.healthbar.lineStyle(2, 0x000000, 1);
			this.healthbar.beginFill(0x00FF00, 1);
			this.healthbar.drawRect(0 + xoff, 0 + yoff, width, height);
			this.healthbar.endFill();
	
			//Draw red bar
			this.healthbar.beginFill(0xFF0000, 1);
			this.healthbar.drawRect(0 + xoff, 0 + yoff, width * hurt_ratio, height);
			this.healthbar.endFill();
			
		} else {
			//Draw full red bar (this is only so bar will update position with player)
			this.healthbar.lineStyle(2, 0x000000, 1);
			this.healthbar.beginFill(0xFF0000, 1);
			this.healthbar.drawRect(0 + xoff, 0 + yoff, width, height);
			this.healthbar.endFill();
			
		}
	
	
	},

	renderHealthBar1:function () {
		console.log('render1');
		var width1 = this.healthBarConfig1.width1;
		var height1 = this.healthBarConfig1.height1;
		var xoff1 = this.healthBarConfig1.xoffset1;
		var yoff1 = this.healthBarConfig1.yoffset1;
		
		var hurt_ratio = 1 - (this.rplayer.health / this.rplayer.max_health);
		
	
		if (typeof (this.healthbar1) === 'object') {
			this.healthbar1.destroy()
		}
		this.healthbar1= game.add.graphics(this.rplayer.x1, this.rplayer.y1);
		console.log("hurt_ratio  "+hurt_ratio );
		if(this.rplayer.health == 0){
			this.rboom(this.rplayer.ship);
		}
		if (hurt_ratio < 1) {
			//Draw green bar
			this.healthbar1.lineStyle(2, 0x000000, 1);
			this.healthbar1.beginFill(0x00FF00, 1);
			this.healthbar1.drawRect(0 + xoff1, 0 + yoff1, width1, height1);
			this.healthbar1.endFill();
	
			//Draw red bar
			this.healthbar1.beginFill(0xFF0000, 1);
			this.healthbar1.drawRect(0 + xoff1, 0 + yoff1, width1 * hurt_ratio, height1);
			this.healthbar1.endFill();
		} else {
			//Draw full red bar (this is only so bar will update position with player)
			this.healthbar1.lineStyle(2, 0x000000, 1);
			this.healthbar1.beginFill(0xFF0000, 1);
			this.healthbar1.drawRect(0 + xoff1, 0 + yoff1, width1, height1);
			this.healthbar1.endFill();
		}
	
	
	},

	update: function () {

		//if (game.num_other_players > 0) {
		

			// Place score on game screen
			this.bmpText.text = game.globals.score

			//this.count = 0;	
			// Move background to look like space is moving
			this.starfield.tilePosition.y -= 2;

			// Check for overlap between game ship and obstacles
			game.physics.arcade.overlap(this.player.ship, this.obstacles, this.killPlayer, null, this)
			game.physics.arcade.overlap(this.rplayer.ship, this.obstacles, this.killrPlayer, null, this)
			
			
			//if(this.player.ship.y < this.rplayer.ship.y){

				//console.log("this.player.ship.y "+ this.player.ship.y)
			//console.log("this.rplayer.ship.y "+ this.rplayer.ship.y)
			//game.physics.arcade.overlap(this.player.ship, this.rplayer.ship, this.rightmove, null, this);
				//this.count++;
			//}else if(this.count == 0){
			//game.physics.arcade.overlap(this.player.ship, this.rplayer.ship, this.leftmove, null, this);
			//}
			
			game.physics.arcade.overlap(this.player.ship, this.rplayer.ship, this.bump, null, this);
			
			
			// Check for overlap between bullets and obstacles
			game.physics.arcade.overlap(this.player.bullets, this.obstacles, this.destroyItem, null, this);
			
			game.physics.arcade.overlap(this.rplayer.bullets, this.obstacles, this.destroyItem, null, this);
			
			
			if (this.item_destroyed) {
				// Check to see if we score any points
				// needs changed since we added bullets
				game.globals.score += this.scorePoint();
				this.item_destroyed = false;
			}

			spawn_rate = 100 - game.globals.score; // how fast to add new obstacles to screen (smaller value = more obstacles)
			obstacle_speed = game.globals.score * 1.5 + 200; // how fast should each obstacle move

			// Spawn rate continuously shrinks so stop it at 5
			if (spawn_rate < 5) {
				spawn_rate = 5;
			}

			// Spawn obstacles
			if (frame_counter % spawn_rate == 0) {
				//console.log(spawn_rate);
				//console.log(obstacle_speed);
				this.spawnObstacle(game.rnd.integerInRange(32, game.width - 32), game.height, speed = obstacle_speed, 0.5, 0.5)
			}

			this.player.move();
			this.rplayer.move();
			
			
			
			frame_counter++;
		//}
	},

	/**
	 * Spawn New Player
	 */
	spawnNewPlayer: function (player) {
		game.players.push(new Ufo(game));
		game.players[game.players.length-1].create(player.x,player.y,0.75,0.75);
	},

	/**
	 * spawn a new obstacle
	 * 
	 * @param x : x coord
	 * @param y : y coord
	 * @param speed : speed to move across game board
	 */
	spawnObstacle: function (x, y, speed, x_scale, y_scale) {
		// randomly choose an icon from an array of icon names
		var choice = game.rnd.integerInRange(0, game.globals.obstacle_icons.length - 1);
		console.log("choice "+ choice);
		var name = game.globals.obstacle_icons[choice];
		if(choice == 6){
			
			
			var obstacle = this.obstacles.create(x, y, 'earth')
			
			obstacle.animations.add('spin', 0, 4);
			obstacle.animations.play('spin', 10, true);
		
		}
		else if(choice == 8){
			
			
			var obstacle = this.obstacles.create(x, y, 'ttt')
			
			obstacle.animations.add('spin', 0, 4);
			obstacle.animations.play('spin', 10, true);
		
		}
		else if( choice == 7){
		
			var obstacle = this.obstacles.create(x, y,  'earth1')
		
			obstacle.animations.add('spin', 0, 18);
			obstacle.animations.play('spin', 10, true);
			
		}
    	else{
		var obstacle = this.obstacles.create(x, y, 'icon-' + name)
		}
		//create the obstacle with its randomly chosen name
		
		game.debug.body(obstacle);

		game.physics.enable(obstacle, Phaser.Physics.ARCADE)

		obstacle.enableBody = true
		obstacle.body.colliderWorldBounds = true
		obstacle.body.immovable = true
		obstacle.anchor.setTo(.5, .5)
		obstacle.scale.setTo(x_scale, y_scale)
		obstacle.body.setSize(obstacle.width + 20, obstacle.height - 20);
		obstacle.body.velocity.y = -speed

		obstacle.checkWorldBounds = true;

		// Kill obstacle/enemy if vertically out of bounds
		obstacle.events.onOutOfBounds.add(this.killObstacle, this);

		obstacle.outOfBoundsKill = true;
	
	},
	/**
	 * removes an obstacle from its group
	 */
	killObstacle: function (obstacle) {
		this.obstacles.remove(obstacle);
	},

	/**
	 * Adds an explosion animation to each obstacle when created
	 */
	setupObstacles: function (obstacle) {
		obstacle.anchor.x = 0.5;
		obstacle.anchor.y = 0.5;
		obstacle.animations.add('kaboom');
		obstacle.animations.add('kaboom1');
	},

	/**
	 * Determines score. Needs changed
	 */
	scorePoint: function () {
		// silly but wanted a function in case points started
		// to change based on logic.
		return 1;
	},

	
	/**
	 * Kills player. Things commented out for debugging.
	 */
	killPlayer: function (player) {
		console.log("---")
		this.player.health -= 1;
		console.log("this.player.health1 "+ this.player.health );
    	
		this.renderHealthBar();
		  
		
	},

	rightmove: function(){
		console.log("right")
		//if(this.player.ship.y > this.rplayer.ship.y){
			this.killPlayer(this.player.ship); 
			this.rplayer.ship.immovable = true; 
			this.rplayer.ship.body.moves = false;
			this.player.ship.body.collideWorldBounds = true;
			this.player.ship.body.velocity.x = -80;


	},
	leftmove: function(){
		console.log("left ")
		//if(this.player.ship.y > this.rplayer.ship.y){
			this.killrPlayer(this.rplayer.ship); 
			this.player.ship.immovable = true; 
			this.player.ship.body.moves = false;
			this.rplayer.ship.body.collideWorldBounds = true;
			this.rplayer.ship.body.velocity.x = -80;
	},
	//leftmove: function(){
//		console.log("left")
//		this.killPlayer(this.player.ship); 
//		this.player.ship.body.collideWorldBounds = true;
//		this.player.ship.body.velocity.x = -80;

//	},
	
	bump: function(){
		
		console.log("bumppp")
		var bounce = 60;
		console.log("bounce" +bounce)
		if(this.player.ship.y > this.rplayer.ship.y){

			bounce --;
			console.log("bounce1" +bounce)
			this.killPlayer(this.player.ship); 
			this.rplayer.ship.immovable = true; 
			this.rplayer.ship.body.moves = false;
			this.player.ship.body.collideWorldBounds = true;
			this.player.ship.body.velocity.x = -80;
			if(bounce == 0){
				this.player.ship.body.velocity.x = 0;
			}

		}
		 
		 this.player.ship.body.collideWorldBounds = true;
		// this.player.ship.body.bounce.set(0.5);
		 this.player.ship.body.allowGravity = true;
		// //this.player.ship.body.gravity.y = 50;
		 this.player.ship.body.velocity.x = -60;
		// //this.player.ship.body.velocity.x = -50;

		 bounce --;
		// console.log("bounce  "+ bounce)
		
		 if(bounce == 0){
			this.player.ship.body.bounce.set(0);
			this.player.ship.body.velocity.x = 0
		 	this.player.ship.body.allowGravity = false;
		 }
		 this.rplayer.ship.body.collideWorldBounds = true;
		 this.rplayer.ship.body.bounce.set(0.3);
		 this.rplayer.ship.body.allowGravity = true;
		// //this.rplayer.ship.body.gravity.y = 70;
		 this.rplayer.ship.body.velocity.x = 60;
		 if(bounce == 0){
			this.rplayer.ship.body.bounce.set(0);
			this.rplayer.ship.body.velocity.x = 0
		 	this.rplayer.ship.body.allowGravity = false;
		 }
		
		
	},
	killrPlayer: function (rplayer) {

		this.rplayer.health -= 1;
		this.renderHealthBar1();
		  
//		game.state.start('gameOver');
	},
	/**
	 * Source: https://phaser.io/examples/v2/games/invaders
	 * 
	 * Collision handler for a bullet and obstacle
	 */
	destroyItem: function (bullet, obstacle) {
		bullet.kill();
		obstacle.kill();
		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(obstacle.body.x, obstacle.body.y);
		explosion.play('kaboom', 30, false, true);
		this.item_destroyed = true;
	},

	boom: function (player){
	
		this.sound.kill.play('', 0, 0.5, false)
		
		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(this.player.ship.x, this.player.ship.y);
		explosion.play('kaboom', 30, false, true);
		this.player_destroyed = true;
		this.player.ship.kill();
		if(this.player.health == 0 && this.rplayer.health == 0 ){
			var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    		//  The Text is positioned at 0, 100
			text = game.add.text(200, 250, "GAME OVER", style);
			game.paused = true;
		}
		
	},
	rboom: function (rplayer){
	
		this.sound.kill.play('', 0, 0.5, false)
		
		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(this.rplayer.ship.x, this.rplayer.ship.y);
		explosion.play('kaboom', 30, false, true);
		this.rplayer_destroyed = true;
		this.rplayer.ship.kill();
		if(this.player.health == 0 && this.rplayer.health == 0 ){
			console.log("gameover");
			this.bmpText = game.add.bitmapText(game.width / 2, 100, 'fontUsed', 'gameOver', 150);
			this.bmpText.anchor.setTo(.5, .5)
			this.bmpText.scale.setTo(.3, .3)
		}
	},

	/**
	 * Tap on touchscreen or click with mouse
	 * not used for this game
	 */
	onDown: function (pointer) {
		//console.log(pointer);
	},

	fortarget : function(game) {
		console.log("target");
		var tar_button = game.add.sprite( game.width - 70, 400, 'target')
		var tar_button1 = game.add.sprite(40, 440, 'target')
		tar_button.anchor.setTo(.5, .5)
		tar_button.inputEnabled = true
		tar_button.events.onInputUp.add(
			function(){
				if (!game.paused){
					console.log("fggjk")
					this.rplayer.fireBullets();
					this.rplayer.nnmove();
				}
			},this)
		tar_button1.anchor.setTo(.5, .5)
		tar_button1.inputEnabled = true
		tar_button1.events.onInputUp.add(
			function(){
				if (!game.paused){
						
					this.player.fireBullets();
					this.player.nnmove();
				}
			},this)
			
			
				
	},

	/**
	 * This method lets a user pause the game by pushing the pause button in
	 * the top right of the screen. 
	 */
	pauseAndUnpause: function (game) {
		var pause_button = game.add.sprite(game.width - 40, 40, 'pause')
		pause_button.anchor.setTo(.5, .5)
		pause_button.inputEnabled = true
		// pause:
		pause_button.events.onInputUp.add(
			function () {
				if (!game.paused) {
					game.paused = true
				}
				pause_watermark = game.add.sprite(game.width / 2, game.height / 2, 'pause')
				pause_watermark.anchor.setTo(.5, .5)
				pause_watermark.alpha = .1
			}, this)
		// Unpause:
		game.input.onDown.add(
			function () {
				if (game.paused) {
					game.paused = false
					pause_watermark.destroy()
				}
			}, self)
	}
}