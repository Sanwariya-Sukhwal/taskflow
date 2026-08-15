import TaskCard from "../TaskCard/TaskCard";
import "./Column.css";

const Column = ({ column, columns, onTaskChanged }) => {
  return (
    <div className="column">
      <div className="column-header">
        <h2>{column.name}</h2>
        <span>{column.task_count}</span>
      </div>

      <div className="tasks">
        {column.tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              onTaskChanged={onTaskChanged}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;