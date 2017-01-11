(function () {
	'use strict';
	var mysql = require('mysql');
	
	// Creates MySql database connection
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'electron_triager',
		password: 'tr1@g34lyf3',
		database: 'triage_manager'
	});

	connection.connect();
	
	angular.module('app').service('triageService', ['$q', TriageService]);
	
	function TriageService($q) {
		return {
			getActivities: getActivities,
			getById: getActivityById,
			getByName: getActivityByName,
			create: createActivity,
			destroy: deleteActivity,
			update: updateActivity
		};
		
		function getActivities() {
			var deferred = $q.defer();
			var query = 'SELECT * FROM triage';
			connection.query(query, function (err, rows) {
				if (err) deferred.reject(err);
				deferred.resolve(rows);
			});
			return deferred.promise;
		}
		
		function getActivityById(id) {
			id = connection.escape(id);

			var deferred = $q.defer();
			var query = 'SELECT * FROM triage WHERE activity_id = ?';
			connection.query(query, [id], function (err, rows) {
				if (err) deferred.reject(err);
				deferred.resolve(rows);
			});
			return deferred.promise;
		}
		
		function getActivityByName(name) {
			name = connection.escape(name);

			var deferred = $q.defer();
			var query = "SELECT * FROM triage WHERE name LIKE '" + name + "%'";
			connection.query(query, [name], function (err, rows) {
				if (err) deferred.reject(err);
				
				deferred.resolve(rows);
			});
			return deferred.promise;
		}
		
		function createActivity(activity) {
			console.log(activity);
			var deferred = $q.defer();
			var query = 'INSERT INTO triage SET ?';
			connection.query(query, activity, function (err, res) {
				if (err) deferred.reject(err);
				deferred.resolve(res.insertId);
			});
			return deferred.promise;
		}
		
		function deleteActivity(id) {
			var deferred = $q.defer();
			var query = 'DELETE FROM triage WHERE activity_id = ?';
			connection.query(query, [id], function (err, res) {
				if (err) deferred.reject(err);
				deferred.resolve(res.affectedRows);
			});
			return deferred.promise;
		}
		
		function updateActivity(activity) {
			var deferred = $q.defer();
			var query = 'UPDATE triage SET name = ? WHERE activity_id = ?';
			connection.query(query, [activity.name, activity.activity_id], function (err, res) {
				if (err) deferred.reject(err);
				deferred.resolve(res);
			});
			return deferred.promise;
		}
	}
})();