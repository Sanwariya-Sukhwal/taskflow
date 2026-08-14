const pool = require("../src/config/db");
const taskService = require("../src/services/taskService");

describe("Database layer", () => {
  let taskId;

  beforeAll(async () => {
    const result = await pool.query(`
      INSERT INTO tasks (
        column_id,
        title,
        description,
        priority
      )
      VALUES (
        1,
        'Database Test Task',
        'Testing database query',
        'High'
      )
      RETURNING id;
    `);

    taskId = result.rows[0].id;
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [taskId]
    );

    await pool.end();
  });

  test("returns tasks with the requested priority", async () => {
    const tasks = await taskService.getTasksByPriority("High");

    expect(tasks.length).toBeGreaterThan(0);

    const testTask = tasks.find(
      (task) => task.id === taskId
    );

    expect(testTask).toBeDefined();
    expect(testTask.priority).toBe("High");
  });
});