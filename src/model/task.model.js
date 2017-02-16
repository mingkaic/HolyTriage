"using strict";

const Sequelize   = require('sequelize');

const connection  = require('../service/connection.service');

var Tasks = connection.define('Tasks', {
    "taskId": {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    "name": {
        type: Sequelize.STRING,
    }, 
    "description": {
        type: Sequelize.STRING,
    }, 
    "deadline": {
        type: Sequelize.DATE
    }
}, { freezeTableName: true });

Tasks.belongsToMany(Tasks, {
    through: 'TaskList',
    as: 'Dependencies',
    foreignKey: 'taskId',
    onDelete: 'cascade'
});

module.exports = Tasks;
