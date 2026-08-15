import { useState } from "react";
import { createTask } from "../../services/taskApi";
import "./TaskForm.css";

const TaskForm = ({ columns, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [columnId, setColumnId] = useState(
    columns.length > 0 ? columns[0].id : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!columnId) {
      setError("Please select a column");
      return;
    }

    try {
      setLoading(true);

      const task = await createTask({
        columnId: Number(columnId),
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });

      setTitle("");
      setDescription("");
      setPriority("Medium");

      setSuccess("Task created successfully");

      if (onTaskCreated) {
        await onTaskCreated(task);
      }
    } catch (error) {
      setError(error.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title">
            Title <span>*</span>
          </label>

          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">
            Description
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter task description"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority">
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-column">
              Column
            </label>

            <select
              id="task-column"
              value={columnId}
              onChange={(event) => setColumnId(event.target.value)}
            >
              {columns.map((column) => (
                <option
                  key={column.id}
                  value={column.id}
                >
                  {column.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="create-task-button"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;