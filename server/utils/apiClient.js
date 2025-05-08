import axios from "axios";

export const createApiClient = (baseURL, apiKey) => {
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  });
};