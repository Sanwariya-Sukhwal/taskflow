const express = require("express");
const boardController = require("../controllers/boardController");

const router = express.Router();

router.get("/:id", boardController.getBoard);

module.exports = router;