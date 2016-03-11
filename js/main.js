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
	width = width || entity.width;
	height = height || entity.height;
	// context.drawImage(getImageFromEntity(entity), (x | entity.x), (y | entity.y),
	//  (width | entity.width), (height | entity.height));
	context.drawImage(getImageFromEntity(entity), x, y, width, height);
}
// Setup stuffs

var gameCanvas = $('<canvas id=gameCanvas>');
$('#gamePane').append(gameCanvas);
var gameContext = gameCanvas[0].getContext('2d');
$('#gamePane').resize(function() {
	gameCanvas.attr('width', $('#gamePane').width());
	gameCanvas.attr('height', $('#gamePane').height());
});
gameCanvas.attr('width', $('#gamePane').width());
gameCanvas.attr('height', $('#gamePane').height());

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
	draw(gameContext, newEntity([['res/joe_pass.jpg']], 0, 0), 44, 44);
	draw(gameContext, newEntity([['res/cage.jpg']], 0, 0), 44, 44);
	draw(gameContext, newEntity([['res/mystery_font.jpeg']], 0, 0), 0, 0, 22, 222);
}


