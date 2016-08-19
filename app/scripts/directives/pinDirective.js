
app.directive('pin', function($window, $rootScope) {
    return {
        restrict    : 'AE',
        scope: '@',
        templateUrl : '../views/directives/pin.html',
        link: function( scope, element ) {
        }
    };
});
