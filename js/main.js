var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
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
function newFrame(src) {
	var _frame = {
		src: src,
		image: $('<img src=' + src + '>')[0],
		width: 0,
		height: 0
	}
	// _frame.image.onload = function() {
		_frame.width = _frame.image.width;
		_frame.height = _frame.image.width;
	// }
	return _frame;
}
function newAnimation(srcs) {
	var _animation = {
		frames: [],
		currentframe: 0,
		type: "loop", // loop | loopRev | once | onceRev | pong | pongRev
		width: 0,
		height: 0
	}
	for (var i = 0; i < srcs.length; i++) {
		var _frame = newFrame(srcs[i]);
		_animation.frames.push(_frame);
		_animation.width = Math.max(_animation.width, _frame.width);
		_animation.height = Math.max(_animation.height, _frame.height);
	}
	return _animation;
}
function newEntity(anims, x, y) {
	var _entity = {
		animations: [],
		currentAnimation: 0,
		x: x | 0,
		y: y | 0,
		width: 0,
		height: 0
	}
	for (var i = 0; i < anims.length; i++) {
		var _animation = newAnimation(anims[i]);
		_entity.animations.push(_animation);
		_entity.width = Math.max(_entity.width, _animation.width);
		_entity.height = Math.max(_entity.height, _animation.height);
	}
	return _entity;
}
function getAnimation(entity) {
	return entity.animations[entity.currentAnimation];
}
function getFrame(animation) {
	return animation.frames[animation.currentframe];
}
function getImageFromEntity(entity) {
	return getFrame(getAnimation(entity)).image;
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
	context.drawImage(getImageFromEntity(entity), x, y, width, height);
}
// Setup stuffs

var gameCanvas = $('<canvas id=gameCanvas>');
$('#gamePane').append(gameCanvas);
var gameContext;
$(window).resize(function() {
	gameCanvas.attr('width', $('#gamePane').width());
	gameCanvas.attr('height', $('#gamePane').height());
	gameContext = gameCanvas[0].getContext('2d');
});
gameCanvas.attr('width', $('#gamePane').width());
gameCanvas.attr('height', $('#gamePane').height());
gameContext = gameCanvas[0].getContext('2d');
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

// Global variables
var scenes = {
	menu: {},
	game: {}
}
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
	// scenes.game.player = newEntity([['res/cage.jpg']], 0, 0);
	// scenes.game.player.vx = 0;
	// scenes.game.player.vy = 0;
	runGame();
}
function runGame() {
	// Movement
	// if (Key.isDown(Key.UP)) {
	// 	scenes.game.player.vy-=2;
	// }
	// if (Key.isDown(Key.DOWN)) {
	// 	scenes.game.player.vy+=2;
	// }
	// if (Key.isDown(Key.LEFT)) {
	// 	scenes.game.player.vx-=2;
	// }
	// if (Key.isDown(Key.RIGHT)) {
	// 	scenes.game.player.vx+=2;
	// }
	// var slowDown = true;
	// if (slowDown) {
	// 	scenes.game.player.vx *= 0.95;
	// 	scenes.game.player.vy *= 0.95;
	// }
	// if (Key.getState(Key.UP) === 3) {
	// 	scenes.game.player.y-=-22;
	// }
	// if (Key.getState(Key.DOWN) === 3) {
	// 	scenes.game.player.y+=-22;
	// }
	// if (Key.getState(Key.LEFT) === 3) {
	// 	scenes.game.player.x-=-22;
	// }
	// if (Key.getState(Key.RIGHT) === 3) {
	// 	scenes.game.player.x+=-22;
	// }

	scenes.game.player.x += scenes.game.player.vx;
	scenes.game.player.y += scenes.game.player.vy;

	// pw += ~~((Math.random()-0.5)*8);
	// Render
	gameContext.clearRect(0, 0, gameCanvas[0].width, gameCanvas[0].height);
	// draw(gameContext, newEntity([['res/joe_pass.jpg']], 44, 44));
	// draw(gameContext, newEntity([['res/mystery_font.jpeg']], 0, 0), 0, 0, pw, 222);
	// draw(gameContext, scenes.game.player);

	// Make key presses work
	Key.updateStates();
	// Set timer for next frame
	setTimeout(runGame,  33);
}


