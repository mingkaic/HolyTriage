const db = require('../service/db.service');

db.findAll()
.then(function(objs) {
    console.log('found all');
    console.log(objs);
});

db.findById(2)
.then(function(obj) {
    console.log('found by id');
    console.log(obj);
})