const express = require("express");

const taskController = require("../controllers/taskController");

const router = express.Router();

router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id/move", taskController.moveTask);
router.get("/filter", taskController.getTasksByPriority);

module.exports = router;