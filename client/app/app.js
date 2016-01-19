angular.module('nova', [
  'nova.auth',
  'nova.services',
  'ui.router',
  'nova.main',
  'nova.update',
  'nova.location',
  'nova.notifications',
  'nova.profile',
  'firebase'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise("/signin");
  $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "app/main/main.html",
      controller: "MainController"
    })
    .state('signin', {
      url: "/signin",
      templateUrl: "app/auth/signin.html",
      controller: "AuthController"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/auth/signup.html",
      controller: "AuthController"
    })
    .state('profile', {
      url: '/profile/:username',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController'
    })
    .state('update', {
      url: "/update",
      templateUrl: "app/update/update.html",
      controller: "UpdateController"
    })
    .state('logout', {
      url: "/logout",
      controller: function($scope, Auth){
        window.location.reload(true);
        Auth.signout();
      }
    })
    .state('location', {
      url: "/location",
      templateUrl: "app/location/location.html",
      controller: "LocationController"
    })
    .state('notifications', {
      url: "/notifications",
      templateUrl: "app/notifications/notifications.html",
      controller: "NotificationCtrl"
    });
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function($window){
  var attach = {
    request: function(object) {
      var jwt = $window.localStorage.getItem('com.nova');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function($rootScope, $state, $window, $firebaseObject, Auth) {
  $rootScope.loggedInUser =  $window.localStorage.getItem('loggedInUser');
  $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams){
    if (toState.name === 'signin') {
      return;
    }
    if (toState.name === 'main') {
      var INBOX = new Firebase('https://on-belay-1.firebaseio.com/inbox/');
      var userInbox = INBOX.child($rootScope.loggedInUser);
      var unread = $firebaseObject(userInbox);
      var unreadCount = userInbox.child('unread');

      var currentUser = $rootScope.loggedInUser;
      $rootScope.currentUser = {};
      console.log(currentUser, $rootScope.currentUser);

      var chatClosedAt = userInbox.child('chatClosedAt');
      var chatOpenedAt = userInbox.child('chatOpenedAt');
      var messageSent = userInbox.child('messageSent');

      /*$firebaseObject(unreadCount).$bindTo($rootScope, 'unreadMessages').then(function() {
        if ($rootScope.unreadMessages['$value'] === null) {
          $rootScope.unreadMessages = 0;
        }
        if ($rootScope.unreadMessages['$value'] === 0) {
          $rootScope.unreadMessages = 0;
        }
      });*/
      unreadCount.ref().on('value', function(snapshot) {
        currentUser = $window.localStorage.getItem('loggedInUser');
        $rootScope.currentUser = {};
        if (snapshot.val() === null) {
          $rootScope.currentUser.unread = 0;
        } else {
          $rootScope.currentUser.unread = snapshot.val();
        }
        console.log($rootScope.currentUser.unread);
      });

      $firebaseObject(chatClosedAt).$bindTo($rootScope, 'chatClosedAt');
      $firebaseObject(chatOpenedAt).$bindTo($rootScope, 'chatOpenedAt');
      $firebaseObject(messageSent).$bindTo($rootScope, 'messageSent');

      userInbox.on('value', function(data) {
        $rootScope.contactHistory = [];
        for(var key in data.val()) {
          var contact = data.val()[key];
          $rootScope.contactHistory.push(contact);
        }
      });
    }
    if (!Auth.isAuth() && toState.name !== 'signup'){
      evt.preventDefault();
      $state.go('signin');
    }
  });
});
