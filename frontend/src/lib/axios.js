import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.mode === "development"
      ? "http://localhost:3000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

export default instance;
