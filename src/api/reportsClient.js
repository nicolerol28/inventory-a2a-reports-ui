import axios from "axios";

const reportsClient = axios.create({
  baseURL: import.meta.env.VITE_REPORTS_API_URL,
  headers: { "Content-Type": "application/json" },
});

reportsClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

reportsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export async function generateReport(query) {
  const response = await reportsClient.post("/reports", { query });
  return response.data.report;
}