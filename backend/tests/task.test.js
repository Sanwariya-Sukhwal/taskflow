const request = require("supertest");
const app = require("../src/app");

describe("Task API", () => {
  test("creating a task without title should fail", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        columnId: 1,
        description: "Task without title",
        priority: "High",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "Task title is required"
    );
  });
});