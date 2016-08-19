function chunkify(a, n, balanced) {

    if (n < 2)
        return [a];

    var len = a.length,
        out = [],
        i = 0,
        size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));

    }

    return out;
}

app.controller('appCtrl', function ($scope, $http, $sce, $q, $window, $timeout, $rootScope, Modernizr) {

    var w = angular.element($window);
    var m = angular.element(document.getElementsByTagName('main'));
    var card = angular.element(document.getElementsByClassName('card')[0]);

    var modalHolder = document.getElementsByClassName('modal')[0];
    var modal = angular.element(document.getElementsByClassName('modal__content')[0])[0];
    var backdrop = document.getElementsByClassName('modal__backdrop')[0];




    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };
    $scope.trustSrcHtml = function(src) {
        return $sce.trustAsHtml(src);
    };

    $scope.board = 'urban-gardening';

    //$http.jsonp('https://api.pinterest.com/v3/pidgets/users/rehtrew/pins/?callback=JSON_CALLBACK')
    // var _pins = $http.jsonp('http://widgets.pinterest.com/v3/pidgets/boards/rehtrew/' + $scope.board +'/pins/?callback=JSON_CALLBACK'),
    var _pins = $http.jsonp('https://api.pinterest.com/v3/pidgets/users/rehtrew/pins?limit=80&callback=JSON_CALLBACK'),
        _instant = $http.jsonp('https://api.instagram.com/v1/users/self/media/recent/?access_token=5095088.1677ed0.8b28158f0ad44623b1f1b412c693d62f&callback=JSON_CALLBACK'),
        _dribbles = $http.get('https://api.dribbble.com/v1/users/rehtrew/shots?access_token=2e97b7de5d77b0f2823ce44bc3195cde15871e0656fb2a749b8f3990aeb86388');

    var _requests = new Array(_pins, _instant, _dribbles);

    $scope.width = $window.innerWidth;
    $scope.columns = 0;
    $rootScope.modal = {
        visible : false,
        cords   : {
            top : 0,
            left : 0,
            width : 0
        },
        data : null
    };

    m.bind('scroll', function () {
        // m[0].scrollTop
        $timeout(function () {
            card[0].style.transform = 'translateY(' + (Math.round(m[0].scrollTop/2, 10)) + 'px) translateX(-50%)';
        });

    });

    w.bind('resize', function() {

        $scope.width = $window.innerWidth;
        pushCols($window.innerWidth);

        $scope.$digest();
    });

    $scope.toPinsteres = function (url) {
        if(!Modernizr.touch) {
            window.open('http://pinterest.com/pin/' + url + '/', '_blank');
        }
    };

    w.bind('keydown keypress', function (e) {
        if(e.which === 27) {
            $scope.closeGif();
        }
    });


    $scope.openGif = function ($event, pin) {
        var parent = $event.currentTarget.parentElement;
        var img = angular.element(parent).find('img')[0];

        $scope.modal.cords.top = parent.getBoundingClientRect().top;
        $scope.modal.cords.left = parent.getBoundingClientRect().left;
        $scope.modal.cords.width = parent.getBoundingClientRect().width;
        $scope.modal.cords.height = parent.getBoundingClientRect().height;

        modal.style.top = $scope.modal.cords.top + 'px';
        modal.style.left = $scope.modal.cords.left + 'px';
        modal.style.width = $scope.modal.cords.width + 'px';
        modal.style.opacity = '1';

        backdrop.style.top  = $scope.modal.cords.top + (($scope.modal.cords.width/2) - 25) + 'px';
        backdrop.style.left = $scope.modal.cords.left + (($scope.modal.cords.height/2) - 25) + 'px';


        $timeout(function () {
            backdrop.style.width = '150vmax';
            backdrop.style.height = '150vmax';
            backdrop.style.top = '-50vmax';
            backdrop.style.left = '-25vmax';
        }, 200);

        // Position the pin correctly
        $timeout(function () {
            // modal.removeAttribute('style');
            modal.style.transform = 'translateY(-50%) translateX(-50%)';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.width = $window.innerWidth < 600 ? ($window.innerWidth - 60) + 'px' : '600px';

        }, 300);

        // Set data
        $rootScope.modal.data = pin;

        // Toggle visiblity
        $rootScope.modal.visible = true;
    };

    $scope.closeGif = function () {

        modal.style.top = $scope.modal.cords.top + 'px';
        modal.style.left = $scope.modal.cords.left + 'px';
        modal.style.width = $scope.modal.cords.width + 'px';
        modal.style.transform = 'translateY(0) translateX(0)';

        $timeout(function () {
            backdrop.style.width = '50px';
            backdrop.style.height = '50px';
            backdrop.style.top  = $scope.modal.cords.top + (($scope.modal.cords.width/2) - 25) + 'px';
            backdrop.style.left = $scope.modal.cords.left + (($scope.modal.cords.height/2) - 25) + 'px';
        }, 100);

        $timeout(function () {
            modal.style.opacity = '0';
        }, 500);


        $timeout(function () {
            modal.removeAttribute('style');
            backdrop.removeAttribute('style');
            $rootScope.modal.visible = false;

            $rootScope.modal.data = null;
        }, 700);
    };

    $scope.pins = [];

    function pushCols(w) {
        $scope.columns = Math.floor(w / 237, 10);
        $scope.pins = chunkify(_.flatten($scope.pins), $scope.columns > 1 ? $scope.columns : 2, true);
    };

    _pins.then(function (response) {
        // console.log(response);
        $scope.pins.push(response.data.data.pins);

        pushCols($window.innerWidth);

    }, function (response) {

    });


    // $q.all(_requests).then(function(arrayOfResults) {
    //     console.log(arrayOfResults);
    // });
    // .then(function successCallback(response) {
    //     // this callback will be called asynchronously
    //     // when the response is available
    //
    //     var pins = response.data.data.pins;
    //
    //     $scope.pins = pins;
    //
    //     console.log('pin sucess', pins);
    //
    // }, function errorCallback(response) {
    //     // called asynchronously if an error occurs
    //     // or server returns response with an error status.
    //     console.log('error', response);
    // });
    //
    // .then(function successCallback(response) {
    //     // this callback will be called asynchronously
    //     // when the response is available
    //     // console.log('sucess', response);
    //
    //     var igs = response;
    //
    //     $scope.instas = igs.data.data;
    //     console.log('instagram sucess', $scope.instas);
    //
    // }, function errorCallback(response) {
    //     // called asynchronously if an error occurs
    //     // or server returns response with an error status.
    //     console.log('error', response);
    // });



});
