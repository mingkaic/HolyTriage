(function () {
	'use strict';
	angular.module('app')
		.controller('triageController', ['$scope', 'triageService', '$q', '$mdDialog', TriageController]);
	
	function TriageController($scope, triageService, $q, $mdDialog) {
		$scope.selected = null;
		$scope.activities = [];
		$scope.selectedIndex = 0;
		$scope.filterText = null;
		$scope.selectActivity = selectActivity;
		$scope.deleteActivity = deleteActivity;
		$scope.saveActivity = saveActivity;
		$scope.createActivity = createActivity;
		$scope.filter = filterActivity;
		
		// Load initial data
		getAllActivities();

		function getAllActivities() {
			triageService.getActivities().then(function (activities) {
				$scope.activities = [].concat(activities);
				$scope.selected = activities[0];
			});
		}

		function selectActivity (activity, index) {
			$scope.selected = angular.isNumber(activity) ? $scope.activities[activity] : activity;
			$scope.selectedIndex = angular.isNumber(activity) ? activity: index;
		}
		
		function deleteActivity($event) {
			var confirm = $mdDialog.confirm()
				.title('Are you sure?')
				.content('Are you sure want to delete '+$scope.selected.name+' activity?')
				.ok('Yes')
				.cancel('No')
				.targetEvent($event);
			
			$mdDialog.show(confirm).then(function () {
				triageService.destroy($scope.selected.activity_id).then(function (affectedRows) {
					$scope.activities.splice($scope.selectedIndex, 1);
				});
			}, function () { });
		}
		
		function saveActivity($event) {
			if ($scope.selected != null && $scope.selected.activity_id != null) {
				triageService.update($scope.selected).then(function (affectedRows) {
					$mdDialog.show(
						$mdDialog
							.alert()
							.clickOutsideToClose(true)
							.title('Success')
							.content('Data Updated Successfully!')
							.ok('Ok')
							.targetEvent($event)
					);
				});
			}
			else {
				triageService.create($scope.selected).then(function (affectedRows) {
					$mdDialog.show(
						$mdDialog
							.alert()
							.clickOutsideToClose(true)
							.title('Success')
							.content('Data Added Successfully!')
							.ok('Ok')
							.targetEvent($event)
					);
				});
			}
		}
		
		function createActivity() {
			$scope.selected = { deadline: new Date() };
			$scope.selectedIndex = null;
		}
		
		function filterActivity() {
			if ($scope.filterText == null || $scope.filterText == "") {
				getAllActivities();
			}
			else {
				triageService.getByName($scope.filterText).then(function (activities) {
					$scope.activities = [].concat(activities);
					$scope.selected = activities[0];
				});
			}
		}
	}

})();