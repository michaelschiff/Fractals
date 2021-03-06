angular.module('fractal-viewer', [])
.directive('fractal', function() {
     return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function($scope, $element, $attrs) {
            console.log("directive controller laoded");
            $scope.zoom = 250;
            $scope.zoom_scale = 2;
            $scope.center_x = -.5;
            $scope.center_y = 0;

            $element[0].addEventListener("mousedown", function (evt) {
                var clickx = (evt.clientX - $element[0].offsetLeft) - 250;
                var clicky = 250 - (evt.clientY - $element[0].offsetTop);
                $scope.center_x = $scope.center_x + (clickx/$scope.zoom);
                $scope.center_y = $scope.center_y + (clicky/$scope.zoom);
                $scope.zoom = $scope.zoom * $scope.zoom_scale;
            });

        },
        template: '<canvas ng-click="click()"></canvas>',
        replace:true,
        link: function(scope, element, attrs) {
            console.log("directive link loaded");
            var canvas = element[0];
            var c = canvas.getContext("2d");
            var imgData = c.createImageData(500, 500);
            var pixels = imgData.data;

            c.font = "bold 12px sans-serif";
            c.textBaseline = "bottom";
            c.textAlign = "right";

            draw(mandelbrot, scope.zoom, scope.center_x, scope.center_y);
            c.fillText("center: "+scope.center_x+"+"+scope.center_y+"i", 475, 575);

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
                        color(x,y, (50+iters*3)%255, (175+iters*30)%255, (200+iters*100)%255, 255);
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
                var x = px;
                var y = py;
                var iteration = 0;
                var max_iteration = 255;
                while ( (x*x + y*y) < 6 && iteration < max_iteration ) {
                    var xtemp = x*x - y*y + 0.8;
                    y = 2*x*y + 0.8;  
                    x = xtemp;
                    iteration = iteration + 1;
                }
                return iteration;
            }
            
            function refresh() {
                console.log("refresh");
                draw(mandelbrot, scope.zoom, scope.center_x, scope.center_y); 
                c.fillText("center: "+scope.center_x+"+"+scope.center_y+"i", 475, 475);
            }
            scope.$watch('zoom', refresh);
            scope.$watch('center_x', refresh);
            scope.$watch('center_y', refresh);
        }
     };
});
