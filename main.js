var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();


//variables||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//drawmap----------------------------------------
var LAYER_COUNT = 3;
var MAP = {tw: 60, th: 15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var worldOffsetX =0;


//layers to level-------------------------------- 
var LAYER_COUNT = 3;
var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

//collision--------------------------------------
var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;


//fps--------------------------------------------
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;


//canvas-----------------------------------------
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


//score------------------------------------------
var score = 0;


//lives------------------------------------------
var lives = 3;

//sounds-----------------------------------------
var musicBackground;
var sfxFire;


//enemy------------------------------------------
var ENEMY_MAXDX = METER * 5; 
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var enemies = [];

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;


//new objects||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();

//functions||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//deltaTime==========================================================
function getDeltaTime(){
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
    
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
	if(deltaTime > 1)
		deltaTime = 1;
		
    
	return deltaTime;
}

    var dt = getDeltaTime;

//fps================================================================
function FPS(deltaTime){
    fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1){
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}	
    
}


//score==============================================================
var scoreImg = document.createElement("img");
scoreImg.src = "score.png";


function Score(){
    context.drawImage(scoreImg, SCREEN_WIDTH - scoreImg.width, 0);
    
    context.fillStyle = "black";
    context.font="32px Arial";
    var scoreText = score;
    context.fillText(scoreText, SCREEN_WIDTH - 156, 40);
}


//health=============================================================
var health = document.createElement("img");
health.src = "health.png";

var heartImage = document.createElement("img");
heartImage.src = "heart.png";

function Life(){
    context.drawImage(health, 0, 0);
    
    for(var i = 0; i < lives; i ++){
        context.drawImage(heartImage, 70 + (( heartImage.width + 2) * i ), 15);
    }
}


//player collision check=============================================

function cellAtPixelCoord(layer, x, y) {
    if (x < 0 || x > SCREEN_WIDTH)
        return 1;

    if (y > SCREEN_HEIGHT)
        return 0;
    return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty) {
    if (tx < 0 || tx >= MAP.tw)
        return 1;

    if (ty >= MAP.th)
        return 0;
    return cells[layer][ty][tx];
};


function tileToPixel(tile){
    return tile * TILE;
};


function pixelToTile(pixel){
    return Math.floor(pixel/TILE);
};


function bound(value, min, max){
    if(value < min)
            return min;
    
    if(value > max)
        return max;
        return value;
}


//drawmap============================================================
var tileset = document.createElement("img");
tileset.src = "tileset.png";

function drawMap(){
    var startX = -1;
    var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2; 
    var tileX = pixelToTile(player.position.x);
    var offsetX = TILE + Math.floor(player.position.x%TILE);
    startX = tileX -Math.floor(maxTiles / 2);
    if(startX < -1) {
        startX = 0;
        offsetX = 0;
    }
    if(startX > MAP.tw - maxTiles){
        startX = MAP.tw - maxTiles + 1;
        offsetX = TILE;
    }   
    worldOffsetX = startX * TILE + offsetX;
    for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ ){
        for( var y = 0; y < level1.layers[layerIdx].height;  y++ ){
            var idx = y * level1.layers[layerIdx].width + startX;
            for( var x = startX; x < startX + maxTiles;  x++ ) {
                if( level1.layers[layerIdx].data[idx] != 0 ){
                var tileIndex = level1.layers[layerIdx].data[idx] - 1;
                    var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * 
                    (TILESET_TILE + TILESET_SPACING);
                    var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * 
                    (TILESET_TILE + TILESET_SPACING);
                    context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, (x - startX) * TILE - offsetX, (y - 1) * TILE, TILESET_TILE, TILESET_TILE);
                }
            idx++;
            }
        }
    }
}

//initnitialize======================================================
//??????
var cells = [];
function initialize() {
    for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
        cells[layerIdx] = [];
        var idx = 0;
        for(var y = 0; y < level1.layers[layerIdx].height; y++) {
             cells[layerIdx][y] = [];
             for(var x = 0; x < level1.layers[layerIdx].width; x++) {
                 if(level1.layers[layerIdx].data[idx] != 0) {
                cells[layerIdx][y][x] = 1;
                cells[layerIdx][y-1][x] = 1;
                cells[layerIdx][y-1][x+1] = 1;
                cells[layerIdx][y][x+1] = 1;
                 }
                 else if(cells[layerIdx][y][x] != 1) {
                 cells[layerIdx][y][x] = 0;
                }
             idx++;
             }
         }
     }
    
    
//add enemies------------------------------------
    level1.layers[LAYER_OBJECT_ENEMIES] = [];
    idx = 0;
    for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {        
        for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
            if(level1.layers[114].data[idx] != 0) {
                var px = tileToPixel(x);
                var py = tileToPixel(y);
                var e = new Enemy(px, py);
                enemies.push(e);
            }
            idx++;
        }
    }  
    
    
//trigger----------------------------------------
    cells[LAYER_OBJECT_TRIGGERS] = [];    
    idx = 0;    
    for(var y = 0; y < level1.layers[LAYER_OBJECT_TRIGGERS].height; y++) {        
        cells[LAYER_OBJECT_TRIGGERS][y] = [];
        for(var x = 0; x < level1.layers[LAYER_OBJECT_TRIGGERS].width; x++) {
            if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] != 0) {
                cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;  
                cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;    
                cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;  
                cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;    
            }               
            else if(cells[LAYER_OBJECT_TRIGGERS][y][x] != 1) {
                // if we haven't set this cell's value, then set it to 0 now
                cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;                     
            }
        idx++;
        }
    }    
    
    
//sound------------------------------------------
    musicBackground = new Howl( {
        urls: ["background.ogg"], 
        loop: true,
        buffer: true,
        volume: 0.5
    } );
    musicBackground.play();
    
    
    sfxFire = new Howl( {
        urls: ["fireEffect.ogg"],
        buffer: true,
        volume: 1,
        onend: function() {
            isSfxPlaying = false;
        }
    } );
    
}


//player=============================================================

//run function|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
function run(){
//deltatime-------------------------------------
	var deltaTime = getDeltaTime();
    
//draw & update======================================================
//background--------------------------------
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);

 
//player 1 of 2----------------------------------
    player.update(deltaTime);
    
    
//drawMap----------------------------------------
    drawMap();
  
    
//score------------------------------------------
    Score();
    

//life------------------------------------------
    Life();
    
    
//player2 of 2-----------------------------------
    player.draw(worldOffsetX);

    
//draw enemy-------------------------------------
    
//draw fps---------------------------------------
    FPS(deltaTime);
    
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 2, 80, 100);


//
}

initialize();


//screen refresh=====================================================
//-------------------- Don't modify anything below here

(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
