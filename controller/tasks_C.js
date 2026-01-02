const {getAllTasksFromDB, getTaskByIdFromDB, addTaskToDB, deleteTaskFromDB, updateTaskInDB} = require('../model/tasks_M');

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

async function updateTask(req, res) {
    try {
        const users_id = req.user.id;
        const taskId = req.params.id;
        const { description, isDone, category_id } = req.body;

        // Get existing task to merge updates
        const existingTask = await getTaskByIdFromDB(taskId, users_id);
        if (!existingTask || existingTask.length === 0) {
            return res.status(404).json({ message: `task id ${taskId} not found` });
        }

        const updates = {
            description: description !== undefined ? description : existingTask[0].description,
            isDone: isDone !== undefined ? isDone : existingTask[0].isDone,
            category_id: category_id !== undefined ? category_id : existingTask[0].category_id
        };

        const affectedRows = await updateTaskInDB(taskId, users_id, updates);
        if (affectedRows === 0) {
            return res.status(404).json({ message: `task id ${taskId} not found` });
        }

        const updatedTask = await getTaskByIdFromDB(taskId, users_id);
        res.status(200).json({ message: "task updated successfully", task: updatedTask[0] });
    } catch (error) {
        console.log('ERROR in updateTask:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

module.exports = { getAllTasks, getTaskById, addTask, deleteTask, updateTask };