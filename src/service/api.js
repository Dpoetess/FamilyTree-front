import axios from 'axios';

const API_URL = '/api/persons/';

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