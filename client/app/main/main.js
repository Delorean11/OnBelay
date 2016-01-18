angular.module('nova.main', [])

.controller('MainController', function($scope, $rootScope, $window, $state, $firebaseObject, Climbers, Notify, Auth){

  $scope.activeClimbers = [];
  $scope.status = false;
  $scope.message = {};
  $scope.showChat = false;
  var params = '';

  $rootScope.displayChat = function(user) {
    params = [$rootScope.loggedInUser, user];
    params = params.sort(function(a, b) {
      return a > b;
    });
    params = params.join('-');

    var inbox = new Firebase('https://on-belay-1.firebaseio.com/inbox/');
    var senderInbox = inbox.child($rootScope.loggedInUser);
    var recipientInbox = inbox.child(user);

    var FIREBASE = new Firebase('https://on-belay-1.firebaseio.com/conversations/' + params);
    $firebaseObject(FIREBASE);

    senderInbox.child(user).child('newMessage').once('value', function(snapshot) {
      console.log(snapshot.val());
      if (snapshot.val() === true) {
        $rootScope.markAsRead(user);
      }
    });


    $scope.showChat = true;
    $scope.recipient = user;
    $scope.conversations = FIREBASE;
    $scope.chatsView = {};

    $scope.conversations.on('child_added', function(snapshot) {
      $scope.chatsView[snapshot.key()] = snapshot.val();
    });

  };

  $scope.goToProfile = function(climber){
    ClimberProfile.climber.info = climber;
    $state.go('profile', {'userName':climber.first+climber.last});
  };

  $scope.getActiveClimbers = function(){
    Climbers.getClimbers()
      .then(function(res) {
        $scope.activeClimbers = res;
      })
      .catch(function(err) {
        console.error(err);
      });
  }();

  $scope.getStatus = function() {
    Climbers.getStatus().then(function(res) {
      $scope.status = res.status;
    });
  }();

  $scope.updateStatus = function() {
    Climbers.updateStatus().then(function(res) {
      console.log(res);
    });
  };

  $scope.climbOn = function(climber) {
    Notify.sendNotification(climber)
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  $rootScope.markAsRead = function(contact) {
    var sender = new Firebase('https://on-belay-1.firebaseio.com/inbox/' + $rootScope.loggedInUser + '/' + contact);
    var recipient = new Firebase('https://on-belay-1.firebaseio.com/inbox/' + $rootScope.loggedInUser);
    //decrement unread counter in Firebase
    recipient.child('unread').transaction(function(currVal) {
      if (currVal > 0) {
        currVal--;
        return currVal;
      }
    });
    sender.ref().child('newMessage').set(false);
  };

  $scope.sendMessage = function() {
    var conversations = new Firebase('https://on-belay-1.firebaseio.com/conversations/' + params);
    var inbox = new Firebase('https://on-belay-1.firebaseio.com/inbox/');
    var senderInbox = inbox.child($rootScope.loggedInUser);
    var recipientInbox = inbox.child($scope.recipient);

    conversations.push({
      wasRead: false,
      users: { sender: $rootScope.loggedInUser, recipient: $scope.recipient },
      text: $scope.message.text
    });

    recipientInbox.child($rootScope.loggedInUser).child('newMessage').once('value', function(snapshot) {
      if (!snapshot.val()) {
        recipientInbox.child($rootScope.loggedInUser).set({
          sender: $rootScope.loggedInUser,
          newMessage: true
        });

        recipientInbox.child('unread').transaction(function(currentVal) {
          return(currentVal || 0) + 1;
        });
      }
    });

    $scope.message.text = '';
  };
});
