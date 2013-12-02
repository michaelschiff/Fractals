//setup the canvas
var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");
var imgData = c.createImageData(500, 500);
var pixels = imgData.data;

//setup the callbacks. need to know about canvas and and fractal fn
var handlers = new callbacks(canvas, mandelbrot);
canvas.addEventListener('mousedown', handlers.onClick);
canvas.addEventListener('mousemove', handlers.onDrag);
canvas.addEventListener('mouseup', handlers.onUp);

//set zoom and draw initial image
var zoom = 1000;
var center_x = -500;
var center_y = 0;
draw(mandelbrot, zoom, center_x, center_y);

//draws the escape image of f, centered on (cx,cy), at zoom scale. 
function draw(f, zoom, cx, cy) {
    for (var x = 0; x < 500; x++) {
		var x0 = x-250;
        for (var y = 0; y < 500; y++) {
		    var y0 = y-250;
            var iters = f((x0+cx)/zoom,(y0+cy)/zoom);
            color(x,y, 0, 255-iters, iters, 255);
        }
    }
    c.putImageData(imgData, 0,0);
}

//colors a pixel
function color(x, y, r, g, b, a) {
    index = (x + y * 500) * 4;
    pixels[index+0] = r;
    pixels[index+1] = g;
    pixels[index+2] = b;
    pixels[index+3] = a;
}

//fractal fn
function mandelbrot(px,py) {
    var x = 0;
    var y = 0;
    var iteration = 0;
    var max_iteration = 255;
    while ( x*x + y*y < 2*2 && iteration < max_iteration ) {
        var xtemp = x*x - y*y + px;
        y = 2*x*y + py;
        x = xtemp;
        iteration = iteration + 1;
    }
    return iteration;
}

//callbacks for dragging around the image
function callbacks(canvas, fn) {
	
	this.ox = null;
	this.oy = null;
	this.cx = 0;
	this.cy = 0;
	this.clicked = false;
	
	this.onClick = function(event) {
		this.clicked = true;
		this.ox = event.clientX;
		this.oy = event.clientY;
	};
	
	this.onDrag = function(event) {
		if (this.clicked) {
			this.cx = event.clientX - this.ox;
			this.cy = event.clientY - this.oy;
			draw(fn, zoom, center_x-this.cx, center_y-this.cy);
		}
	};
	
	this.onUp = function(event) {
		this.clicked = false;
		center_x -= this.cx;
		center_y -= this.cy;
	};
}