const taskService = require("../services/taskService");

const createTask = async (req, res, next) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const { columnId, title, description, priority } = req.body || {};

    if (!columnId) {
      return res.status(400).json({
        success: false,
        message: "Column ID is required",
      });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const validPriorities = ["Low", "Medium", "High"];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High",
      });
    }

    const task = await taskService.createTask({
      columnId: Number(columnId),
      title: title.trim(),
      description: description || null,
      priority: priority || "Medium",
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE TASK
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body || {};

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const validPriorities = ["Low", "Medium", "High"];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High",
      });
    }

    const task = await taskService.updateTask(id, {
      title: title.trim(),
      description: description || null,
      priority: priority || "Medium",
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE TASK
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await taskService.deleteTask(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const moveTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { columnId } = req.body || {};

    if (!columnId) {
      return res.status(400).json({
        success: false,
        message: "Column ID is required",
      });
    }

    const task = await taskService.moveTask(
      id,
      Number(columnId)
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task moved successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasksByPriority = async (req, res, next) => {
  try {
    const { priority } = req.query;

    const validPriorities = ["Low", "Medium", "High"];

    if (!priority) {
      return res.status(400).json({
        success: false,
        message: "Priority is required",
      });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High",
      });
    }

    const tasks = await taskService.getTasksByPriority(priority);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  getTasksByPriority,
};