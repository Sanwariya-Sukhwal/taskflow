CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS columns (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,

    CONSTRAINT fk_columns_board
        FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    column_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_column
        FOREIGN KEY (column_id)
        REFERENCES columns(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_task_priority
        CHECK (priority IN ('Low', 'Medium', 'High'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_column_id
    ON tasks(column_id);

CREATE INDEX IF NOT EXISTS idx_columns_board_id
    ON columns(board_id);

CREATE INDEX IF NOT EXISTS idx_tasks_priority
    ON tasks(priority);