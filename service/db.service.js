"using strict";

const connection  = require('../service/connection.service');
const task = require('../model/task.model');

function getAllTasks() {
    return connection.sync()
    .then(function() {
        return task.findAll();
    })
    .then(function(tobjs) {
        // same thing as findAll({include: ...}); 
        // but we don't know the associated model
        let tarr = [];
        return (function sync(idx) {
            if (idx >= tobjs.length) return;
            let tobj = tobjs[idx];
            let t = tobj.get({plain: true});
            return tobj.getDependencies()
            .then(function(deps) {
                t.dependencies = deps.map(function(d) {
                    return d.get({plain: true}).taskId;
                });
                tarr.push(t);
                return sync(idx+1);
            });
        })(0)
        .then(function() {
            return tarr;
        });
    })
    .catch(function(err) {
        console.error(err);
    });
};

function getTaskById(id) {
    return connection.sync()
    .then(function() {
        return task.findById(id);
    })
    .then(function(tobj) {
        let t = tobj.get({plain: true});
        return tobj.getDependencies()
        .then(function(deps) {
            t.dependencies = deps.map(function(d) {
                return d.get({plain: true}).taskId;
            });
            return t;
        });
    })
    .catch(function(err) {
        console.error(err, id);
    });
}

function createTask(name, deadline, description) {
    if ('undefined' === typeof description) {
        description = "";
    }
    return connection.sync()
    .then(function() {
        return task.create({
            "name": name,
            "description": description,
            "deadline": deadline
        });
    })
    .then(function(tobj) {
        return tobj.get({plain: true});
    })
    .catch(function(err) {
        console.error(err, name, deadline, description);
    });
}

function addDependencies(id, dependencies) {
    return connection.sync()
    .then(function() {
        return task.findById(id);
    })
    .then(function(tobj) {
        return tobj.setDependencies(dependencies);
    })
    .catch(function(err) {
        console.error(err, id, dependencies);
    });
}

function updateTask(id, updates) {
    return connection.sync()
    .then(function() {
        return task.findById(id);
    })
    .then(function(tobj) {
        tobj = tobj.get({plain: true});
        return task.update({
            "name": tobj.name | updates.name,
            "description": tobj.description | updates.description,
            "deadline": tobj.deadline | updates.deadline
        }, {
            where: {'taskId': id}
        });
    })
    .then(function(tobj) {
        return tobj.get({plain: true});
    })
    .catch(function(err) {
        console.error(err, id, updates);
    });
}

function removeTask(id) {
    return connection.sync()
    .then(function() {
        // todo
    });
}

function removeDependencies(id, dependencies) {
    // if dependencies is empty, remove all dependencies
    return connection.sync()
    .then(function() {
        // todo
    });
}

module.exports = {
    'findAll': getAllTasks,
    'findById': getTaskById,
    'create': createTask,
    'addDep': addDependencies,
    'update': updateTask,
    'remove': removeTask,
    'removeDep': removeDependencies
};
