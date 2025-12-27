const {getAllTasksFromDB, getTaskByIdFromDB, addTaskToDB, deleteTaskFromDB} = require('../model/tasks_M');

async function addTask(req, res) {
    try {
        const users_id = req.user.id;
        const task = await addTaskToDB(req.body, users_id);
        res.status(200).json({ message: "task added successfully", task });
    } catch (error) {
        console.log('ERROR in addTask:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}
async function getAllTasks(req, res) {
    try {
        const users_id = req.user.id;
        const tasks = await getAllTasksFromDB(users_id);
        if (tasks.length === 0) {
            res.status(200).json({ message: "no tasks found" });
        } else {
            res.status(200).json({ message: "ok", tasks });
        }
    } catch (error) {
        console.log('ERROR in getAllTasks:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function getTaskById(req, res) {
    try {
        const users_id = req.user.id;
        const task = await getTaskByIdFromDB(req.params.id, users_id);
        if (!task || task.length === 0) {
            res.status(404).json({ message: `task id ${req.params.id} not found` });
            return;
        }
        res.status(200).json({ message: "ok", task: task[0] });
    } catch (error) {
        console.log('ERROR in getTaskById:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function deleteTask(req, res) {
    try {
        const users_id = req.user.id;
        const affectedRows = await deleteTaskFromDB(req.params.id, users_id);
        if (affectedRows === 0 || !affectedRows) {
            res.status(404).json({ message: `task id ${req.params.id} not found` });
            return;
        }
        res.status(200).json({ message: "task deleted successfully" });
    } catch (error) {
        console.log('ERROR in deleteTask:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

module.exports = { getAllTasks, getTaskById, addTask, deleteTask };