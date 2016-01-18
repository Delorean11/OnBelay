angular.module('nova.profile', [])

.controller('ProfileController', function($rootScope, $scope, Climber, Update, $stateParams){
  $scope.updatedUser = {};
  $scope.updatingPic = false;
  $scope.edits = {
    name: false,
    skillLevel: false,
    zipCode: false,
    favs: false
  }

  $scope.getClimberInfo = function(climber){
    Climber.getClimberInfo(climber)
      .then(function(res){
        $scope.user = res;
        console.log($scope.user.favs);
        angular.copy($scope.user, $scope.updatedUser);
      })
      .catch(function(err){
        console.log(err);
      });
  }($stateParams.username);

  $scope.imageUpload = function(event){
    var files = event.target.files; //FileList object
    var file = files[0];
    var reader = new FileReader();


    reader.onload = $scope.imageIsLoaded;
    reader.readAsDataURL(file);
  };

  $scope.imageIsLoaded = function(e){
    $scope.$apply(function() {
      $scope.user.profileImg = e.target.result;
      $scope.updatingPic = false;
      Update.updateProfileImg(e.target.result)
        .then(function(res){
          console.log(res);
        });


    });
  }

  $scope.updatePic = function(){
    $scope.updatingPic = true;
  }

  $scope.flipPropertyState = function(property){
    console.log('in flip property');
    $scope.edits[property] = !$scope.edits[property];
    console.log($scope.edits);
  }
  $scope.updateProperty = function(property){
    Update.update($scope.updatedUser)
      .then(function(res){
        $scope.user = res;
        $scope.flipPropertyState(property);
      });
  }
  $scope.cancelUpdate = function(property){
    console.log('inside cancel update');
    angular.copy($scope.user, $scope.updatedUser);
    $scope.flipPropertyState(property);
  }

});

