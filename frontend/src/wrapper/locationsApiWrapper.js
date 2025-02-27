import apiClient from "@/wrapper/axiosClient.js";


export async function fetchAllLocations() {
  try {
    const response = await apiClient.get("/locations");
    return mapLocations(response.data);
  } catch (error) {
    console.error('Error fetching locations', error);
  }
}

function mapLocation(rawData) {
  return {
    id: rawData.id,
    name: rawData.nimi,
  }
}

function mapLocations(responseData) {
  return responseData.map(location => {
    return mapLocation(location)
  })
}
