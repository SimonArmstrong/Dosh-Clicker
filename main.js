{ 	// Timing stuff

	var startFrameMilliseconds = performance.now();
	var endFrameMilliseconds = performance.now();
	
	function getDeltaTime()
	{
		endFrameMilliseconds = startFrameMilliseconds;
		startFrameMilliseconds = performance.now();
		
		var deltaTime = (startFrameMilliseconds - endFrameMilliseconds) * 0.001;
		
		if(deltaTime > 1)
		{
			deltaTime = 1;
		}
		
		return deltaTime;
	}

	function WaitForSeconds(seconds, deltaTime)
	{
		return seconds -= deltaTime;
	}
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var Vector2 = function(x, y)
{
	this.x = x;
	this.y = y;
	
	this.length = Math.sqrt(x*x + y*y);
}

Vector2.prototype.add = function(vec){
	return new Vector2(this.x + vec.x, this.y + vec.y);
}
Vector2.prototype.subtract = function(vec){
	return new Vector2(this.x - vec.x, this.y - vec.y);
}
Vector2.prototype.multiply = function(vec){
	return new Vector2(this.x * vec.x, this.y * vec.y);
}
Vector2.prototype.divide = function(vec){
	return new Vector2(this.x / vec.x, this.y / vec.y);
}
Vector2.prototype.multiplyScalar = function(val){
	return new Vector2(this.x * val, this.y * val);
}
Vector2.prototype.normalize = function(){
	return new Vector2(this.x / this.length, this.y / this.length);
}
Vector2.prototype.toString = function(){
	return "(X: " + Math.round(this.x) + ", Y: " + Math.round(this.y) + ")";
}

var Game = {
	dosh : 0,
	doshPerSecond : 0,
	doshPerScroll : 0.01
};

var Button = function(title)
{
	this.title = title;
	this.callFunc = null;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.cost = 25;
	this.level = 0;
}

Button.prototype.draw = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width + context.measureText(this.title).width;
	this.height = height;
	context.fillStyle = "#000";
	context.fillRect(x, y, width + context.measureText(this.title).width, height);
	context.fillStyle = "#fff";
	context.font = "16px Lucida Console";
	context.fillText(this.title, x + 5, y + height - 5);
	context.fillStyle = "#000";
	context.fillText("$" + this.cost.toFixed(2), x + this.width + 5, y + height - 5);
	context.fillText("LV. " + this.level, x + this.width + 100, y + height - 5);
}

var button_moreDoshPerScroll = new Button("Efficiency"); 
var button_moreDoshPerSecond = new Button("Helper");
var button_blank = new Button("");
button_moreDoshPerScroll.cost = 25;
button_moreDoshPerSecond.cost = 10;
var buttons = [];


var Menu = function(name)
{
	this.name = name;
}

Menu.prototype.show = function(state)
{
	if(state)
	{
		button_moreDoshPerScroll.draw(10, 10, 10, 20);
		button_moreDoshPerSecond.draw(10, 32, 10, 20);	
		button_blank.draw(10, 54, 10, 20);	
		buttons.push(button_moreDoshPerScroll);
		buttons.push(button_moreDoshPerSecond);
		buttons.push(button_blank);
	}
}

var shop = new Menu("Shop");

function OnMouseScroll(e)
{
	Game.dosh += Game.doshPerScroll;
}
window.addEventListener('mousewheel', OnMouseScroll);


var show = true;
function OnKeyDown(e)
{
	if(e.keyCode === 73)
	{
		show = !show;
	}
}
window.addEventListener('keydown', OnKeyDown);

var mousePosition = new Vector2(0, 0);

function MousePosition(e)
{
	mousePosition = new Vector2(e.clientX, e.clientY);
	//console.log("(" + e.clientX +", " + e.clientY + ")");
}
window.addEventListener('mousemove', MousePosition);

var mouseDown = false;

function OnMouseDown(e)
{
	mouseDown = true;
	if(mouseDown)
	{
		for(var i = 0; i <= buttons.length - 1; i++)
		{
			if(mousePosition.x >= buttons[i].x && 
			   mousePosition.x <= buttons[i].x + buttons[i].width && 
			   mousePosition.y >= buttons[i].y - 5 && 
			   mousePosition.y <= buttons[i].y + buttons[i].height + 5)
			{
				if(buttons[i].cost <= Game.dosh)
				{
					
					Game.dosh -= buttons[i].cost;
					buttons[i].level += 1;
					buttons[i].cost += (1.1 * buttons[i].level);
					
					if(buttons[i].title === "Efficiency")
					{
						Game.doshPerScroll += 0.3 * Game.doshPerScroll;
						break;
					}
					if(buttons[i].title === "Helper")
					{
						Game.doshPerSecond += 1;
						break;
					}
				}				
			}
		}
	}
	mouseDown = false;
}
window.addEventListener('mousedown', OnMouseDown);

function OnMouseUp(e)
{
	mouseDown = false;
}
window.addEventListener('mouseup', OnMouseUp);

function Run()	//Called once every frame
{
	var deltaTime = getDeltaTime();
	document.title = "$" + Game.dosh.toFixed(2);
	context.fillStyle = "#fff";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#000";
	context.fillText("Dosh Per Scroll: " + Game.doshPerScroll, 280, 25);
	context.fillText("Dosh Per Second: " + Game.doshPerSecond, 280, 47);
	context.fillStyle = "#000";
	context.font = "16px Lucida Console";
	context.fillText("$" + Game.dosh.toFixed(2), 10, 88);
	
	shop.show(show);
	
	Game.dosh += Game.doshPerSecond * deltaTime;
}

{	//Update frames
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
	}
	)();
	window.onEachFrame(Run);
}