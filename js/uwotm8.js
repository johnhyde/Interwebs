var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  CLOCKWISE: 69,
  WIDDERSHINS: 65,
  
  // undefined or 0: Not pressed
  // 1: Just pressed
  // 2: Still pressed
  // 3: Just released
  getState: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  isDown: function(keyCode) {
  	return this.getState(keyCode) === 2 || this.getState(keyCode) === 1;
  },

  onKeydown: function(event) {
  	if (this._pressed[event.keyCode] && this._pressed[event.keyCode] !== 3) {
    	this._pressed[event.keyCode] = 2;
	}
	else {
    	this._pressed[event.keyCode] = 1;
    }
  },
  
  onKeyup: function(event) {
    this._pressed[event.keyCode] = 3;
    console.log("Key released:" + event.keyCode);
  },

  updateStates: function() {
	for (var key in this._pressed) {
		var state = this.getState(key);
		if ( state === 1) {
			this._pressed[key] = 2;
		}
		if (state === 3) {
			delete this._pressed[key];
		}
	}
  }
};
// Define "objects" (I don't really know what I'm doing)


function copyJson(json) {
	return JSON.parse(JSON.stringify(json));
}
function Frame(src) {
	this.src = src;
	this.image = $('<img src=' + src + '>')[0];
	this.width = 0;
	this.height = 0;
	// _frame.image.onload = function() {
		this.width = this.image.width;
		this.height = this.image.width;
	// }
	// return _frame;
}
function Animation(srcs) {
	this.frames = [];
	this.currentframe = 0;
	this.type = "loop"; // loop | loopRev | once | onceRev | pong | pongRev
	this.width = 0;
	this.height = 0;
	for (var i = 0; i < srcs.length; i++) {
		var _frame = new Frame(srcs[i]);
		this.frames.push(_frame);
		this.width = Math.max(this.width, _frame.width);
		this.height = Math.max(this.height, _frame.height);
	}
}
function Entity(anims, x, y, width, height) {
	this.animations = [];
	this.currentAnimation = 0;
	this.canvas = $('<canvas class="hidden">')[0];
	this.context= null;
	this.children = {};
	this.x = x | 0;
	this.y = y | 0;
	this.rotation = 0;
	this.width = 0;
	this.height = 0;
	for (var i = 0; anims && i < anims.length; i++) {
		var _animation = new Animation(anims[i]);
		this.animations.push(_animation);
		this.width = Math.max(this.width, _animation.width);
		this.height = Math.max(this.height, _animation.height);
	}
	this.width = width || this.width;
	this.height = height || this.height;
	document.body.appendChild(this.canvas);
	this.canvas.width = this.width;
	this.canvas.height = this.width;
	this.context = this.canvas.getContext('2d');
	this.context.translate(this.width/2, this.height/2);
}
function getAnimation(entity) {
	return (entity.animations)?entity.animations[entity.currentAnimation]:null;
}
function getFrame(animation) {
	return (animation.frames)?animation.frames[animation.currentframe]:null;
}
function getImageFromEntity(entity) {
	var anim = getAnimation(entity);
	if (!anim) return null;
	var frame = getFrame(anim);
	if (!frame) return null;
	return frame.image;
}
// function draw(context, entity) {
// 	context.drawImage(getImageFromEntity(entity), entity.x, entity.y,
//   entity.width, entity.height);
// }
// function drawHere(context, entity, x, y) {
// 	context.drawImage(getImageFromEntity(entity), x, y, entity.width, entity.height);
// }
// function drawThisBig(context, entity, width, height) {
// 	context.drawImage(getImageFromEntity(entity), entity.x, entity.y, width, height);
// }
function draw(context, entity, x, y, width, height) {
	x = x || entity.x;
	y = y || entity.y;{}
	width = (width !== undefined) ? width : entity.width;
	height = (height !== undefined) ? height : entity.height;
	// context.drawImage(getImageFromEntity(entity), (x | entity.x), (y | entity.y),
	//  (width | entity.width), (height | entity.height));
	entity.context.clearRect(0, 0, entity.canvas.width, entity.canvas.height);
	if (getImageFromEntity(entity)) {
		entity.context.drawImage(getImageFromEntity(entity), 0, 0);
	}
	for (var key in entity.children) {
		draw(entity.context, entity.children[key])
	}
	context.drawImage(entity.canvas, x, y, width, height);
}
// Setup stuffs
var gameWidth = 900, gameHeight = 900;
var gameCanvas = $('<canvas id=gameCanvas>');
$('#gamePane').append(gameCanvas);
var gameContext;
// $(window).resize(function() {
// 	gameCanvas.attr('width', $('#gamePane').width());
// 	gameCanvas.attr('height', $('#gamePane').height());
// 	gameContext = gameCanvas[0].getContext('2d');
// });
// gameCanvas.attr('width', $('#gamePane').width());
// gameCanvas.attr('height', $('#gamePane').height());
gameCanvas.attr('width', gameWidth);
gameCanvas.attr('height', gameHeight);
gameContext = gameCanvas[0].getContext('2d');
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

