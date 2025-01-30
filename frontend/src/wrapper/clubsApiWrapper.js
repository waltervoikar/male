import apiClient from "@/wrapper/axiosClient.js";

export async function fetchAllClubs() {
  try {
    const response = await apiClient.get("/clubs");
    return mapClubsData(response.data);
  } catch (error) {
    console.error('Error fetching clubs', error);
  }
}

export async function fetchClubById(clubId) {
  try {
    const response = await apiClient.get(`/clubs/${clubId}`);
    return mapClubData(response.data);
  } catch (error) {
    console.error('Error fetching club', error);
  }
}

function mapClubsData(rawClubData) {
  return rawClubData.map(club => {
    return mapClubData(club)
  });
}

function mapClubData(club) {
  return {
    id: club.id,
    name: club.nimi,
    location: club.asukoht,
    membersCount: club.members,
    averageRating: club.average_rating == null ? 0 : club.average_rating
  };
}
