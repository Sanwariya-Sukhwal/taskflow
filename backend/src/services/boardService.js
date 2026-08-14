const pool = require("../config/db");

const getBoardById = async (boardId) => {
  const boardQuery = `
    SELECT id, name
    FROM boards
    WHERE id = $1
  `;

  const boardResult = await pool.query(boardQuery, [boardId]);

  if (boardResult.rows.length === 0) {
    return null;
  }

  const board = boardResult.rows[0];

  const columnsQuery = `
    SELECT
      c.id,
      c.name,
      COUNT(t.id)::int AS task_count
    FROM columns c
    LEFT JOIN tasks t ON t.column_id = c.id
    WHERE c.board_id = $1
    GROUP BY c.id, c.name
    ORDER BY c.id;
  `;

  const columnsResult = await pool.query(columnsQuery, [boardId]);

  const tasksQuery = `
    SELECT
      t.id,
      t.column_id,
      t.title,
      t.description,
      t.priority,
      t.created_at
    FROM tasks t
    INNER JOIN columns c ON c.id = t.column_id
    WHERE c.board_id = $1
    ORDER BY t.created_at DESC;
  `;

  const tasksResult = await pool.query(tasksQuery, [boardId]);

  return {
    ...board,
    columns: columnsResult.rows.map((column) => ({
      ...column,
      tasks: tasksResult.rows.filter(
        (task) => task.column_id === column.id
      ),
    })),
  };
};

module.exports = {
  getBoardById,
};