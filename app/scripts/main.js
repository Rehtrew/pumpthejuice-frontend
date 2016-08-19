/**
 * Created by christianwerther on 17/02/15.
 */




var app = angular.module('ptj', ['ngSanitize', 'angularLazyImg']).run(function ($rootScope) {
    $rootScope.Modernizr = Modernizr;
}).constant("Modernizr", Modernizr).config(['lazyImgConfigProvider', function(lazyImgConfigProvider){
    var scrollable = document.getElementsByTagName('main')[0];
    lazyImgConfigProvider.setOptions({
        offset: 0, // how early you want to load image (default = 100)
        errorClass: 'error', // in case of loading image failure what class should be added (default = null)
        successClass: 'success', // in case of loading image success what class should be added (default = null)
        // onError: function(image){}, // function fired on loading error
        // onSuccess: function(image){}, // function fired on loading success
        container: angular.element(scrollable) // if scrollable container is not $window then provide it here
    });
}]);
