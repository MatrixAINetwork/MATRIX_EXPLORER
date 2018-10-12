angular.module('BlocksApp').controller('TxController', function($stateParams, $rootScope, $scope, $http, $location, $sce) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    $rootScope.$state.current.data["pageSubTitle"] = $stateParams.hash;
    $scope.hash = $stateParams.hash;
    $scope.tx = {"hash": $scope.hash};
    $scope.settings = $rootScope.setup;
    $scope.showHtml = true;
    //fetch web3 stuff
    $http({
      method: 'POST',
      url: '/web3relay',
      data: {"tx": $scope.hash}
    }).then(function(resp) {
      if (resp.data.error) {
        if (resp.data.isBlock) {
          // this is a blockHash
          $location.path("/block/" + $scope.hash);
          return;
        }
        $location.path("/err404/tx/" + $scope.hash);
        return;
      }
      if(resp.data.html != '' && resp.data.html.indexOf('type') > -1 && resp.data.html.indexOf('length') > -1 ) {
        let splitstr = resp.data.html.split('type')[1].split('length')[0];
        if(splitstr.indexOf('1') > -1 && splitstr.indexOf('21') < 0) {
          $scope.showHtml = false;
        }
      } else {
        $scope.showHtml = false;
      }
      $scope.tx = resp.data;
      $scope.tx.html = $sce.trustAsHtml($scope.tx.html)
      if (resp.data.timestamp)
        $scope.tx.datetime = new Date(resp.data.timestamp*1000); 
      if (resp.data.isTrace) // Get internal txs
        fetchInternalTxs();
    });

    var fetchInternalTxs = function() {
      $http({
        method: 'POST',
        url: '/web3relay',
        data: {"tx_trace": $scope.hash}
      }).then(function(resp) {
        $scope.internal_transactions = resp.data;
      });      
    }
})
