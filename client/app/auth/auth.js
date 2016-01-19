angular.module('nova.auth', [])

.controller('AuthController', function ($scope, $rootScope, $window, $state, Auth, Notify) {
  $scope.user = {};
  if (Auth.isAuth()) {
    $rootScope.hasAuth = true;
  }


  $scope.checkGeoLocation = function(cb) {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
      $scope.getUserLocation(cb);
    }
    else {
      console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
  }

  $scope.getUserLocation = function(cb) {
      var startPos;
      var geoSuccess = function(position) {
        startPos = position;
        cb(startPos.coords.latitude,startPos.coords.longitude);
      };
      var geoError = function(error) {
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      };
      navigator.geolocation.getCurrentPosition(geoSuccess,geoError);

  }


  $scope.goToProfile = function(climber){
    ClimberProfile.climber.info = climber;
    $state.go('profile', {'userName':climber.first+climber.last});
  };

  $scope.signin = function () {
    $scope.checkGeoLocation(function(lat,lng){
      $scope.user.lat = lat;
      $scope.user.lng = lng;
    })
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.nova', token);
        $rootScope.hasAuth = true;
        $state.go('main');
        // $scope.checkNotifications();
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {

    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.nova', token);
        $rootScope.hasAuth = true;
        $state.go('update');
      })
      .catch(function (error) {
        console.error(error);
      });
  };


  $scope.checkNotifications = function() {
    if ($rootScope.hasAuth && $state.name !== 'notifications') {
      Notify.checkNotifications().then(function(resp) {
        $rootScope.unread = resp || 0;
      });
    }
  };
  // $scope.checkNotifications();
});
