angular.module('nova.main', [])

.controller('MainController', function($scope, $rootScope, $window, $state, $firebaseObject, $timeout, Climbers, Notify, Auth){

  $scope.activeClimbers = [];
  $scope.status = false;
  $scope.dateNow = Date.now();

  var inbox = new Firebase('https://on-belay-1.firebaseio.com/inbox/');
  var senderInbox = inbox.child($rootScope.loggedInUser);
  $rootScope.message = {};
  if ($rootScope.showChat === undefined) {
    $rootScope.showChat = false;
  }

  var params = '';

  var scrollToBottom = function() {
      $timeout(function() {
      var scroller = document.getElementById("scrollToBottom");
      scroller.scrollTop = scroller.scrollHeight;
    }, 20, false);
  };

  var updateChatOpenClose = function(openOrClose) {
    var obj = {};
    obj[openOrClose] = Date.now();
    senderInbox.update(obj);
  }

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

    updateChatOpenClose('chatOpenedAt');

    $rootScope.showChat = true;
    $rootScope.recipient = user;
    $scope.conversations = FIREBASE;

    $rootScope.chatsView = {};

    $scope.conversations.on('child_added', function(snapshot) {
      $rootScope.chatsView[snapshot.key()] = snapshot.val();
      scrollToBottom();
    });

    scrollToBottom();
  };

  $rootScope.closeChat = function() {
    $rootScope.showChat = !$rootScope.showChat
    updateChatOpenClose('chatClosedAt');
    senderInbox.update({
      messageSent: false
    });
  }

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

  $rootScope.sendMessage = function() {
    var conversations = new Firebase('https://on-belay-1.firebaseio.com/conversations/' + params);
    var inbox = new Firebase('https://on-belay-1.firebaseio.com/inbox/');
    var senderInbox = inbox.child($rootScope.loggedInUser);
    var recipientInbox = inbox.child($rootScope.recipient);

    conversations.push({
      wasRead: false,
      users: { sender: $rootScope.loggedInUser, recipient: $rootScope.recipient },
      text: $rootScope.message.text,
      date: Date.now()
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

    senderInbox.update({
      messageSent: true
    });

    $rootScope.message.text = '';
  };
});
