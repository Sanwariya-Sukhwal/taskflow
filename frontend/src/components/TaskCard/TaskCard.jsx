import { useState } from "react";
import { updateTask, deleteTask, moveTask } from "../../services/taskApi";
import "./TaskCard.css";

const TaskCard = ({ task, columns, onTaskChanged }) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });

      setEditing(false);

      if (onTaskChanged) {
        await onTaskChanged();
      }
    } catch (error) {
      setError(error.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteTask(task.id);

      if (onTaskChanged) {
        await onTaskChanged();
      }
    } catch (error) {
      setError(error.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (event) => {
    const newColumnId = Number(event.target.value);

    if (newColumnId === task.column_id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await moveTask(task.id, newColumnId);

      if (onTaskChanged) {
        await onTaskChanged();
      }
    } catch (error) {
      setError(error.message || "Failed to move task");
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="task-card">
        <form onSubmit={handleUpdate} className="edit-task-form">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Task description"
            rows="3"
          />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {error && <div className="task-error">{error}</div>}

          <div className="task-actions">
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      {task.description && <p>{task.description}</p>}

      <span className={`priority ${task.priority.toLowerCase()}`}>
        {task.priority}
      </span>

      {error && <div className="task-error">{error}</div>}

      <div className="task-actions">
        <button
          type="button"
          className="edit-button"
          onClick={() => setEditing(true)}
          disabled={loading}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>

      {columns && columns.length > 0 && (
        <select
          value={task.column_id}
          onChange={handleMove}
          disabled={loading}
          className="move-select"
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              Move to {column.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default TaskCard;