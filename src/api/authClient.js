import axios from "axios";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export async function loginRequest(email, password) {
  const response = await authClient.post("/auth/login", { email, password });
  return response.data;
}