INSERT INTO boards (name)
VALUES ('My TaskFlow Board');

INSERT INTO columns (board_id, name)
VALUES
    (1, 'To Do'),
    (1, 'In Progress'),
    (1, 'Done');

INSERT INTO tasks (
    column_id,
    title,
    description,
    priority
)
VALUES
    (1, 'Setup project', 'Initialize React and Node.js project', 'High'),
    (1, 'Create UI', 'Build the task board interface', 'Medium'),
    (2, 'Build API', 'Create backend REST endpoints', 'High'),
    (3, 'Setup database', 'Create PostgreSQL schema', 'High');