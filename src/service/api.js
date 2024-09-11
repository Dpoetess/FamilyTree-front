import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/persons/';
const TREE_API_URL = 'http://127.0.0.1:8000/api/trees/';
const NODE_API_URL = 'http://127.0.0.1:8000/api/nodes/'; 

export const createPerson = async (personData) => {
  try {
    const response = await axios.post(API_URL, personData);
    return response.data;  // Return the newly created person data
  } catch (error) {
    console.error('Error creating person:', error);
    throw error;  // Rethrow to handle it in the calling function
  }
};

export const getPerson = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      return response.data;  // Return the person's data
    } catch (error) {
      console.error('Error fetching person data:', error);
      throw error;  // Rethrow the error to handle in the calling function
    }
  };

export const updatePerson = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, updatedData);
    return response.data;  // Return the updated person data
  } catch (error) {
    console.error('Error updating person:', error);
    throw error;  // Rethrow to handle it in the calling function
  }
};

export const deletePerson = async (id) => {
  try {
    await axios.delete(`${API_URL}${id}/`);
    // No response data needed for deletion
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;  // Rethrow to handle it in the calling function
  }
};

export const getTrees = async () => {
    try {
      const response = await axios.get(TREE_API_URL);
      return response.data;  // Assuming the API returns an array of trees
    } catch (error) {
      console.error('Error fetching trees:', error);
      throw error;
    }
  };

export const createTree = async (treeData) => {
    try {
      const response = await axios.post(TREE_API_URL, treeData);
      return response.data;  // Return the newly created tree data
    } catch (error) {
      console.error('Error creating tree:', error);
      throw error;
    }
  };
  
  export const getTree = async (id) => {
    try {
      const response = await axios.get(`${TREE_API_URL}${id}/`);
      return response.data;  // Return the tree's data
    } catch (error) {
      console.error('Error fetching tree data:', error);
      throw error;
    }
  };
  
  export const updateTree = async (id, updatedData) => {
    try {
      const response = await axios.put(`${TREE_API_URL}${id}/`, updatedData);
      return response.data;  // Return the updated tree data
    } catch (error) {
      console.error('Error updating tree:', error);
      throw error;
    }
  };
  
  export const deleteTree = async (id) => {
    try {
      await axios.delete(`${TREE_API_URL}${id}/`);
    } catch (error) {
      console.error('Error deleting tree:', error);
      throw error;
    }
  };

  export const createNode = async (nodeData) => {
    try {
      const response = await axios.post(NODE_API_URL, nodeData);
      return response.data;
    } catch (error) {
      console.error('Error creating node:', error);
      throw error;
    }
  };
  
  export const getNode = async (id) => {
    try {
      const response = await axios.get(`${NODE_API_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching node data:', error);
      throw error;
    }
  };
  
  export const getNodesByTree = async (treeId) => {
    try {
      const response = await axios.get(`${NODE_API_URL}?tree=${treeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nodes:', error);
      throw error;
    }
  };
  
  export const updateNode = async (id, updatedData) => {
    try {
      const response = await axios.put(`${NODE_API_URL}${id}/`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating node:', error);
      throw error;
    }
  };
  
  export const deleteNode = async (id) => {
    try {
      await axios.delete(`${NODE_API_URL}${id}/`);
    } catch (error) {
      console.error('Error deleting node:', error);
      throw error;
    }
  };