
app.directive('backgroundMove', function($window) {
    return {
        restrict    : 'A',
        scope: {
            grayscale: '@'
        },
        link: function( scope, element ) {
            var tag = element[0].tagName.toLowerCase();


            var insertStyle = function (y) {
                var style = "<style>" + tag + ":after{" +
                    "background-position : center " + y + "px ;"
                    "}" +
                    "</style>";

                return style;
            };


            element.on('mousemove', function (e) {

                var y = e.clientY / 40;
                var half = -($window.innerHeight / 2);

                var styles = document.getElementsByTagName('style')[0];
                    styles.parentNode.removeChild(styles);
                angular.element(document.getElementsByTagName('head')).append(insertStyle(y + half));
            });
        }
    };
});
