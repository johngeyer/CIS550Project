var app = angular.module('angularjsNodejsTutorial',[]);

/* An angularJS controller basically takes the search queries given by input value
in the HTML file and redirects them to routes, which performs the actual query and returns
the results back to the HTML.
*/

// This controller is to redirect to the players data webpage. Need to use window or location, see docs
app.controller('searchController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
        var request = $http.get('/search_player/'+$scope.name);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });    
    }; 

});


// This controller is to show the players statistics
app.controller('playerController', function($scope, $http) {
 $scope.Lookup = function() {
        console.log("inside angular Lookup");
        var request = $http.get('/player/'+ $scope.playerID +'/' + $scope.startYear +'/' + $scope.endYear);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });

    
    }; 
});

// This controller is to show the team rosters/statistics
app.controller('teamController', function($scope, $http) {
    $scope.message="";
    $scope.Submit = function() {
        var request = $http.get('/teams/'+$scope.name+'/' + $scope.year);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });    
    }; 
});


/* To implement "Insert a new record", you need to:
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
*/