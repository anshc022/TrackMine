import axios from 'axios';

// Update this with your Flask backend URL
const API_URL = 'https://405lqdkh-5000.inc1.devtunnels.ms/api'; 

// Function to register a user
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Function to log in a user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Function to create a project
export const createProject = async (projectData, token) => {
  try {
    const response = await axios.post(`${API_URL}/project/create`, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Function to join a project
export const joinProject = async (invitationCode, token) => { // Update here to use invitation code
  try {
    const response = await axios.post(`${API_URL}/project/join`, { invitation_code: invitationCode }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error joining project:", error);
    throw error;
  }
};

// Function to get user projects
export const getUserProjects = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/project/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.projects;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};

// Function to get user profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user_data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Function to get project details
export const getProjectDetails = async (projectId, token) => {
  try {
    const response = await axios.get(`${API_URL}/project/details/${projectId}`, { // Updated endpoint
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.project_details; // Ensure this matches the backend response
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};
