const express = require('express');
const router = express.Router();
const tasksC = require('../controller/tasks_C');
const { isLoggedIn } = require('../middelware/auth_MID');
const validateTask = require('../middelware/tasks_MID');


router.get('/', isLoggedIn, tasksC.getAllTasks);
router.get('/:id', isLoggedIn, tasksC.getTaskById);
router.post('/', isLoggedIn, validateTask, tasksC.addTask);
router.delete('/:id', isLoggedIn, tasksC.deleteTask);

module.exports = router;

