(function () {
    'use strict';
    
    var _templateBase = './scripts';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
    ])
    .config(['$mdIconProvider', '$routeProvider', function ($mdIconProvider, $routeProvider) {
            // register svg icons
            $mdIconProvider
                .icon("menu", "./assets/svg/menu.svg", 24)

            $routeProvider.when('/', {
                templateUrl: _templateBase + '/triage.html' ,
                controller: 'triageController',
                controllerAs: '_ctrl'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);
})();