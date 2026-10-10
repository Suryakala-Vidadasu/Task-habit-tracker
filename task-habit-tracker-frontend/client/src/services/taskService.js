import api from "./api";

export const taskService = {
  getTasks: (params) => api.get("/tasks", { params }).then((res) => res.data),
  getTask: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  createTask: (data) => api.post("/tasks", data).then((res) => res.data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data).then((res) => res.data),
  deleteTask: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  toggleComplete: (id, completed) =>
    api.put(`/tasks/${id}`, { completed }).then((res) => res.data),
};
