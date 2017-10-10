Parse.initialize("UmpHkpjuYcwU93vizVqCIh6yHfs1qOUojAOSTVP3","O5nRXVDmhtzf6zAsLivXEVxaZ3LbnaJT6eMsDDin");
angular.module("app.controllers",[])
.controller("loginCtrl",function($scope,$location){

  Parse.User.logOut();
  $scope.currentUser=Parse.User.current();

  $scope.logIn=function(form) {

    var Couple=Parse.Object.extend("Couple"),
      User=Parse.Object.extend("User"),
      innerQuery=new Parse.Query(Couple);
    innerQuery.exists("code");
    var query=new Parse.Query(User);
    query.matchesQuery("couple",innerQuery);
    query.equalTo("email",form.email);
    innerQuery.equalTo("code",form.password);
    query.find({
      success: function(result) {
        if(result.length>0){
          Parse.User.logIn(result[0].attributes.username,form.password,{
            success: function(user) {
              $scope.currentUser=user;
              $location.path("/home");
              $scope.$apply();
            },
            error: function(user,error) {
              alert("Unable to log in: " + error.code + " " + error.message);
            }
          });
        }else{alert("Your email is not register with that Wedding Code");}
      },
      error:function(error){alert(error);}
    });

  };
})
.controller("registerCtrl",function($scope,$location){

  Parse.User.logOut();
  $scope.currentUser=Parse.User.current();

  $scope.signUp=function(form) {

    if(form.email!=null){

      var Couple=Parse.Object.extend("Couple"),
        queryCouple=new Parse.Query(Couple);
      queryCouple.equalTo("code",form.password);
      queryCouple.find({success:function(couple){
        if(couple.length>0){

          var countGuests=new Parse.Query(Parse.User);
          countGuests.equalTo("couple",{__type:"Pointer",className:"Couple",objectId:couple[0].id});
          countGuests.count().then(function(count){
            $scope.guestUserName=couple[0].attributes.groom+"_"+couple[0].attributes.bride+"-Guest"+ ++count;

            var user=new Parse.User();
            user.set("email",form.email);
            user.set("username",$scope.guestUserName);
            user.set("password",form.password);
            user.set("couple",{__type:"Pointer",className:"Couple",objectId:couple[0].id});

            user.signUp(null,{
              success: function(user) {
                $scope.currentUser=user;
                $location.path("/home");
                $scope.$apply();
              },
              error: function(user,error) {
                alert("Unable to sign up: "+error.code+" "+ error.message);
              }
            });

          });

        }else{alert("Invalid Wedding Code");}
      }});
    }else{alert("Please enter your email");}

  };

})
.controller("homeCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("ourStoryCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("calendarCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("giftCatalogCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("testimonialsCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("countDownCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("memoriesCtrl",function($scope,$window,$location,$cordovaCamera){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

  $scope.memoryPic=function(){

    $cordovaCamera.getPicture({
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }).then(function(imageData){

      var parseFile=new Parse.File("memory_pic.jpg",{base64:imageData});
      var MemoryClass=Parse.Object.extend("Memory");
      var memory=new MemoryClass();

      parseFile.save().then(function(){

        memory.set("user",{__type: "Pointer",className: "User",objectId: $scope.currentUser.id});
        memory.set("pic",parseFile);
        memory.save(null,{
          success:function(results){
            $scope.$apply();
            alert("Picture uploaded.");
            $location.reload(true);
          },
          error:function(error){alert(error.code+" "+error.message);}
        });

      },function(error){alert(error.code+" "+error.message);});

    },function(error) {
      alert(error);
    });
  }

})
.controller("offersCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller("gamesCtrl",function($scope){

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

})
.controller('galleryCtrl',function($scope,$ionicBackdrop,$ionicModal,$ionicSlideBoxDelegate,$ionicScrollDelegate) {

  $scope.currentUser=Parse.User.current();
  $scope.profilePicture="img/jov.jpeg";

  $scope.allImages=[{
    src: $scope.profilePicture
  },{
    src: $scope.profilePicture
  },{
    src: $scope.profilePicture
    },{
    src: $scope.profilePicture
    },{
    src: $scope.profilePicture
    },{
    src: $scope.profilePicture
    },{
    src: $scope.profilePicture
  }];

  $scope.showImages=function(index) {
    $scope.activeSlide=index;
    $scope.showModal('templates/gallery.html');
  };

  $scope.showModal=function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl,{
      scope: $scope
    }).then(function(modal) {
      $scope.modal=modal;
      $scope.modal.show();
    });
  };

  $scope.closeModal=function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };

  $scope.updateSlideStatus=function(slide) {
    var zoomFactor=$ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };

})
;
