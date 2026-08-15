const API_URL = "http://localhost:5000/api";

export const getBoard = async (boardId = 1) => {
  const response = await fetch(`${API_URL}/boards/${boardId}`);

  if (!response.ok) {
    throw new Error("Failed to load board");
  }

  const result = await response.json();

  return result.data;
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create task");
  }

  return result.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update task");
  }

  return result.data;
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete task");
  }

  return result.data;
};

export const moveTask = async (taskId, columnId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}/move`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      columnId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to move task");
  }

  return result.data;
};

export const getTasksByPriority = async (priority) => {
  const response = await fetch(
    `${API_URL}/tasks/filter?priority=${priority}`
  );

  const data = await handleResponse(response);

  return data.data;
};