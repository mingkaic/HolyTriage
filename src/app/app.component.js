"using strict";

(function(app) {

const db        = require('../service/db.service');
const triage    = require('./triage');

app.AppComponent =
	ng.core.Component({
		selector: 'my-tasks',
		templateUrl: 'taskMain.html'
	})
	.Class({
		constructor: function() {
			this._zone = new ng.core.NgZone({enableLongStackTrace: false});
			this.newTask = {};
			this.tasks = [];
			let ctrl = this;
			db.findAll()
			.then(function(tasks) {
				ctrl._zone.run(function() {
					ctrl.tasks = triage(tasks);
				});
			});
		},
		addTask: function() {
			db.create(this.newTask.name, new Date(this.newTask.deadline), this.newTask.description);
			this.newTask.deadline = new Date(this.newTask.deadline);
			this.tasks.push(this.newTask);
			this.newTask = {};
		}
	});

})(window.app || (window.app = {}));
