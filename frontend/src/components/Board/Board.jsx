import Column from "../Column/Column";
import "./Board.css";

const Board = ({ board, onTaskChanged }) => {
  return (
    <div className="board">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          columns={board.columns}
          onTaskChanged={onTaskChanged}
        />
      ))}
    </div>
  );
};

export default Board;