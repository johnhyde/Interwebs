var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  CLOCKWISE: 69,
  WIDDERSHINS: 65,
  JUMP_UP: 188,
  JUMP_DOWN: 79,
  
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
	this.wraps = false;
	for (var i = 0; anims && i < anims.length; i++) {
		var _animation = new Animation(anims[i]);
		this.animations.push(_animation);
		this.width = Math.max(this.width, _animation.width);
		this.height = Math.max(this.height, _animation.height);
	}
	this.width = 2*Math.sqrt(this.width*this.width/4 + this.height*this.height/4);
	this.height = this.width;
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
	entity.context.clearRect(-entity.canvas.width/2, -entity.canvas.height/2,
		entity.canvas.width, entity.canvas.height);
	var _image = getImageFromEntity(entity);
	if (_image) {
		entity.context.drawImage(_image, -_image.width/2, -_image.height/2);
	}
	for (var key in entity.children) {
		draw(entity.context, entity.children[key])
	}
	context.drawImage(entity.canvas, x - width/2, y - height/2, width, height);
	if (entity.wraps) {
		var newX = entity.x, newY = entity.y;
		if (entity.x - entity.width/2 < -context.canvas.width/2) {
			newX += context.canvas.width + scenes.game.gap;
		}
		if (entity.x + entity.width/2 > context.canvas.width/2) {
			newX -= context.canvas.width + scenes.game.gap;
		}
		if (entity.y - entity.height/2 < -context.canvas.height/2) {
			newY += context.canvas.height + scenes.game.gap;
		}
		if (entity.y + entity.height/2 > context.canvas.height/2) {
			newY -= context.canvas.height + scenes.game.gap;
		}
		if (x !== newX || y !== newY) {
			context.drawImage(entity.canvas, x - entity.width/2, newY - height/2, width, height);
			context.drawImage(entity.canvas, newX - entity.width/2, y - height/2, width, height);
			if (x !== newX && y !== newY)
			context.drawImage(entity.canvas, newX - entity.width/2, newY - height/2, width, height);
		}
	}
}
// Setup stuffs
var gameWidth = 1000, gameHeight = 1000;
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
gameContext.translate(gameWidth/2, gameHeight/2);
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

// Global variables
var FPS = 60;
var scenes = {
	menu: {},
	game: {}
}
var cage;
var player;
var circle;
var pw = 444;


