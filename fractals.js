var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");
var imgData = c.createImageData(500, 500);
var pixels = imgData.data;


draw(mandelbrot, 250, 0, 0);

function draw(f, zoom, cx, cy) {
    for (var x = 0; x < 500; x++) {
		var x0 = x-250;
        for (var y = 0; y < 500; y++) {
		    var y0 = y-250;
            var iters = f((x0+cx)/zoom,(y0+cy)/zoom);
            color(x,y, 0, iters, 0, 255);
        }
    }
    c.putImageData(imgData, 0,0);
}

function color(x, y, r, g, b, a) {
    index = (x + y * 500) * 4;
    pixels[index+0] = r;
    pixels[index+1] = g;
    pixels[index+2] = b;
    pixels[index+3] = a;
}

var callbacks = {
	ox:null,
	oy:null,
	clicked: false,
	onClick: function(canvas, event) {
	//sets initial click value	
	},
	onDrag: function(canvas, event) {
	//determines move and updates drawing with new center nudges
	},
	onUp: function(canvas, event) {
	//stop stuff
	}
};

function mandelbrot(px,py) {
    var x = 0;
    var y = 0;
    var iteration = 0;
    var max_iteration = 1000;
    while ( x*x + y*y < 2*2 && iteration < max_iteration ) {
        var xtemp = x*x - y*y + px;
        y = 2*x*y + py;
        x = xtemp;
        iteration = iteration + 1;
    }
    return iteration;
}