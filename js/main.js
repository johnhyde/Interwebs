var Key = {
  _pressed: {},
  secret: '',
  layout: "p_dvorak",

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  CLOCKWISE: 69,
  WIDDERSHINS: 65,
  JUMP: 79,
  ALT_JUMP: 188,
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

  // undefined or 0: Not pressed
  // 1: Just pressed
  // 2: Still pressed
  // 3: Just released
var Touch = {
	xMove: 0,
	yMove: 0,
	xSwipe: null, // -1: swipe left; null: no swip; 1: swipe right
	ySwipe: null, // -1: swipe up; null: no swip; 1: swipe down
	asyncTouches: [],
	touches: [],
	startTime: null,
	getCoords: function(i) {
		return this.toGameCoords(this.touches[i]);
	},
	getTap: function(i) {
		return this.touches[i];
	},
	getXSwipe: function() {
		var ret = this.xSwipe;
		this.xSwipe = null;
		if (ret) this.coords = null;
		return ret;
	},
	getYSwipe: function() {
		var ret = this.ySwipe;
		this.ySwipe = null;
		if (ret) this.coords = null;
		return ret;
	},
	toGameCoords: function(coords) {
		if (!coords) return null;
		var screenPane = gamePane.getClientRects()[0];
		return {
	    		x: (coords.x - (screenPane.left + screenPane.width/2))*(gameWidth/screenPane.width),
	    		y: (coords.y - (screenPane.top + screenPane.height/2))*(gameHeight/screenPane.height)
	    	};
	},
	onHammerTap: function(e) {
		Touch.tap = Touch.toGameCoords({x: e.center.x, y: e.center.y});
	},
	handleTouchStart: function(evt) {
		evt.preventDefault();
		for (var i = 0; i < evt.changedTouches.length; i++){
			var touch = evt.changedTouches[i]; 
			if (!touch.clientX) debugger;
			Touch.asyncTouches[touch.identifier] = {
				x: touch.clientX,
				y: touch.clientY,
				state: 1
			};
		}
		// for (var i in evt.touches)
	 //    Touch.starts[i] = {x: evt.touches[i].clientX, y:evt.touches[i].clientY};
	 //    Touch.coords[i] = Touch.start;
	 //    Touch.xMove = 0;
	 //    Touch.yMove = 0;
	 //    Touch.startTime = (new Date()).getTime();

	    // for (var i = 0; i < evt.touches.length; i++) {
	    // 	console.log('start: ' + i + ' x: ' + evt.touches[i].clientX + ' y: ' + evt.touches[i].clientY);
	    // }
	},

	handleTouchMove: function(evt) {
		for (var i = 0; i < evt.changedTouches.length; i++){
			var touch = evt.changedTouches[i]; 
			Touch.asyncTouches[touch.identifier].x = touch.clientX;
			Touch.asyncTouches[touch.identifier].y = touch.clientY;
		}
	    // if (!Touch.start) {
	    //     return;
	    // }

	    // var xUp = evt.touches[0].clientX;
	    // var yUp = evt.touches[0].clientY;
	    // Touch.coords = {x: xUp, y: yUp};
	    // var xDiff = Touch.start.x - xUp;
	    // var yDiff = Touch.start.y - yUp;

	    // if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
	    //     if ( xDiff > 0 ) {
	    //         /* left swipe */
	    //         Touch.xMove++;
	    //     } else {
	    //         /* right swipe */
	    //         Touch.xMove--;
	    //     }
	    // } else {
	    //     if ( yDiff > 0 ) {
	    //         /* up swipe */
	    //         Touch.yMove++;
	    //     } else {
	    //         /* down swipe */
	    //         Touch.yMove--;
	    //     }
	    // }
	    // /* reset values */
	    // // Touch.start = null;

	    // for (var i = 0; i < evt.touches.length; i++) {
	    // 	console.log('move: ' + i + ' x: ' + evt.touches[i].clientX + ' y: ' + evt.touches[i].clientY);
	    // }
	},

	handleTouchEnd: function(evt) {
		for (var i = 0; i < evt.changedTouches.length; i++){
			var touch = evt.changedTouches[i];
			Touch.asyncTouches[touch.identifier] = {
				x: touch.clientX,
				y: touch.clientY,
				state: 3
			};
		}
	    // if ((new Date()).getTime() - Touch.startTime < 3000) {
		   //  var xDiff = Touch.start.x - Touch.coords.x;
		   //  var yDiff = Touch.start.y - Touch.coords.y;
	    // 	var length = pythag(xDiff, yDiff);
	    // 	console.log(length);
	    // 	if (length > 5) {
		   //      if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
		   //          if (xDiff > 0) {
		   //              /* left swipe */
		   //              Touch.xSwipe = -1;
		   //          } else {
		   //              /* right swipe */
		   //              Touch.xSwipe = 1;
		   //          }
		   //      } else {
		   //          if (yDiff > 0) {
		   //              /* up swipe */
		   //              Touch.ySwipe = -1;
		   //          } else {
		   //              /* down swipe */
		   //              Touch.ySwipe = 1;
		   //          }
		   //      }
		   //  }
		   //  else {
		   //  	Touch.tap = Touch.toGameCoords(Touch.coords);
		   //  	// console.log(Touch.tap);
		   //  	// console.log(Touch.start);
		   //  }
	    // }
	    // else {
	    // 	Touch.coords = null;
	    // }

	    // for (var i = 0; i < evt.touches.length; i++) {
	    // 	console.log('end: ' + i + ' : ' + evt.touches[i].clientX + ' y: ' + evt.touches[i].clientY);
	    // }
	},

	update: function() {
		for (var i in this.asyncTouches){
			if (!copyObject(this.asyncTouches[i]).x)
				debugger;
			this.touches[i] = copyObject(this.asyncTouches[i]);
			if (this.asyncTouches[i].state === 1) {
				this.asyncTouches[i].state = 2;
			}
			if (this.asyncTouches[i].state === 3) {
				this.asyncTouches[i].state = 0;
			}
			// if(nud(nud(Touch.xSwipe,Touch.ySwipe),Touch.tap) !== null) {
			// 	Touch.coords = null;
			// }
			// Touch.xSwipe = null;
			// Touch.ySwipe = null;
			// Touch.tap = null;
		}
	}
}

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
	this.subs = {};
	this.x = x | 0;
	this.y = y | 0;
	this.rotation = 0;
	this.width = 0;
	this.height = 0;
	this.wrapsX = false;
	this.wrapsY = false;
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
	this.movePTP = function (start, end) {
		var thisArrived = false;
		var dx = end.x - this.x;
		var dy = end.y - this.y;
		if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
			var distance = pythag(dx, dy);
			var totalDx = end.x - start.x;
			var totalDy = end.y - start.y;
			var totalDistance = pythag(totalDx, totalDy);
			// var vRatio = Math.min(1, distance/totalDistance + 0.4);
			// vRatio = Math.sqrt(distance/totalDistance);
			// // vRatio *= vRatio;
			// vRatio -= 0.1;
			// var thisAngle = Math.atan2(dy, dx);
			// var speedMult = Math.max(2, vRatio*this.speed/FPS);
			// this.x += speedMult * Math.cos(thisAngle);
			// this.y += speedMult * Math.sin(thisAngle);
			this.x = (totalDx !== 0)?(end.x - Math.max(0, dx/totalDx - 9/FPS)*totalDx):start.x;
			this.y = (totalDy !== 0)?(end.y - Math.max(0, dy/totalDy - 9/FPS)*totalDy):start.y;
		}
		else {
			// this.x = circle.subs.points[this.pointIndex].x;
			// this.y = circle.subs.points[this.pointIndex].y;
			this.x = end.x;
			this.y = end.y;
			thisArrived = true;
			
		}
		return thisArrived;
	}
	this.startTime = frameCount;
}
function Button(anims, x, y, width, height, callback, text) {
	Entity.call(this, anims, x, y, width, height);
	this.callback = callback;
	this.text = text;
}
function PointEntity(anims, x, y, width, height, startPoint, speed) {
	Entity.call(this, anims, x, y, width, height);
	this.pointIndex;
	this.points = [];
	this.pointsToGoTo = [];
	this.netPoints = [];
	this.nextPoint = function() {
		if (this.pointsToGoTo.length <= 0) {
			return;
		}
		this.points.push(this.pointIndex);
		this.netPoints.push(circle.subs.points[this.pointIndex]);
		// this.pointIndex = this.pointsToGoTo.shift();
		var dest = this.pointsToGoTo.shift();
		if (Number.isInteger(dest)) {
			this.setPoint(dest);
		}
		else switch ('' + dest) {
			case 'flip':
				 this.setPoint(circle.getOpposingPoint(this.pointIndex));
				 break;
			case 'across':
				 this.setPoint(this.pointIndex + circle.subs.points.length/2, circle.subs.points.length);
				 this.netPoints = [];
				 break;
		}
	}
	this.getLatestPoint = function() {
		return (this.points.length!==0)?this.points[this.points.length-1]:this.pointIndex;
	}
	this.getNewestPoint = function() {
		return (this.pointsToGoTo.length!==0)?this.pointsToGoTo[this.pointsToGoTo.length-1]:this.pointIndex;
	}
	this.setPoint = function(index) {
		this.pointIndex = modulo(index, circle.subs.points.length);
	}
	this.addPoint = function(index) {
		this.pointsToGoTo.push(modulo(index, circle.subs.points.length));
	}
	this.incrementPoint = function(inc) {
		this.addPoint(this.getNewestPoint() + inc);
	}
	this.jumpPoint = function() {
		this.pointsToGoTo.push('flip');
	}
	this.jumpAcross = function() {
		this.pointsToGoTo.push('across');
	}
	this.travel = function() {
		var firstPoint = circle.subs.points[this.pointIndex];
		if (!firstPoint) debugger;
		var lastPoint = circle.subs.points[this.getLatestPoint()];
		arrived = this.movePTP(lastPoint, firstPoint);
		if (arrived){
			if(this.pointsToGoTo.length !== 0) {
				arrived = false;
				this.nextPoint();
			}
		}
		return arrived;
	}
	this.setPoint(nud(startPoint, 0));
	this.x = nud(x, circle.subs.points[this.pointIndex].x)
	this.y = nud(y, circle.subs.points[this.pointIndex].y)
	this.speed = nud(speed, 4000);
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
	if (entity.length != undefined) {
		entity.map(function(el) {
			draw(context,el,x,y,width,height);
		});
	}
	else {
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
		if (entity.text !== undefined) {
			var fontSize = ~~(entity.height/(entity.text.length + 2));
			entity.context.font = fontSize + "px Courier, monospace";
			entity.context.fillText(entity.text, 0, +fontSize/2);
		}
		if (entity === circle) {
			for (var key in entity.subs) {
				if (key ==="player") {
					// Draw Lines
					circle.context.lineWidth = 10;
					circle.context.lineCap = "round";
					circle.context.lineJoin = "round";
					// Draw Guiding Line
					circle.context.strokeStyle = '#99FF99';
					circle.context.strokeStyle = 'rgba(130, 255, 255, 0.5)';
					circle.context.beginPath();
					var thisPointIndex = player.getNewestPoint();
					var thisPoint = circle.subs.points[thisPointIndex];
					circle.context.moveTo(thisPoint.x, thisPoint.y);
					var nextPoint = circle.subs.points[modulo(circle.getOpposingPoint(thisPointIndex),circle.subs.points.length)];
					circle.context.lineTo((nextPoint.x - thisPoint.x) + thisPoint.x, (nextPoint.y - thisPoint.y) + thisPoint.y);
					circle.context.stroke();
					circle.context.closePath();
					// Draw current net
					circle.context.strokeStyle = '#222222';
					if (player.netPoints.length !== 0) {
						circle.context.beginPath();
						var firstPoint = player.netPoints[0];
					    circle.context.moveTo(firstPoint.x, firstPoint.y);
		
						for (var i = 1; i < player.netPoints.length; i++) {
							var point2 = player.netPoints[i];
							// circle.context.drawLine(point1.x, point1.y, point2.x, point2.y); this.beginPath();
						    circle.context.lineTo(point2.x, point2.y);
						}
						circle.context.lineTo(player.x, player.y);
						circle.context.stroke();
						circle.context.closePath();
					}
					// Draw closed nets
					for (var i = 0; i < player.nets.length; i++) {
						// if (player.nets[i].points.length === 0) {
						// 	player.nets.splice(i, 1);
						// 	i--;
						// 	break;
						// }
						circle.context.beginPath();
						firstPoint = player.nets[i].points[0];
						if (!firstPoint) {
							alert("error");
							console.log("firstPoint isn't real. player.nets[i].points: " + player.nets[i].points + "\n i: " + i);
							continue;
						}
					    circle.context.moveTo(firstPoint[0], firstPoint[1]);
					    for (var j = 1; j < player.nets[i].points.length; j++) {
							var point2 = player.nets[i].points[j];
							// circle.context.drawLine(point1.x, point1.y, point2.x, point2.y); this.beginPath();
						    circle.context.lineTo(point2[0], point2[1]);
						}
						circle.context.lineTo(firstPoint[0], firstPoint[1]);
						circle.context.stroke();
						circle.context.closePath();
					}

				}
				draw(entity.context, entity.subs[key])
			}
		}
		else {

			for (var key in entity.subs) {
				draw(entity.context, entity.subs[key])
			}
		}
		if (!context) debugger;
		context.drawImage(entity.canvas, x - width/2, y - height/2, width, height);
		var newX = x, newY = y;
		var gap = entity.gap;
		if (gap === undefined) gap = game.gap
		if (entity.wrapsX) {
			if (x - entity.width/2 < -context.canvas.width/2) {
				newX = x + context.canvas.width + gap;
					context.drawImage(entity.canvas, newX - entity.width/2, y - entity.height/2, width, height);
			
			}
			if (x + entity.width/2 > context.canvas.width/2) {
				newX = x - context.canvas.width + gap;
					context.drawImage(entity.canvas, newX - entity.width/2, y - entity.height/2, width, height);
			
			}
			if (x !== newX) {
				context.drawImage(entity.canvas, newX - entity.width/2, y - entity.height/2, width, height);
			}
		}
		if (entity.wrapY) {
			if (y - entity.height/2 < -context.canvas.height/2) {
				newY = y + context.canvas.height + gap;
					context.drawImage(entity.canvas, x - entity.width/2, newY - entity.height/2, width, height);
			
			}
			if (y + entity.height/2 > context.canvas.height/2) {
				newY = y - context.canvas.height + gap;
					context.drawImage(entity.canvas, x - entity.width/2, newY - entity.height/2, width, height);
			
			}
			if (y !== newY) {
				context.drawImage(entity.canvas, x - entity.width/2, newY - entity.height/2, width, height);
			}
		}
		if (entity.wrapsX && entity.wrapsY && x !== newX && y !== newY) {
			context.drawImage(entity.canvas, newX - entity.width/2, newY - entity.height/2, width, height);
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
// var mc = new Hammer(window);
// // Default, tap recognizer
// mc.add( new Hammer.Tap() );
// mc.on('tap', Touch.onHammerTap);
window.addEventListener('touchstart', Touch.handleTouchStart, false);
window.addEventListener('touchmove', Touch.handleTouchMove, false);
window.addEventListener('touchend', Touch.handleTouchEnd, false);

$.get("js/layout.js", function() {
	if (Key.layout === "qwerty") {
		Key.CLOCKWISE = 68;
		Key.JUMP = 83;
		Key.ALT_JUMP = 87;
	}
});

// Global variables
var FPS = 30;
var scenes = {
	menu: {},
	game: {}
}
var mainMenu;
var game;
var frameCount = 0;
var frameOffset = false;
var cage;
var player;
var mark;
var circle;
var ground;
var items;
var pointCount = 12;
var pointDistance = 370;

var basicItem = {
	anims: [["res/item00.png"], ["res/player00.png"]],
	val: 1,
	type: 'basic'
}
var coolItem = {
	anims: [["res/item2_00.png"], ["res/player00.png"]],
	val: 5,
	type: 'basic'
}
var transItem = {
	anims: [["res/transitem00.png"]],
	val: 0,
	type: 'effect',
	effect: {
		length: 10*30,
		in: function() {
			player.eatsEdgemies = frameCount + this.length;
		},
		out: function() {
		} 
	}
}
var badItem = {
	anims: [["res/baditem00.png"]],
	val: -1,
	type: 'basic'
}


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
	mainMenu = new Entity(null, null, null, gameWidth, gameHeight);
	scenes.mainMenu = mainMenu;

	startGame();
}
function startGame() {
	scenes.game = new Entity(null, null, null, gameWidth, gameHeight);
	game = scenes.game;
	game.gap = 80;
	circle = new Entity([['res/circle00.png']], 0, 0);
	circle.wrapsX = true;
	circle.wrapsY = true;
	circle.vrotation = 0;
	circle.subs.points = [];
	game.subs.circle = circle;
	circle.subs.points = [];
	for (var i = 0; i < pointCount; i++) {
		var angle = i*2*Math.PI/pointCount;
		// circle.subs['point' + i] = new Entity([['res/point00.png']],
			// pointDistance*Math.cos(angle), pointDistance*Math.sin(angle));
		circle.subs.points.push(new Entity([['res/point00.png']],
			pointDistance*Math.cos(angle), pointDistance*Math.sin(angle)));
	}
	items = [];
	circle.subs.items = items;
	edgemies = []; // Edge enemies
	circle.subs.edgemies = edgemies;
	circle.currentRotation = 0;
	circle.rotationsToDo = [];
	circle.getOpposingPoint = function(index) {
		var reflectAngle = modulo(-circle.rotation, 2*Math.PI);
		var reflectAngleR = modulo(reflectAngle + Math.PI, 2*Math.PI);
		var radsPerPoint = 2*Math.PI/circle.subs.points.length;	
		var pointAngle = index*radsPerPoint;
		var diff = modulo(pointAngle - reflectAngle, 2*Math.PI);
		var diffR = modulo(pointAngle - reflectAngleR, 2*Math.PI);
		if (Math.abs(2*Math.PI - diff) < 0.005 || Math.abs(2*Math.PI - diffR) < 0.005 ||
			Math.abs(diff) < 0.005 || Math.abs(diffR) < 0.005) {
			return index + circle.subs.points.length/2;
		}
		else {
			return index - Math.round(2*(pointAngle - reflectAngle)/radsPerPoint);
		}
	}
	ground = new Entity([['res/ground00.png']], 600, 610);
	ground.wrapsX = true;
	ground.gap = 0;
	game.subs.ground = ground;
	var playerStartPoint = ~~(Math.random() * circle.subs.points.length);
	player = new PointEntity([['res/player00.png']], null, null, null, null, playerStartPoint, 4000);
	game.subs.circle.subs.player = player;
	player.netPoints = [];
	player.nets = [];
	player.tempScore = 0;
	player.score = 0;
	player.setTempScore = function(newScore) {
		player.tempScore = newScore;
		player.score = Math.max(player.tempScore, player.score);
	}
	player.incTempScore = function(inc) {
		player.setTempScore(player.tempScore + inc);
	}
	player.eatsEdgemies = 0;
	
	cage = new Entity([['res/cage00.jpg']], 0, 0/*, 80, 80*/);
	cage.wrapsX = true;
	cage.wrapsY = true;
	// game.subs.cage = cage;
	cage.vx = 0;
	cage.vy = 0;
	mark = new Entity([['res/player00.png']]);
	// circle.subs.mark = mark;

	runGame();
}
function runGame() {
	// Start benchmark
	var startMs = ~~(new Date());

	// Make touch work
	Touch.update();

	// Movement
	var circleRotation = 0;
	var touchJump = false, touchRotate = 0, touchAcross = false;
	for (var i in Touch.touches) {
		var touch = Touch.touches[i];
		var coords = Touch.toGameCoords(touch);
		switch (touch.state) {
			case 1: // just pressed
				if (coords.x < 0) {
					if (coords.y < 0) {
						touchRotate++;
					}
					else {
						touchRotate--;
					}
				}
				else {
					touchJump = true;
				}
				break;
			case 2: // still pressed
				if (coords.x < 0 && circle.rotationsToDo.length === 0 && circle.currentRotation === 0) {
					if (coords.y < 0) {
						touchRotate++;
					}
					else {
						touchRotate--;
					}
				}
				break;
			case 3: // just released
				break;
			default: // not pressed
				break;
		}
	}

	// var tap = Touch.getTap();
	// var xSwipe = Touch.getXSwipe();
	// var ySwipe = Touch.getYSwipe();
	// var touchCoords = Touch.getCoords()
	if (Key.getState(Key.JUMP) === 1 || Key.getState(Key.ALT_JUMP) === 1 || touchJump) {
		// player.incrementPoint(-1);
		player.jumpPoint();
	}
	if (Key.getState(Key.JUMP_ACROSS) === 1) {
		// player.incrementPoint(-1);
		player.jumpAcross();
	}
	// if (tap)debugger;
	if (Key.getState(Key.CLOCKWISE) === 1 || touchRotate > 0 || 
		(Key.getState(Key.CLOCKWISE) === 2 && 
			circle.rotationsToDo.length === 0 && circle.currentRotation === 0)) {
		// circle.vrotation += Math.PI/circle.subs.points.length;
		circle.rotationsToDo.push(1);
	}
	if (Key.getState(Key.WIDDERSHINS) === 1 || touchRotate < 0 || 
		(Key.getState(Key.WIDDERSHINS) === 2 && 
			circle.rotationsToDo.length === 0 && circle.currentRotation === 0)) {
		// circle.vrotation -= Math.PI/circle.subs.points.length;
		circle.rotationsToDo.push(-1);
	}

	if (Key.getState(Key.CAGE) === 1 || Key.secret.indexOf('CAGE') !== -1) {
		if (!game.subs.cage) {
			game.subs.cage = cage;
		}
		else {
			delete game.subs['cage'];
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
	// circle.subs.points = [];
	// for (var i = 0; i < pointCount; i++) {
	// 	var angle = i*2*Math.PI/pointCount;
	// 	circle.subs['point' + i] = new Entity([['res/point00.png']],
	// 		370*Math.cos(angle), 370*Math.sin(angle));
	// 	circle.subs.points.push(circle.subs['point' + i]);
	// }

	// Cage movement
	cage.x += cage.vx/FPS;
	cage.y += cage.vy/FPS;
	var offx = gameWidth + game.gap;
	var offy = gameHeight + game.gap;
	// cage.x = (((cage.x + offx/2)% offx)+offx)%offx -offx/2;
	// cage.y = (((cage.y + offy/2)% offy)+offy)%offy -offy/2;
	cage.x = modulo(cage.x + offx/2, offx) - offx/2;
	cage.y = modulo(cage.y + offy/2, offy) - offy/2;


	// Player movement
	var playerArrived = player.travel();
	// Erase net if backtracking
	if (!playerArrived) {
		if (circle.subs.points[player.pointIndex] === player.netPoints[player.netPoints.length-2]) {
			player.netPoints.pop();
		}
	}
	else {
		if (circle.subs.points[player.pointIndex] === player.netPoints[player.netPoints.length-1]) {
			player.netPoints.pop();
		}
	}

	// Spawn items
	if (Math.random() < 0.4/FPS) {
		potentialItems = [basicItem];
		if (Math.random() < 0.075) {
			potentialItems.push(coolItem);
		}
		if (Math.random() < 0.1) {
			potentialItems.push(transItem);
		}
		if (Math.random() < 0.5 + Math.min(frameCount/(30*5*60*2), 0.5)) {
			potentialItems.push(badItem);
		}
		var chosenItem = choose(potentialItems);
		var angle = Math.random()*2*Math.PI;
		var dist = Math.random()*pointDistance*Math.cos(Math.PI/circle.subs.points.length);
		var newItem = new Entity(chosenItem.anims,
			dist*Math.cos(angle), dist*Math.sin(angle));
		newItem.type = chosenItem.type;
		switch (newItem.type) {
			case 'effect':
				newItem.effect = chosenItem.effect;
				break;
			default:
		}
		newItem.lifeTime = 5*30;
		newItem.val = chosenItem.val;
		items.push(newItem);
	}

	// Spawn edgemies
	if (/*frameCount/30 > 30 &&*/ Math.random() < 0.15/FPS) {
		// Choose random spawn point index that isn't where the player is
		var startPoint = ~~(Math.random()*(circle.subs.points.length-1))+player.pointIndex+1;
		var newEdgemy = new PointEntity([['res/edgemy00.png']], null, null, null, null, startPoint);
		newEdgemy.type = 'basic';
		newEdgemy.lifeTime = 4*30/* + frameCount/60*/;
		// console.log(newEdgemy.lifeTime/30);
		newEdgemy.lastMove = newEdgemy.startTime;
		newEdgemy.val = 3;
		edgemies.push(newEdgemy);
	}

	// Update items
	for (var i = items.length-1; i >= 0; i--) {
		if (frameCount - items[i].startTime > items[i].lifeTime) {
			items.splice(i, 1);
			continue;
		}
	}

	// Update edgemies
	for (var i = edgemies.length-1; i >= 0; i--) {
		var age = frameCount - edgemies[i].startTime;
		if (age > edgemies[i].lifeTime) {
			edgemies.splice(i, 1);
			continue;
		}
		if (frameCount - edgemies[i].lastMove >= 30) {
			var newPoint
			edgemies[i].incrementPoint(~~(Math.random()*2)*2 - 1); // increment by 1 or -1
			edgemies[i].lastMove = frameCount;
		}
		var arrived = edgemies[i].travel();
		if (edgemies[i].pointIndex === player.pointIndex && playerArrived && arrived) {
			if (player.eatsEdgemies > frameCount) {
				player.incTempScore(edgemies[i].val);
			}
			else {
				player.incTempScore(-edgemies[i].val);
			}
			edgemies.splice(i, 1);
			continue;
		}
	}

	// Move lines into proper places
	for (var i = 0; i < player.netPoints.length; i++) {
		var point = player.netPoints[i];
		if (circle.subs.points.indexOf(point) === -1) {
			var lineSpeed = 1200;
			var dist = pythag(point.x, point.y);
			var dest1 = {
				x: player.x,
				y: player.y
			}
			var dest2 = {
				x: player.x,
				y: player.y
			}
			if (i > 0) {
				dest1.x = player.netPoints[i-1].x;
				dest1.y = player.netPoints[i-1].y;
			}
			if (i+1 < player.netPoints.length) {
				dest2.x = player.netPoints[i+1].x;
				dest2.y = player.netPoints[i+1].y;
			}
			var dest = {
				x: (dest1.x + dest2.x)/2,
				y: (dest1.y + dest2.y)/2,
			}

			if (Math.abs(dest.x-point.x) <= lineSpeed/FPS && Math.abs(dest.y-point.y) <= lineSpeed/FPS) {
				player.netPoints.splice(i, 1);
				i--;
			}
			else {
				// var dest = {
				// 	x: (dist + 120/FPS)*Math.cos(angle),
				// 	y: (dist + 120/FPS)*Math.sin(angle)
				// }

				var angle = Math.atan2(dest.y-point.y, dest.x-point.x);
				player.netPoints[i].x += (lineSpeed/FPS)*Math.cos(angle);
				player.netPoints[i].y += (lineSpeed/FPS)*Math.sin(angle);
				// var dx = playerPoint.x - player.x;
				// var dy = playerPoint.y - player.y;
			}
		}
	}

	// Detect and separate closed nets
	if (player.netPoints.length !== 0) {
		for (var i = player.netPoints.length-3; i >= 0; i--) {
			var closed = false;
			var playerIncluded = false;
			for (var j = i + 1; j < player.netPoints.length + 1; j++) {
				var startNet = [];
				var endNet = [];
				// Player 
				if (j === player.netPoints.length) {
					if (player.netPoints[i] === circle.subs.points[player.pointIndex] && playerArrived) {
						startNet.push(i+1);
						endNet.push(player.netPoints.length);
						closed = true;
						playerIncluded = true;
					}
				}
				else {
					if (player.netPoints[i] === player.netPoints[j]) {
						startNet = i;
						endNet = j;
						closed = true;
					}
				}
				// Lines crossing
				var intersection;
				if (j > i + 1 && j < player.netPoints.length && !closed) {
					var p1 = player.netPoints[i];
					var p2 = player.netPoints[i+1];
					var p3 = player.netPoints[j];
					var p4 = 0;
					if (j + 1 < player.netPoints.length) {
						p4 = player.netPoints[j+1];
					}
					else if (j < player.netPoints.length) {
						// if (!playerArrived) break;
						p4 = {
							x: player.x,
							y: player.y
						};
					}
					// if (p1 > p2) {
					// 	var tempP = p2;
					// 	p2 = p1;
					// 	p1 = tempP;
					// }
					// // console.log('p1: ' + p1 + ', p2: ' + p2 + ', p3: ' + p3 + ', p4: ' + p4);
					// if (p3 > p1 && p3 < p2) {
					// 	if (!(p4 > p1 && p4 < p2)) {
					// 		closed = true;
					// 	}
					// }
					// else {
					// 	if (p4 > p1 && p4 < p2) {
					// 		closed = true;
					// 	}
					// }
					intersection = intersects(p1, p2, p3, p4);
					if (intersection) {
						closed = true;
						// startNet = Math.max(player.netPoints.lastIndexOf();
						startNet.push(i + 1);
						endNet.push(Math.min(player.netPoints.length, j + 1));
						mark.x = intersection.x;
						mark.y = intersection.y;
					}

				}
				if (closed) {
					// var player.netPoints.splice(startNet, endNet).map(function(key) {
					// 	return [circle.subs.points[key].x, circle.subs.points[key].y];
					// });
					var net = player.netPoints.splice(startNet[0], endNet[0]-startNet[0]);
					if (intersection) {
						player.netPoints.push(intersection);
						net.push(copyObject(intersection));
					}
					if (playerIncluded) {
						net.push({x:player.x, y:player.y});
					}
					// Collect items inside net
					var netItems = [];
					for (var k = items.length-1; k >= 0; k--) {
						if (insidePolygon(items[k].x, items[k].y, net)) {
							items[k].lifeTime = undefined;
							// player.tempScore++;
							netItems.push(items[k]);
							// items[k].currentAnimation = 1;
							// items.splice(k,1);
						}
					}

					player.nets.push({items: netItems, points:toCoords(net)});
					break;
				}		
			}
		}
	}

	// Collapse closed nets
	for (var i = 0; i < player.nets.length; i++) {
		var scaleFactor = 3;
		var maxX = 0;
		var maxY = 0;
		var avgX = 0;
		var avgY = 0;
		for (var j = 0; j < player.nets[i].points.length; j++) {
			avgX += player.nets[i].points[j][0];
			avgY += player.nets[i].points[j][1];
		}
		avgX /= player.nets[i].points.length;
		avgY /= player.nets[i].points.length;
		for (var j = 0; j < player.nets[i].points.length; j++) {
			maxX = Math.max(maxX, Math.abs(avgX - player.nets[i].points[j][0]));
			maxY = Math.max(maxY, Math.abs(avgY - player.nets[i].points[j][1]));
		}
		// if net is small enough to disappear
		if (maxX < 1 && maxY < 1) {
			// Deal with collected items
			for (var j in player.nets[i].items) {
				var item = player.nets[i].items[j];
				player.incTempScore(item.val);
				switch (item.type) {
					case 'effect':
						item.effect.in();
						setTimeout(item.effect.out, item.effect.length*1000/30)
						break;
					default:
				}
				var index = items.indexOf(player.nets[i].items[j]);
				items.splice(index, 1);
			}
			player.nets[i].items = [];
			player.nets.splice(i, 1);
			i--;
			break;
		}

		scaleFactor *= Math.min(pointDistance/pythag(maxX,maxY),16)/FPS;
		// Translate, scale about new center, translate back
		player.nets[i].points = scaleCoords(player.nets[i].points, scaleFactor, avgX, avgY);
		var itemCoords = toCoords(player.nets[i].items);
		for (var j = 0; j < itemCoords.length; j++) {
			if (!insidePolygon(itemCoords[j][0], itemCoords[j][1], player.nets[i].points)){
				var newCoords = scaleCoords([itemCoords[j]], scaleFactor, avgX, avgY);
				player.nets[i].items[j].x = newCoords[0][0];
				player.nets[i].items[j].y = newCoords[0][1];
			}
		}
	}

	// Circle Rotation
	var radsPerPoint = Math.PI/circle.subs.points.length;
	var rotation = 12/FPS;

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
		var radRotation = (Math.PI/circle.subs.points.length)*rotation;
		circle.rotation += radRotation;
		// player.rotation -= radRotation;
		circle.currentRotation -= rotation;
		cage.context.rotate(-rotation);
	}
	for (var it in circle.subs.items) {
		var item = circle.subs.items[it];
		item.rotation = -circle.rotation;
		item.context.setRotation(item.rotation);
	}
	for (var it in circle.subs.edgemies) {
		var edgemy = circle.subs.edgemies[it];
		edgemy.rotation = -circle.rotation;
		edgemy.context.setRotation(edgemy.rotation);
	}
	circle.context.setRotation(circle.rotation);
	player.rotation = -circle.rotation;
	player.context.setRotation(player.rotation);
	ground.x = -circle.rotation*300;
	ground.x = modulo(ground.x + gameWidth/2, gameWidth) - gameWidth/2;

	// Render

	gameContext.clearRect(-gameCanvas[0].width/2, -gameCanvas[0].height/2,
		gameCanvas[0].width, gameCanvas[0].height);
	// gameContext.clearRect(0, 0,
	// 	gameCanvas[0].width, gameCanvas[0].height);
	// gameContext.clearRect(-gameCanvas[0].width, -gameCanvas[0].height, 0, 0);
	// for (var key in game) {
	// 	draw(gameContext, game[key])
	// }
	draw(gameContext, game);
	var fontSize = 40;
	setCookie("highScore", Math.max(getCookie("highScore"), player.score));
	gameContext.font = fontSize + "px Georgia";
	gameContext.fillText("High Score: " + getCookie("highScore"), -gameWidth/2 + 20, -gameHeight/2 + fontSize + 10);
	gameContext.fillText("Score: " + player.score, -gameWidth/2 + 20, -gameHeight/2 + 2*fontSize + 20);
	gameContext.fillText("Temp Score: " + player.tempScore, -gameWidth/2 + 20, -gameHeight/2 + 3*fontSize + 30);
	// gameContext.fillText("Seconds: " + (frameCount/30).toFixed(2), -gameWidth/2 + 20, -gameHeight/2 + 4*fontSize + 30);
	gameContext.fillText("Eats: " + Math.max(0, player.eatsEdgemies - frameCount), gameWidth/2 - 200, -gameHeight/2 + fontSize + 30);

	// draw(gameContext, new Entity([['res/joe_pass.jpg']], 44, 44));
	// draw(gameContext, new Entity([['res/mystery_font.jpeg']], 0, 0), 0, 0, pw, 222);
	// draw(gameContext, game.subs.cage);

	// Make key presses work
	Key.updateStates();

	// console.log(frameCount);
	// Set timer for next frame
	var loopLengthMs = ~~(new Date()) - startMs;
	// if (loopLengthMs > 700/FPS) console.log('Loop duration: ' + loopLengthMs + 'ms');
	var FPSMult = 0;
	if (loopLengthMs > 900/FPS) FPS = 30;
	if (loopLengthMs < 400/FPS) FPS = 60;

	// Increment frameCount which counts the number of frames at 30 FPS
	// Frames at 60 FPS count for 0.5 frames
	frameCount += 30/FPS;

	// Temporarily adjust frameCount to be an integer when switching to 30 FPS
	// and adjust it back when switching back
	if (FPS === 30) {
		if (frameCount !== ~~(frameCount)) {
			frameCount = ~~(frameCount);
			frameOffset = true;
		}
	}
	else if (frameOffset) {
		frameCount += 0.5;
		frameOffset = false;
	}

	var timeoutMs = Math.max(1000/FPS - loopLengthMs, 0);
	setTimeout(runGame,  timeoutMs);
	// setTimeout(runGame,  100);
}


