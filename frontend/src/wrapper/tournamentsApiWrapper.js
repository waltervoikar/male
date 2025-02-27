import {formatDate} from "@/utils/dateFormatter.js";
import apiClient from "@/wrapper/axiosClient.js";

export async function fetchAllTournaments() {
  try {
    const response = await apiClient.get("/tournaments");
    return mapTournamentsData(response.data);
  } catch (error) {
    console.error('Error fetching tournaments', error);
  }
}

export async function fetchTournamentById(tournamentId) {
  try {
    const response = await apiClient.get(`/tournaments/${tournamentId}`);
    return mapTournamentData(response.data);
  } catch (error) {
    console.error('Error fetching tournament', error);
  }
}

export async function addTournament(tournament) {
  try {
    await apiClient.post('/tournaments', tournament);
  } catch (error) {
    console.error('Error adding match', error);
  }
}

function mapTournamentsData(tournaments) {
  return tournaments.map(tournament => {
    return mapTournamentData(tournament)
  })
}

function mapTournamentData(tournament) {
  return {
    id: tournament.id,
    name: tournament.nimi,
    location: tournament.toimumiskoht,
    startDate: formatDate(tournament.alguskuupaev),
    endDate: formatDate(tournament.loppkuupaev),
  }
}

