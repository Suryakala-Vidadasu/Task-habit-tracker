import api from "./api";

export const habitService = {
  getHabits: (params) => api.get("/habits", { params }).then((res) => res.data),
  getHabit: (id) => api.get(`/habits/${id}`).then((res) => res.data),
  createHabit: (data) => api.post("/habits", data).then((res) => res.data),
  updateHabit: (id, data) => api.put(`/habits/${id}`, data).then((res) => res.data),
  deleteHabit: (id) => api.delete(`/habits/${id}`).then((res) => res.data),
  checkHabit: (id, date) =>
    api.post(`/habits/${id}/check`, date ? { date } : {}).then((res) => res.data),
  getHistory: (id, params) =>
    api.get(`/habits/${id}/history`, { params }).then((res) => res.data),
};
