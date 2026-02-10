import axios from "axios";

const API = "http://localhost:5000";

export const fetchSummary = (date) =>
  axios.get(`${API}/summary/${date}`).then((res) => res.data);

export const fetchLogs = (date) =>
  axios.get(`${API}/logs/${date}`).then((res) => res.data);
