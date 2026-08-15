import { useEffect, useState } from "react";
import { getBoard } from "../../services/taskApi";
import Board from "../../components/Board/Board";
import TaskForm from "../../components/TaskForm/TaskForm";
import FilterBar from "../../components/FilterBar/FilterBar";
import "./TaskBoard.css";

const TaskBoard = () => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBoard(1);
      setBoard(data);
    } catch (error) {
      setError(error.message || "Failed to load board");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, []);

  if (loading) {
    return (
      <div className="board-loading">
        Loading board...
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-error">
        <p>{error}</p>

        <button onClick={loadBoard}>
          Retry
        </button>
      </div>
    );
  }

  const filteredBoard = {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks:
        priorityFilter === "All"
          ? column.tasks
          : column.tasks.filter(
              (task) => task.priority === priorityFilter
            ),
      task_count:
        priorityFilter === "All"
          ? column.task_count
          : column.tasks.filter(
              (task) => task.priority === priorityFilter
            ).length,
    })),
  };

  return (
    <div className="task-board-page">
      <div className="task-board-header">
        <h1>{board.name}</h1>
        <p>Manage your team's tasks</p>
      </div>

      <TaskForm
        columns={board.columns}
        onTaskCreated={loadBoard}
      />

      <FilterBar
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      <Board
        board={filteredBoard}
        onTaskChanged={loadBoard}
      />
    </div>
  );
};

export default TaskBoard;