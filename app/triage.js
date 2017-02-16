"using strict";

// orders tasks by deadline and dependencies
module.exports = function(tasks) {
    tasks.sort(function(t1, t2) {
        return t1.deadline - t2.deadline;
    });
    let taskSet = {};
    let depQueue = {};
    let triaged = [];
    tasks.forEach(function(t) {
        const tid = t.taskId;
        let satisfied = t.dependencies.reduce(function(acc, val) {
            if (val === tid) return acc;
            return acc && taskSet[val];
        }, true);
        if (satisfied) {
            taskSet[tid] = true;
            triaged.push(t);
        }
        else {
            t.dependencies.forEach(function(d) {
                if (depQueue[d]) {
                    depQueue[d].push(t);
                }
                else {
                    depQueue[d] = [t];
                }
            });
        }
        if (depQueue[tid]) {
            depQueue[tid].forEach(function(dependee) {
                const did = dependee.taskId;
                if (!taskSet[did]) {
                    taskSet[did] = true;
                    triaged.push(dependee);
                }
            });
        }
    });
    return triaged;
}