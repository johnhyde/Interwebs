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
	image,
	width,
	height
}
