//variables==========================================================
var Enemy = function(x, y) {
    this.sprite = new Sprite("bat.png");
    this.sprite.buildAnimation(2, 1, 88, 94, 0.3, [0,1]);
    this.sprite.setAnimationOffset(0, -35, -40);

    this.position = new Vector2();
    this.position.set(x, y);
    this.velocity = new Vector2();

    this.moveRight = true;
    this.pause = 0;

};


//update-----------------------------------------


//draw player------------------------------------
Enemy.prototype.draw = function(worldOffsetX){

    this.sprite.draw(this.sprite, this.position.x - worldOffsetX, this.position.y);
    
}


//update=============================================================
Enemy.prototype.update = function(deltaTime){

        this.sprite.update(deltaTime);
    
    this.sprite.update(dt);
    if(this.pause > 0){
        this.pause -= dt;
    }
    else{
        var ddx = 0;
        // acceleration
        var tx = pixelToTile(this.position.x);
        var ty = pixelToTile(this.position.y);
        var nx = (this.position.x)%TILE;        
        // true if enemy overlaps right
        var ny = (this.position.y)%TILE;         
        // true if enemy overlaps below
        var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
        var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
        var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
        var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
        if(this.moveRight){
            if(celldiag && !cellright) {
                ddx = ddx + ENEMY_ACCEL;    
                // enemy wants to go right
            }
            else {
                this.velocity.x = 0;
                this.moveRight = false;
                this.pause = 0.5;
            }
        }
        if(!this.moveRight){
            if(celldown && !cell) {
                ddx = ddx - ENEMY_ACCEL;   
                // enemy wants to go left
            }
            else {
                this.velocity.x = 0;
                this.moveRight = true;
                this.pause = 0.5;
            }
        }
        this.position.x = Math.floor(this.position.x  + (dt * this.velocity.x));
        this.velocity.x = bound(this.velocity.x + (dt * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
    }
    

  
    // new position calculations-----------------
    this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
    this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
    this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
    
    if ((wasleft && (this.velocity.x > 0)) || (wasright && (this.velocity.x < 0))){
        this.velocity.x = 0;
    }

    
    
//collision detection----------------------------
    var tx = pixelToTile(this.position.x);
    var ty = pixelToTile(this.position.y);
    var nx = (this.position.x)%TILE;
    var ny = (this.position.y)%TILE;
    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
    var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
    var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
    var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
    
    if (this.velocity.y > 0) {
        if ((celldown && !cell) || (celldiag && !cellright && nx)) {
            this.position.y = tileToPixel(ty);
            this.velocity.y = 0;
            this.falling = false;
            this.jumping = false;
            ny = 0;
        }
    }
    
    else if (this.velocity.y < 0) {
        if ((cell && !celldown) || (cellright && !celldiag && nx)) {
            this.position.y = tileToPixel(ty + 1);
            this.velocity.y = 0;
            cell = celldown;
            cellright = celldiag;
            ny = 0;
        }
    }
        if (this.velocity.x > 0) {
            if ((cellright && !cell) || (celldiag && !celldown && ny)) {
                this.position.x = tileToPixel(tx);
                this.velocity.x = 0;
            }
        }
        else if (this.velocity.x < 0) {
        if ((cell && !cellright) || (celldown && !celldiag && ny)) {
            this.position.x = tileToPixel(tx + 1);
            this.velocity.x = 0;
        }
    }
}