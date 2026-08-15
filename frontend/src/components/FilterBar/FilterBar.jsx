import "./FilterBar.css";

const FilterBar = ({ priority, onPriorityChange }) => {
  return (
    <div className="filter-bar">
      <label htmlFor="priority-filter">
        Filter by priority:
      </label>

      <select
        id="priority-filter"
        value={priority}
        onChange={(event) =>
          onPriorityChange(event.target.value)
        }
      >
        <option value="All">All</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
};

export default FilterBar;