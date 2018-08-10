/**
Name:Revathi Chikoti, Sreeja Nagireddy
Course: Mobile Gaming
Assignment: Program_6
References: https://phaser.io/examples 
*/

/**
 * 
 * @param {object} game | phaser game object
 * @param {string} map_key | cache name
 * @param {string} map_path | path to json for tilemap
 * @param {string} mini_map_path | path to mini map image
 */
var Level = function (game, map_key,map_path,mini_map_path,collision_index) {
    this.game = game;
    this.map_key = map_key;
    this.map_path = map_path;
    this.mini_map_path = mini_map_path;
    this.mini_map_key = this.map_key+'_mini';
    this.map_collision_index = collision_index;
    this.coins = 0;
    this.score = 0;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// PRELOAD ////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.preload = function () {

    this.portalOverFlag = false;
    this.transport = false;

    this.mapjson = this.game.global.levels[this.map_key];
    
    this.mh = new MapHelper(game, this.map_key, this.map_path,this.map_collision_index);

    this.mh.preload();

    game.load.image(this.mini_map_key, this.mini_map_path);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// CREATE /////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.create = function () {

    initial_x = game.camera.height / 2;
   initial_y = game.camera.height / 2;
    //initial_x = 1000;
    //initial_y = 1001;
     this.f = 0;
    this.player = new Player(game, initial_x,initial_y , 'knight_atlas');

    initial_x1= game.camera.width / 2 + 1000;
    initial_y1=  game.camera.height / 2 + 600;
    if(game.global.current_level == 'level_03')
    {
        this.player = new Player(game, initial_x1, initial_y1, 'knight_atlas');
    }

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.map = this.mh.create();
    this.coins = this.game.add.group();
    this.score = this.game.add.group();
    
    for (var i = 0; i < 50; i++)
    {
        var max=3400;
        var min=20;
        var x=Math.random() * (max - min) + min;
        var y=Math.random() * (max - min) + min;
        if(this.mh.getTileProperties1('layer_collision',x,y)==null){
            
            var coin = game.add.sprite(x, y, 'coin');
            this.game.physics.arcade.enable(coin);
            this.coins.add(coin)
            this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);

            //  And play them
            this.coins.callAll('animations.play', 'animations', 'spin');
        
            coin.scale.setTo(1);
        }
    }
   

    this.mh.addCollisionLayer('layer_collision');

    this.mh.resizeWorld('layer_0_floor');

    this.hud = new Hud(game, 100, 20);
    this.hud.addTitle();
    this.hud.trackValue(this.player.alias, "health");
    
    this.hud.trackValue(this.player.alias, "coins");

    this.mini_map = new MiniMap(game, 200, 200, 4096, 4096, this.mini_map_key, 'upper_right');

    game.camera.follow(this.player.alias);
    
    var x,y,x1,y1;
    if(game.global.current_level == 'level_01' || game.global.current_level == 'level_02' || game.global.current_level == 'level_03' ||game.global.current_level == 'level_04' || game.global.current_level == 'level_05'){
       
        x = game.camera.width / 2 + 100; 
        y = game.camera.height / 2 + 100;
        x1 = 2825 
        y1 = 2642; 
        x2 = 457; 
        y2 = 1483;
        x3 = 506;
        y3 = 3873;
        x4 = 1962;
        y4 = 3781;

    }
   
    this.portal = game.add.sprite(x, y, 'red_portal');
    this.portal.animations.add('rotate', Phaser.Animation.generateFrameNames('red_portal', 1, 3), 60, true);
    this.portal.animations.play('rotate');
    this.portal.anchor.setTo(0.5);
    game.physics.enable([this.player.alias, this.portal], Phaser.Physics.ARCADE);
        
    this.portal1 = game.add.sprite(x1, y1, 'red_portal');
    this.portal1.animations.add('rotate', Phaser.Animation.generateFrameNames('red_portal', 1, 3), 60, true);
    this.portal1.animations.play('rotate');
    this.portal1.anchor.setTo(0.5);
    game.physics.enable([this.player.alias, this.portal1], Phaser.Physics.ARCADE);

    this.portal2 = game.add.sprite(x2, y2, 'red_portal');
    this.portal2.animations.add('rotate', Phaser.Animation.generateFrameNames('red_portal', 1, 3), 60, true);
    this.portal2.animations.play('rotate');
    this.portal2.anchor.setTo(0.5);
    game.physics.enable([this.player.alias, this.portal2], Phaser.Physics.ARCADE);

    this.portal3 = game.add.sprite(x3, y3, 'red_portal');
    this.portal3.animations.add('rotate', Phaser.Animation.generateFrameNames('red_portal', 1, 3), 60, true);
    this.portal3.animations.play('rotate');
    this.portal3.anchor.setTo(0.5);
    game.physics.enable([this.player.alias, this.portal3], Phaser.Physics.ARCADE);

    this.portal4 = game.add.sprite(x4, y4, 'red_portal');
    this.portal4.animations.add('rotate', Phaser.Animation.generateFrameNames('red_portal', 1, 3), 60, true);
    this.portal4.animations.play('rotate');
    this.portal4.anchor.setTo(0.5);
    game.physics.enable([this.player.alias, this.portal4], Phaser.Physics.ARCADE);
    if(game.global.current_level == 'level_05'){
        console.log("esdtyui");
        x4 =  game.camera.height / 2 + 250; 
        y4 = game.camera.height / 2 + 300;
        game.add.sprite(x4, y4, 'finish');
    }
    // Makes sure player sprite is in front of the map.
    this.player.bringToFront();

    // Spawn 7 ghosts when level loads
    this.ghosts = new Ghosts(game, 1, this.player.x, this.player.y);
   
    // Track the ghosts on the mini map
    for (i = 0; i < this.ghosts.ghosts.length; i++) {
        this.mini_map.trackEnemy(this.ghosts.ghosts[i]);
    }

    console.log(this.player.alias)

}
Level.prototype.collectCoin = function (player, coin) {
   
    coin.kill();
    game.global.score = game.global.score+5;
    this.player.alias.coins = game.global.score;
   
}
Level.prototype.dec_health = function ()
{   
    if(this.player.alias.health == 0)
    {
        this.player.checkForDeath();
    }
    else{
    this.player.alias.health -= 1;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE /////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.update = function () {

    // keeps hud in upper left of the screen 
    this.hud.displayHud()

    // keeps map updated in top right of the screen
    this.mini_map.updatePlayerLocation(this.player.alias);

    // lets you control your player
    this.player.move();
    
    this.ghosts.moveGhosts(this.player.alias);
    for(i = 0; i < this.ghosts.ghosts.length; i++){
        game.physics.arcade.collide(this.ghosts.ghosts[i], this.player.alias, this.dec_health, null, this);

    }

    game.physics.arcade.collide( this.coins,this.player.alias, this.collectCoin, null, this);

        
    if(this.player.alias.x>=700 && this.player.alias.x<=701){
        this.ghosts.spawnGhosts(1, this.player.alias.x, this.player);
    }

    // checks if player intersects with a portal
    // hard coded destination. Needs improved
    if (this.player.intersectsWith(this.portal)) {
        if(game.global.current_level == 'level_01'){
            game.global.current_level = 'level_02';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_02')
        {
            game.global.current_level = 'level_03';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_03')
        {   
            
            game.global.current_level = 'level_02';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_04')
        {
            game.global.current_level = 'level_05';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_05')
        {
            
            gameOver.create();
        }
       
       
       
    }
    
    if (this.player.intersectsWith(this.portal1)) {
        if(game.global.current_level == 'level_01'){
            game.global.current_level = 'level_02';
            console.log(game.global.current_level +"here");
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_02')
        {
            game.global.current_level = 'level_03';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_03')
        {
            game.global.current_level = 'level_04';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_04')
        {   
            game.global.current_level = 'level_05';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_05')
        {   
            game.global.current_level = 'level_04';
           // game.state.start( game.global.current_level);
        }
       
    }
    
    if (this.player.intersectsWith(this.portal2)) {
        if(game.global.current_level == 'level_01'){
            game.global.current_level = 'level_02';
            console.log(game.global.current_level +"here");
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_02')
        {   
            this.player.initial_x = 2000;
            this.player.initial_y = 750;
            game.global.current_level = 'level_01';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_03')
        {
            game.global.current_level = 'level_04';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_04')
        {
            game.global.current_level = 'level_03';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_05')
        {
            gameOver.create();
        }

       
    }
    if (this.player.intersectsWith(this.portal3)) {
        if(game.global.current_level == 'level_01'){
            game.global.current_level = 'level_02';
            console.log(game.global.current_level +"here");
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_03')
        {
            game.global.current_level = 'level_04';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
        else if(game.global.current_level == 'level_04')
        {
            game.global.current_level = 'level_05';
            console.log(game.global.current_level);
            game.state.start( game.global.current_level);
        }
       
        else if(game.global.current_level == 'level_05')
        {
            
            gameOver.create();
        }
       
       
    }

    if (this.player.intersectsWith(this.portal4)) {
        if(game.global.current_level == 'level_01'){
            game.global.current_level = 'level_02';
            console.log(game.global.current_level +"here");
            game.state.start( game.global.current_level);
        }
       
    }
    

    // Necessary to make sure we always check player colliding with objects
    game.physics.arcade.collide(this.player.alias, this.mh.collisionLayer);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// RENDER /////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.render = function () {
    //game.debug.bodyInfo(this.player, 16, 24);
    // Instructions:
    //game.debug.text("And here is our new level!", game.width / 2, game.height - 10);
}