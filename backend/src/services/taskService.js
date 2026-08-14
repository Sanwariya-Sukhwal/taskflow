const pool = require("../config/db");

const createTask = async ({
  columnId,
  title,
  description,
  priority,
}) => {
  const query = `
    INSERT INTO tasks (
      column_id,
      title,
      description,
      priority
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    columnId,
    title,
    description || null,
    priority || "Medium",
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


const updateTask = async (
  id,
  {
    title,
    description,
    priority,
  }
) => {
  const query = `
    UPDATE tasks
    SET
      title = $1,
      description = $2,
      priority = $3
    WHERE id = $4
    RETURNING *;
  `;

  const values = [
    title,
    description || null,
    priority || "Medium",
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


const deleteTask = async (id) => {
  const query = `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const moveTask = async (id, columnId) => {
  const query = `
    UPDATE tasks
    SET column_id = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [columnId, id]);

  return result.rows[0];
};

const getTasksByPriority = async (priority) => {
  const query = `
    SELECT
      id,
      column_id,
      title,
      description,
      priority,
      created_at
    FROM tasks
    WHERE priority = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [priority]);

  return result.rows;
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  getTasksByPriority,
};