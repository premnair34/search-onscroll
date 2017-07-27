var app = angular.module("searchApp",["ngAnimate","ui.bootstrap"]);
app.controller("SearchCtrl",function($scope,$http){
	$scope.rawdata = {
		wait:false,
		docs:[],
		page:0,
		sort:undefined
	}
	$scope.search = function(options){
		options = options || {};
		$scope.rawdata.page = options.page || 0;
		$scope.rawdata.sort = options.sort || undefined;
		$scope.rawdata.wait = options.wait || true;
		let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";		
		$http({
			url:url,
			method:"GET",
			headers: {'Content-Type': 'application/jsonp'},
			params: {
		       "api-key" : "fdad3e70e09a422ea2b934e357d0835a",
		       "sort":$scope.rawdata.sort,
		       "page":$scope.rawdata.page
	    	}
		}).then(function(x) {
			if(x.status == 200 && x.statusText == "OK"){		
	        	$scope.rawdata.meta = x.data.response.meta;
	        	$scope.rawdata.wait = false;	
	        	for(let i = 0;i < x.data.response.docs.length;i++){
	        		$scope.rawdata.docs.push(x.data.response.docs[i]);
	        	}
			}
	    }, function(x) {
	    	$scope.rawdata.wait = false;
	        $scope.rawdata.error = x.statusText;
	    });
	}
	$scope.showMore = function(){
		if($scope.rawdata.wait) 
			return;
		var options = {
			page : $scope.rawdata.page + 1,
			sort:"newest",
			wait:true
		}
		$scope.search(options);
	}
}).directive("onScroll",function($window){
	return{
		restrict: 'A',
		scope:{
			onScroll: '&',
		},
        link: function (scope, element, attrs) {
            window.onscroll = function() {
            	 if ((this.innerHeight + this.scrollY) >= document.body.offsetHeight) {			
			    	scope.$apply(function(){
			    		scope.onScroll();
			    	})
			    }
			};
        }
	}
})