// Global variables
var scenes = {
	menu: {},
	game: {}
}
var player;
var circle;
var pw = 444;


// Preload them resources
var preloadedImgs = [];
var preloaded = 0; preloadedTotal = 0
$.get("js/main.js", function(data) {
	// debugger;
	var urls = data.match(/["']res((\/\w*)+)\.\w*(?=["'])/g);
	preloadedTotal = urls.length;
	for (var i = 0; i < urls.length; i++) {
		var img = new Image();
		preloadedImgs.push(img);
		preloadedImgs[i].src = urls[i].slice(1,urls[i].length);
		preloadedImgs[i].onload = function() {
			preloaded++;
			if (preloaded === preloadedTotal) {
				startMainMenu();
			}
		};
	}
}, "text");

function startMainMenu() {
	startGame();
}
function startGame() {
	var pointCount = 5;
	scenes.game = new Entity(null, null, null, gameWidth, gameHeight);
	circle = new Entity([['res/circle.png']], 50, 50);
	scenes.game.children.circle = circle;
	for (var i = 0; i < pointCount; i++) {
		var angle = i*2*Math.PI/pointCount;
		circle.children['point' + i] = new Entity([['res/point.png']], 370 + 370*Math.cos(angle), 370 + 370*Math.sin(angle));
	}
	player = new Entity([['res/cage.jpg']], 200, 200);
	scenes.game.children.player = player;
	player.vx = 0;
	player.vy = 0;
	runGame();
}
function runGame() {
	// Start benchmark
	var startMs = ~~(new Date());
	// Movement
	var circleRotation = 0;

	// if (Key.isDown(Key.LEFT)) {
	// 	scenes.game.children.player.vx-=2;
	// }
	// if (Key.isDown(Key.RIGHT)) {
	// 	scenes.game.children.player.vx+=2;
	// }
	if (Key.isDown(Key.CLOCKWISE)) {
		circleRotation += 0.1;
	}
	if (Key.isDown(Key.WIDDERSHINS)) {
		circleRotation -= 0.1;
	}

	if (Key.isDown(Key.UP)) {
		player.vy -= 3;
	}
	if (Key.isDown(Key.DOWN)) {
		player.vy += 3;
	}
	if (Key.isDown(Key.LEFT)) {
		player.vx -= 3;
	}
	if (Key.isDown(Key.RIGHT)) {
		player.vx += 3;
	}
	var slowDown = true;
	if (slowDown) {
		player.vx *= 0.95;
		player.vy *= 0.95;
	}
	// if (Key.getState(Key.UP) === 3) {
	// 	player.y -= -22;
	// }
	// if (Key.getState(Key.DOWN) === 3) {
	// 	player.y += -22;
	// }
	// if (Key.getState(Key.LEFT) === 3) {
	// 	player.x -= -22;
	// }
	// if (Key.getState(Key.RIGHT) === 3) {
	// 	player.x += -22;
	// }

	player.x += player.vx;
	player.y += player.vy;
	
		circle.context.rotate(circleRotation); // circle.rotation

	// pw += ~~((Math.random()-0.5)*8);
	// Render

	gameContext.clearRect(0, 0, gameCanvas[0].width, gameCanvas[0].height);
	// for (var key in scenes.game) {
	// 	draw(gameContext, scenes.game[key])
	// }
	draw(gameContext, scenes.game)
	// draw(gameContext, new Entity([['res/joe_pass.jpg']], 44, 44));
	// draw(gameContext, new Entity([['res/mystery_font.jpeg']], 0, 0), 0, 0, pw, 222);
	// draw(gameContext, scenes.game.children.player);

	// Make key presses work
	Key.updateStates();
	// Set timer for next frame
	var loopLengthMs = ~~(new Date()) - startMs;
	var timeoutMs = Math.max(33 - loopLengthMs, 0);
	if (timeoutMs < 20) console.log(timeoutMs);
	setTimeout(runGame,  timeoutMs);
}


