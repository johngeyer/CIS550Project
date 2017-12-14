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

// This controller is to render the graph based on the results of the query. It calls renderGraph below.
app.controller('payrollController', function($scope, $http) {
    $scope.message="";
    $scope.Payroll = function() {
        console.log($scope.name);

        var request = $http.get('/payroll/'+$scope.name);
        request.success(function(data) {
            renderGraph(data);
        });
        request.error(function(data){
            console.log('err');
        });    
    }; 
});

// This controller is to show the team rosters/statistics
app.controller('topController', function($scope, $http) {
    $scope.message="";
    $scope.Submit = function() {
        var request = $http.get('/top/'+$scope.category+'/' + $scope.name+'/' + $scope.year);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });    
    }; 
});



// This function renders the Graph based on the results of the Query. The first entry is the Player and the others are (Team,amount)
function renderGraph(data) {
    //console.log(data);
    var w = 1000;
    var h = 600;
    var linkDistance=400;
    var colors = d3.scale.category10();

    /* Declares the nodes and the edges. In this case the first entry in the data should be the player and the rest of them
    are the team 
    */
    var dataset = {
    nodes: [
    {name: data[0].name}
    ],
    edges: [
    ]
    };

    for (i = 1; i < data.length; i++) { 
    dataset.edges.push({source: i, target: 0, salary: data[i].salary, season: data[i].season.low});
    dataset.nodes.push( {name: data[i].team});
    }

    console.log(dataset)


    // Clear the current svg graph before populating the new one
    d3.select("svg").remove();
    var svg = d3.select("body").append("svg").attr({"width":w,"height":h});

    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w,h])
        .linkDistance([linkDistance])
        .charge([-500])
        .theta(0.1)
        .gravity(0.05)
        .start();

 
    var edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .attr("id",function(d,i) {return 'edge'+i})
      .attr('marker-end','url(#arrowhead)')
      .style("stroke","#ccc")
      .style("pointer-events", "none");
    
    var nodes = svg.selectAll("circle")
      .data(dataset.nodes)
      .enter()
      .append("circle")
      .attr({"r":15})
      .style("fill",function(d,i){return colors(i);})
      .call(force.drag)


    var nodelabels = svg.selectAll(".nodelabel") 
       .data(dataset.nodes)
       .enter()
       .append("text")
       .attr({"x":function(d){return d.x;},
              "y":function(d){return d.y;},
              "class":"nodelabel",
              "stroke":"black"})
       .text(function(d){return d.name;});

    var edgepaths = svg.selectAll(".edgepath")
        .data(dataset.edges)
        .enter()
        .append('path')
        .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
               'class':'edgepath',
               'fill-opacity':0,
               'stroke-opacity':0,
               'fill':'blue',
               'stroke':'red',
               'id':function(d,i) {return 'edgepath'+i}})
        .style("pointer-events", "none");

    var edgelabels = svg.selectAll(".edgelabel")
        .data(dataset.edges)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({'class':'edgelabel',
               'id':function(d,i){return 'edgelabel'+i},
               'dx':80,
               'dy':0,
               'font-size':10,
               'fill':'#aaa'});

    edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
        .style("pointer-events", "none")
        .text(function(d,i){return 'season: '+d.season +', salary: ' + d.salary});


    svg.append('defs').append('marker')
        .attr({'id':'arrowhead',
               'viewBox':'-0 -5 10 10',
               'refX':25,
               'refY':0,
               //'markerUnits':'strokeWidth',
               'orient':'auto',
               'markerWidth':10,
               'markerHeight':10,
               'xoverflow':'visible'})
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#ccc')
            .attr('stroke','#ccc');
     

    force.on("tick", function(){

        edges.attr({"x1": function(d){return d.source.x;},
                    "y1": function(d){return d.source.y;},
                    "x2": function(d){return d.target.x;},
                    "y2": function(d){return d.target.y;}
        });

        nodes.attr({"cx":function(d){return d.x;},
                    "cy":function(d){return d.y;}
        });

        nodelabels.attr("x", function(d) { return d.x; }) 
                  .attr("y", function(d) { return d.y; });

        edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                           //console.log(d)
                                           return path});       

        edgelabels.attr('transform',function(d,i){
            if (d.target.x<d.source.x){
                bbox = this.getBBox();
                rx = bbox.x+bbox.width/2;
                ry = bbox.y+bbox.height/2;
                return 'rotate(180 '+rx+' '+ry+')';
                }
            else {
                return 'rotate(0)';
                }
        });
    });
}
