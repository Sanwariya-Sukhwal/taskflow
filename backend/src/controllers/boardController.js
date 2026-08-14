const boardService = require("../services/boardService");

const getBoard = async (req, res, next) => {
  try {
    const boardId = Number(req.params.id);

    if (!Number.isInteger(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    const board = await boardService.getBoardById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBoard,
};