var Key = {
  _pressed: {},
  secret: '',

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  CLOCKWISE: 69,
  WIDDERSHINS: 65,
  JUMP_UP: 188,
  JUMP_DOWN: 79,
  JUMP_ACROSS: 32,
  CAGE: 187,
  
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
    this.secret = (this.secret + String.fromCharCode(event.keyCode)).slice(-20);
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
	this.currentFrame = 0;
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
	return (animation.frames)?animation.frames[animation.currentFrame]:null;
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
	if (entity === circle) {
		for (var key in entity.children) {
			if (key ==="player" && player.netPoints.length !== 0) {
				// Draw Lines
				circle.context.lineWidth = 10;
				circle.context.lineCap = "round";
				circle.context.lineJoin = "round";
				// circle.context.strokeStyle = "#666666";
				circle.context.beginPath();
				var firstPoint = circle.points[player.netPoints[0]];
			    circle.context.moveTo(firstPoint.x, firstPoint.y);
				for (var i = 0; i < player.netPoints.length; i++) {
					var digit = ~~(10*(i/player.netPoints.length));
					var color = '#';
					for (var j = 0; j < 6; j++) {
						color += digit;
					}
					circle.context.stokeStyle = color;
					// console.log(color);
					// circle.context.stokeStyle = "#222222";
					var point1 = circle.points[player.netPoints[i]];
					var point2 = (i === player.netPoints.length-1)?player:circle.points[player.netPoints[i+1]];
					// circle.context.drawLine(point1.x, point1.y, point2.x, point2.y); this.beginPath();
				    circle.context.lineTo(point2.x, point2.y);
				    // circle.context.stroke();
				    // circle.context.moveTo(point1.x, point1.y);
				}
				circle.context.lineTo(player.x, player.y);
				circle.context.stroke();
				circle.context.closePath();
			}
			draw(entity.context, entity.children[key])
		}
	}
	else {

		for (var key in entity.children) {
			draw(entity.context, entity.children[key])
		}
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
var FPS = 30;
var scenes = {
	menu: {},
	game: {}
}
var cage;
var player;
var mark;
var circle;
var pointCount = 12;


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
	circle.currentRotation = 0;
	circle.rotationsToDo = [];
	circle.getOpposingPoint = function(index) {
		var reflectAngle = modulo(-circle.rotation, 2*Math.PI);
		var reflectAngleR = modulo(reflectAngle + Math.PI, 2*Math.PI);
		var radsPerPoint = 2*Math.PI/circle.points.length;	
		var pointAngle = index*radsPerPoint;
		var diff = modulo(pointAngle - reflectAngle, 2*Math.PI);
		var diffR = modulo(pointAngle - reflectAngleR, 2*Math.PI);
		if (Math.abs(2*Math.PI - diff) < 0.005 || Math.abs(2*Math.PI - diffR) < 0.005 ||
			Math.abs(diff) < 0.005 || Math.abs(diffR) < 0.005) {
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
	player.netPoints = [];
	player.nettedPoints = [[]];
	player.pointsToGoTo = [];
	player.nextPoint = function() {
		this.points.push(this.pointIndex);
		this.netPoints.push(this.pointIndex);
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
	player.jumpAcross = function() {
		this.setPoint(this.getNewestPoint()+circle.points.length/2);
	}
	player.speed = 4000;
	cage = new Entity([['res/cage00.jpg']], 0, 0/*, 80, 80*/);
	cage.wraps = true;
	// scenes.game.children.cage = cage;
	cage.vx = 0;
	cage.vy = 0;
	mark = new Entity([['res/player00.png']]);
	// circle.children.mark = mark;
	runGame();
}
function runGame() {
	// Start benchmark
	var startMs = ~~(new Date());
	// Movement
	var circleRotation = 0;

	if (Key.isDown(Key.LEFT)) {
		cage.vx-=2;
	}
	if (Key.isDown(Key.RIGHT)) {
		cage.vx+=2;
	}
	if (Key.getState(Key.JUMP_UP) === 1) {
		// player.incrementPoint(1);
		player.jumpPoint();
	}
	if (Key.getState(Key.JUMP_DOWN) === 1) {
		// player.incrementPoint(-1);
		player.jumpPoint();
	}
	if (Key.getState(Key.JUMP_ACROSS) === 1) {
		// player.incrementPoint(-1);
		player.jumpAcross();
	}
	if (Key.getState(Key.CLOCKWISE) === 1 || 
		(Key.getState(Key.CLOCKWISE) === 2 && circle.rotationsToDo.length === 0 && circle.currentRotation === 0)) {
		// circle.vrotation += Math.PI/circle.points.length;
		circle.rotationsToDo.push(1);
	}
	if (Key.getState(Key.WIDDERSHINS) === 1 ||
		(Key.getState(Key.WIDDERSHINS) === 2 && circle.rotationsToDo.length === 0 && circle.currentRotation === 0)) {
		// circle.vrotation -= Math.PI/circle.points.length;
		circle.rotationsToDo.push(-1);
	}

	if (Key.getState(Key.CAGE) === 1 || Key.secret.indexOf('CAGE') !== -1) {
		if (!scenes.game.children.cage) {
			scenes.game.children.cage = cage;
		}
		else {
			delete scenes.game.children['cage'];
		}
		Key.secret = Key.secret.slice(Key.secret.indexOf('CAGE') + 4);
	}
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

	// pointCount += 0.001
	// circle.points = [];
	// for (var i = 0; i < pointCount; i++) {
	// 	var angle = i*2*Math.PI/pointCount;
	// 	circle.children['point' + i] = new Entity([['res/point00.png']],
	// 		370*Math.cos(angle), 370*Math.sin(angle));
	// 	circle.points.push(circle.children['point' + i]);
	// }

	// Cage movement
	cage.x += cage.vx/FPS;
	cage.y += cage.vy/FPS;
	var offx = gameWidth + scenes.game.gap;
	var offy = gameHeight + scenes.game.gap;
	// cage.x = (((cage.x + offx/2)% offx)+offx)%offx -offx/2;
	// cage.y = (((cage.y + offy/2)% offy)+offy)%offy -offy/2;
	cage.x = modulo(cage.x + offx/2, offx) - offx/2;
	cage.y = modulo(cage.y + offy/2, offy) - offy/2;


	// Player movement
	// player.pointIndex = modulo(player.pointIndex, circle.points.length);
	var playerArrived = false;
	var playerPoint = circle.points[player.pointIndex];
	if (!playerPoint) debugger;
	var dx = playerPoint.x - player.x;
	var dy = playerPoint.y - player.y;
	if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
		if (player.pointIndex === player.netPoints[player.netPoints.length-2]) { // Erase net if backtracking
			player.netPoints.pop();
		}
		var distance = pythag(dx, dy);
		var lastPoint = circle.points[player.getLatestPoint()];
		var totalDx = playerPoint.x - lastPoint.x;
		var totalDy = playerPoint.y - lastPoint.y;
		var totalDistance = pythag(totalDx, totalDy);
		// var vRatio = Math.min(1, distance/totalDistance + 0.4);
		// vRatio = Math.sqrt(distance/totalDistance);
		// // vRatio *= vRatio;
		// vRatio -= 0.1;
		// var playerAngle = Math.atan2(dy, dx);
		// var speedMult = Math.max(2, vRatio*player.speed/FPS);
		// player.x += speedMult * Math.cos(playerAngle);
		// player.y += speedMult * Math.sin(playerAngle);
		player.x = (totalDx !== 0)?(playerPoint.x - Math.max(0, dx/totalDx - 9/FPS)*totalDx):playerPoint.x;
		player.y = (totalDy !== 0)?(playerPoint.y - Math.max(0, dy/totalDy - 9/FPS)*totalDy):playerPoint.y;
	}
	else {
		if (player.pointIndex === player.netPoints[player.netPoints.length-1]) { // Erase net if backtracking
			player.netPoints.pop();
		}
		player.x = circle.points[player.pointIndex].x;
		player.y = circle.points[player.pointIndex].y;
		if (player.pointsToGoTo.length !== 0) {
			player.nextPoint();
		}
		else {
			playerArrived = true;
		}
	}

	// Collapse closed nets
	if (player.netPoints.length !== 0) {
		for (var i = 0; i < player.netPoints.length-1; i++) {
			for (var j = i + 1; j < player.netPoints.length + 1; j++) {
				var startNet = 0;
				var endNet = player.netPoints.length;
				var closed = false;
				if (j === player.netPoints.length) {
					if (player.netPoints[i] === player.pointIndex /*&& playerArrived*/) {
						startNet = i+1;
						closed = true;
					}
				}
				else {
					if (player.netPoints[i] === player.netPoints[j]) {
						startNet = i;
						endNet = j;
						closed = true;
					}
				}
				if (j > i + 1 && j < player.netPoints.length && !closed) {
					var p1 = player.netPoints[i];
					var p2 = player.netPoints[i+1];
					var p3 = player.netPoints[j];
					var p4 = 0;
					if (j + 1 < player.netPoints.length) {
						p4 = player.netPoints[j+1];
					}
					else if (j < player.netPoints.length) {
						if (!playerArrived) break;
						p4 = player.pointIndex;
					}
					if (p1 > p2) {
						var tempP = p2;
						p2 = p1;
						p1 = tempP;
					}
					// console.log('p1: ' + p1 + ', p2: ' + p2 + ', p3: ' + p3 + ', p4: ' + p4);
					if (p3 > p1 && p3 < p2) {
						if (!(p4 > p1 && p4 < p2)) {
							closed = true;
						}
					}
					else {
						if (p4 > p1 && p4 < p2) {
							closed = true;
						}
					}
					if (closed) {
						// startNet = Math.max(player.netPoints.lastIndexOf();
						startNet = i + 1;
						endNet = Math.min(player.netPoints.length, j + 1);
						var pnts = circle.points;
						var intersection = getIntersection(pnts[p1].x, pnts[p1].y, pnts[p2].x, pnts[p2].y,
							pnts[p3].x, pnts[p3].y, pnts[p4].x, pnts[p4].y);
						mark.x = intersection.x;
						mark.y = intersection.y;
					}
				}
				if (closed) {
					// var player.netPoints.splice(startNet, endNet).map(function(key) {
					// 	return [circle.points[key].x, circle.points[key].y];
					// });
					player.netPoints.splice(startNet, endNet)
				}		
			}
		}
	}

	// Circle Rotation
	var radsPerPoint = Math.PI/circle.points.length;
	var rotation = 12/FPS;

	// var radRotation = 0;
	// player.x = circle.points[player.pointIndex].x;
	// player.y = circle.points[player.pointIndex].y;
	if (Math.abs(circle.currentRotation) <= rotation/2) {
		circle.rotation = radsPerPoint*Math.round(circle.rotation/radsPerPoint);
		// radRotation += circle.currentRotation*radsPerPoint;
		circle.currentRotation = 0;
		if (circle.rotationsToDo.length !== 0) {
			circle.currentRotation = circle.rotationsToDo.shift();
		}
	}
	if (Math.abs(circle.currentRotation) > rotation/2) {
		if (circle.currentRotation < 0) rotation = -rotation;
		var radRotation = (Math.PI/circle.points.length)*rotation;
		circle.rotation += radRotation;
		player.rotation -= radRotation;
		circle.currentRotation -= rotation;
		cage.context.rotate(-rotation);
	}
	circle.context.setRotation(circle.rotation);
	player.context.setRotation(player.rotation);

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
	if (loopLengthMs > 700/FPS) console.log('Loop duration: ' + loopLengthMs + 'ms');
	var FPSMult = 0;
	if (loopLengthMs > 900/FPS) FPS = 30;
	if (loopLengthMs < 400/FPS) FPS = 60;
	// if (loopLengthMs > 900/FPS) FPSMult = 0.9;
	// if (loopLengthMs < 600/FPS) FPSMult = 1.1;
	// FPS *= FPSMult;
	var timeoutMs = Math.max(1000/FPS - loopLengthMs, 0);
	setTimeout(runGame,  timeoutMs);
	// setTimeout(runGame,  100);
}


