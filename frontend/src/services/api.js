import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const submitComplaint = (data) =>
  API.post("/complaints", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getComplaints = () =>
  API.get("/complaints");

export const trackComplaint = (id) =>
  API.get(`/complaints/track/${id}`);

export const updateComplaint = (id, data) =>
  API.put(`/complaints/${id}`, data);