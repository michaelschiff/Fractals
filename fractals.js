//setup the canvas
var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");
var imgData = c.createImageData(500, 500);
var pixels = imgData.data;

//set zoom and draw initial image
var zoom = 890000;
var center_x = -0.747;
var center_y = .0995;
draw(mandelbrot, zoom, center_x, center_y);

//draws the escape image of f at zoom scale, centered on (cx,cy).
//The fractal never actually moves, (cx,cy) is the complex number
//that our center pixel corresponds to.  modifying center values 
//shifts around our window into the complex plane.
function draw(f, zoom, cx, cy) {
    for (var x = 0; x < 500; x++) {
		var x0 = x-250;
        for (var y = 0; y < 500; y++) {
		    var y0 = 250-y;
            var iters = f((x0/zoom)+cx,(y0/zoom)+cy);
            color(x,y, (50+iters*9)%255, (175+iters*23)%255, (200+iters*37)%255, 255);
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
