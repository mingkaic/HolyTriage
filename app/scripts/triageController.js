(function () {
	'use strict';
	angular.module('app')
		.controller('triageController', ['triageService', '$q', '$mdDialog', TriageController]);
	
	function TriageController(triageService, $q, $mdDialog) {
		var ctrl = this;

		ctrl.selected = null;
		ctrl.activities = [];
		ctrl.selectedIndex = 0;
		ctrl.filterText = null;
		ctrl.selectActivity = selectActivity;
		ctrl.deleteActivity = deleteActivity;
		ctrl.saveActivity = saveActivity;
		ctrl.createActivity = createActivity;
		ctrl.filter = filterActivity;
		
		// Load initial data
		getAllActivities();

		function getAllActivities() {
			triageService.getActivities().then(function (activities) {
				ctrl.activities = [].concat(activities);
				ctrl.selected = activities[0];
			});
		}

		function selectActivity (activity, index) {
			ctrl.selected = angular.isNumber(activity) ? ctrl.activities[activity] : activity;
			ctrl.selectedIndex = angular.isNumber(activity) ? activity: index;
		}
		
		function deleteActivity($event) {
			var confirm = $mdDialog.confirm()
				.title('Are you sure?')
				.content('Are you sure want to delete ctrl activity?')
				.ok('Yes')
				.cancel('No')
				.targetEvent($event);
			
			$mdDialog.show(confirm).then(function () {
				triageService.destroy(ctrl.selected.activity_id).then(function (affectedRows) {
					ctrl.activities.splice(ctrl.selectedIndex, 1);
				});
			}, function () { });
		}
		
		function saveActivity($event) {
			if (ctrl.selected != null && ctrl.selected.activity_id != null) {
				triageService.update(ctrl.selected).then(function (affectedRows) {
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
				triageService.create(ctrl.selected).then(function (affectedRows) {
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
			ctrl.selected = {};
			ctrl.selectedIndex = null;
		}
		
		function filterActivity() {
			if (ctrl.filterText == null || ctrl.filterText == "") {
				getAllActivities();
			}
			else {
				triageService.getByName(ctrl.filterText).then(function (activities) {
					ctrl.activities = [].concat(activities);
					ctrl.selected = activities[0];
				});
			}
		}
	}

})();