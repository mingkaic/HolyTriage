const db = require('../service/db.service');
const tasks = require('./testTask.json')['sample_tasks'];

var idMapper = {};

function syncAdd(idx) {
    if (idx >= tasks.length) return;

    var tobj = tasks[idx];
    return db.create(tobj.name, tobj.deadline, tobj.description)
    .then(function(t) {
        idMapper[tobj.taskId] = t.taskId;
        return syncAdd(idx+1);
    });
}

syncAdd(0)
.then(function() {
    for (var i = 0; i < tasks.length; i++) {
        var tobj = tasks[i];
        var deps = tobj.dependencies
        .map(function(tid) {
            return idMapper[tid];
        });
        db.addDep(idMapper[tobj.taskId], deps);
    }
});
