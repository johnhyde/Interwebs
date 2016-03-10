// Define "objects" (I don't really know what I'm doing)
var entity = {
	animations: [],
	currentAnimation,
	x,
	y,
	width,
	height
}
var animation = {
	frames: [],
	currentframe,
	type: "loop", // loop | loopRev | once | onceRev | pong | pongRev
	width,
	height
}
var frame = {
	src,
	image,
	width,
	height
}
function copyJson(json) {
	return JSON.parse(JSON.stringify(json));
}
function newFrame(src) {
	var newFrame = copyJson(frame);
	newFrame.src = src;
	newFrame.image = $('<img src=' + src + '>');
	newFrame.image.onload = function() {
		newFrame.width = newFrame.image.getWidth();
		newFrame.height = newFrame.image.getHeight();
	}
	return newFrame;
}
function newAnimation(srcs) {
	for (var i = 0; i < srcs.length; i++) {
		frames.push(newFrame(srcs[i]));
	}
}