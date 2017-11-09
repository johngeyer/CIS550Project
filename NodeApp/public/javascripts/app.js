var app = angular.module('angularjsNodejsTutorial',[]);

// This controller is to redirect to the players data webpage. Need to use window or location, see docs
app.controller('playerController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
        var request = $http.get('/player/'+$scope.name);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });

        //var path = "/afterLogin.html";
        //window.location.href = path;
    
    }; 
});

// To implement "Insert a new record", you need to:
// - Create a new controller here
// - Create a corresponding route handler in routes/index.js

app.controller('insertController', function($scope, $http) {
        $scope.message="";
        $scope.Insert = function() {
        var request = $http.get('/insert/'+$scope.login+'/'+$scope.name+'/'+$scope.sex+'/'+$scope.RelationshipStatus+'/'+$scope.Birthyear);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});