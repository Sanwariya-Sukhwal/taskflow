const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/db");

describe("Move Task API", () => {
  let taskId;

  beforeAll(async () => {
    const result = await pool.query(`
      INSERT INTO tasks (
        column_id,
        title,
        description,
        priority
      )
      VALUES (1, 'Move Test Task', 'Testing task move', 'High')
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

  test("moving a task updates its column", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/move`)
      .send({
        columnId: 2,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.column_id).toBe(2);
  });
});