// Preload them resources
var preloadedImgs = [];
var preloaded = 0; preloadedTotal = 0
$.get("js/main.js", function(data) {
	// debugger;
	var preUrls = data.match(/["']res((\/\w*)+)(\d){2}\.\w*(?=["'])/g).map(function(str) {
		return str.slice(1);
	});
	if (!preUrls) {
		startMainMenu();
		return;
	}
	var urls = [];
	for (var i = 0; i < preUrls.length; i++) {
		var animLength = ~~(preUrls[i].match(/\d{2}/)[0]) + 1;
		var pathStart = preUrls[i].slice(0, preUrls[i].regexIndexOf(/\d/));
		var ext = preUrls[i].slice(preUrls[i].indexOf('.'));
		for (var j = 0; j < animLength; j++) {
			urls.push(pathStart + numToStringSpecLength(j, 2) + ext);
		}
	}
	preloadedTotal = urls.length;
	for (var i = 0; i < urls.length; i++) {
		var img = new Image();
		preloadedImgs.push(img);
		preloadedImgs[i].src = urls[i];
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
	var pointCount = 12;
	scenes.game = new Entity(null, null, null, gameWidth, gameHeight);
	scenes.game.gap = 80;
	circle = new Entity([['res/circle00.png']], 0, 0);
	circle.wraps = true;
	circle.vrotation = 0;
	circle.points = [];
	scenes.game.children.circle = circle;
	for (var i = 0; i < pointCount; i++) {
		var angle = i*2*Math.PI/pointCount;
		circle.children['point' + i] = new Entity([['res/point00.png']],
			370*Math.cos(angle), 370*Math.sin(angle));
		circle.points.push(circle.children['point' + i]);
	}
	circle.rotationsToDo = [];
	circle.getOpposingPoint = function(index) {
		var reflectAngle = modulo(-circle.rotation, 2*Math.PI);
		var reflectAngleR = modulo(reflectAngle + Math.PI, 2*Math.PI);
		var radsPerPoint = 2*Math.PI/circle.points.length;	
		var pointAngle = index*radsPerPoint;
		if (Math.abs(pointAngle - reflectAngle) < 0.005 || Math.abs(pointAngle - reflectAngleR) < 0.005) {
			return index + circle.points.length/2;
		}
		else {
			return index - Math.round(2*(pointAngle - reflectAngle)/radsPerPoint);
		}
	}
	var playerStartPoint = ~~(Math.random() * circle.points.length);
	player = new Entity([['res/player00.png']], circle.points[playerStartPoint].x, circle.points[playerStartPoint].y);
	scenes.game.children.circle.children.player = player;
	player.pointIndex = playerStartPoint;
	player.points = [];
	player.pointsToGoTo = [];
	player.nextPoint = function() {
		this.points.push(this.pointIndex);
		this.pointIndex = this.pointsToGoTo.shift();
	}
	player.getLatestPoint = function() {
		return (player.points.length!==0)?player.points[player.points.length-1]:player.pointIndex;
	}
	player.getNewestPoint = function() {
		return (player.pointsToGoTo.length!==0)?player.pointsToGoTo[player.pointsToGoTo.length-1]:player.pointIndex;
	}
	player.setPoint = function(index) {
		this.pointsToGoTo.push(modulo(index, circle.points.length));
	}
	player.incrementPoint = function(inc) {
		var mostRecentPoint = this.pointsToGoTo[this.pointsToGoTo.length - 1];
		if (mostRecentPoint === undefined) mostRecentPoint = this.pointIndex;
		this.pointsToGoTo.push(modulo(mostRecentPoint + inc, circle.points.length));
	}
	player.jumpPoint = function() {
		this.setPoint(circle.getOpposingPoint(this.getNewestPoint()));
	}
	player.speed = 4000;
	cage = new Entity([['res/cage00.jpg']], 0, 0/*, 80, 80*/);
	cage.wraps = true;
	// scenes.game.children.cage = cage;
	cage.vx = 0;
	cage.vy = 0;
	runGame();
}
function runGame() {
	// Start benchmark
	var startMs = ~~(new Date());
	// Movement
	var circleRotation = 0;

	// if (Key.isDown(Key.LEFT)) {
	// 	scenes.game.children.cage.vx-=2;
	// }
	// if (Key.isDown(Key.RIGHT)) {
	// 	scenes.game.children.cage.vx+=2;
	// }
	if (Key.getState(Key.JUMP_UP) === 1) {
		// player.incrementPoint(1);
		player.jumpPoint();
	}
	if (Key.getState(Key.JUMP_DOWN) === 1) {
		// player.incrementPoint(-1);
		player.jumpPoint();
	}
	if (Key.getState(Key.CLOCKWISE) === 1) {
		// circle.vrotation += Math.PI/circle.points.length;
		circle.rotationsToDo.push(1);
	}
	if (Key.getState(Key.WIDDERSHINS) === 1) {
		// circle.vrotation -= Math.PI/circle.points.length;
		circle.rotationsToDo.push(-1);
	}
	// circle.vrotation *= 0.94;

	if (Key.isDown(Key.UP)) {
		cage.vy -= 90;
	}
	if (Key.isDown(Key.DOWN)) {
		cage.vy += 90;
	}
	if (Key.isDown(Key.LEFT)) {
		cage.vx -= 90;
	}
	if (Key.isDown(Key.RIGHT)) {
		cage.vx += 90;
	}
	var slowDown = true;
	if (slowDown) {
		cage.vx *= 0.95;
		cage.vy *= 0.95;
	}
	// if (Key.getState(Key.UP) === 3) {
	// 	cage.y -= -22;
	// }
	// if (Key.getState(Key.DOWN) === 3) {
	// 	cage.y += -22;
	// }
	// if (Key.getState(Key.LEFT) === 3) {
	// 	cage.x -= -22;
	// }
	// if (Key.getState(Key.RIGHT) === 3) {
	// 	cage.x += -22;
	// }

	cage.x += cage.vx/FPS;
	cage.y += cage.vy/FPS;
	var offx = gameWidth + scenes.game.gap;
	var offy = gameHeight + scenes.game.gap;
	// cage.x = (((cage.x + offx/2)% offx)+offx)%offx -offx/2;
	// cage.y = (((cage.y + offy/2)% offy)+offy)%offy -offy/2;
	cage.x = modulo(cage.x + offx/2, offx) - offx/2;
	cage.y = modulo(cage.y + offy/2, offy) - offy/2;

	// player.pointIndex = modulo(player.pointIndex, circle.points.length);
	var playerPoint = circle.points[player.pointIndex];
	if (!playerPoint) debugger;
	var dx = playerPoint.x - player.x;
	var dy = playerPoint.y - player.y;
	if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
		var distance = pythag(dx, dy);
		var totalDx = playerPoint.x - circle.points[player.points[player.points.length-1]].x;
		var totalDy = playerPoint.y - circle.points[player.points[player.points.length-1]].y;
		var totalDistance = pythag(totalDx, totalDy);
		var vRatio = Math.min(1, distance/totalDistance + 0.4);
		vRatio = Math.sqrt(distance/totalDistance);
		// vRatio *= vRatio;
		vRatio -= 0.1;
		var playerAngle = Math.atan2(dy, dx);
		var speedMult = Math.max(2, vRatio*player.speed/FPS);
		player.x += speedMult * Math.cos(playerAngle);
		player.y += speedMult * Math.sin(playerAngle);
	}
	else {
		player.x = circle.points[player.pointIndex].x;
		player.y = circle.points[player.pointIndex].y;
		if (player.pointsToGoTo.length !== 0) {
			player.nextPoint();
		}
	}

	// player.x = circle.points[player.pointIndex].x;
	// player.y = circle.points[player.pointIndex].y;
	if (circle.rotationsToDo.length !== 0) {
		var rotation = circle.rotationsToDo.shift() * (Math.PI/circle.points.length);
		// circle.context.rotate(circle.vrotation/FPS); // circle.rotation
		// cage.context.rotate(-circle.vrotation);
		// player.context.rotate(-circle.vrotation/FPS);
		circle.rotation += rotation;
		player.rotation -= rotation;
		circle.context.rotate(rotation);
		player.context.rotate(-rotation);
	}

	// pw += ~~((Math.random()-0.5)*8);
	// Render

	gameContext.clearRect(-gameCanvas[0].width/2, -gameCanvas[0].height/2,
		gameCanvas[0].width, gameCanvas[0].height);
	// gameContext.clearRect(0, 0,
	// 	gameCanvas[0].width, gameCanvas[0].height);
	// gameContext.clearRect(-gameCanvas[0].width, -gameCanvas[0].height, 0, 0);
	// for (var key in scenes.game) {
	// 	draw(gameContext, scenes.game[key])
	// }
	draw(gameContext, scenes.game)
	// draw(gameContext, new Entity([['res/joe_pass.jpg']], 44, 44));
	// draw(gameContext, new Entity([['res/mystery_font.jpeg']], 0, 0), 0, 0, pw, 222);
	// draw(gameContext, scenes.game.children.cage);

	// Make key presses work
	Key.updateStates();
	// Set timer for next frame
	var loopLengthMs = ~~(new Date()) - startMs;
	var timeoutMs = Math.max(1000/FPS - loopLengthMs, 0);
	if (timeoutMs < 700/FPS) console.log("Timout length: " + timeoutMs);
	setTimeout(runGame,  timeoutMs);
}


