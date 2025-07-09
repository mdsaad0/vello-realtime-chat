import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

//! http://localhost:5001/api is the base URL for the backend API and this 5001 port is where the backend server is running
//! axios.create() creates an instance of axios with default settings which means that you can use this instance to make requests without repeating the base URL every time
//! withCredentials: true allows sending cookies with requests, useful for authentication