import {formatDate, formatTimestamp} from "@/utils/dateFormatter.js";
import apiClient from "@/wrapper/axiosClient.js";

export async function fetchMatchesByTournamentId(tournamentId) {
  try {
    const response = await apiClient.get(`/matches/${tournamentId}`);
    return mapMatchesData(response.data);
  } catch (error) {
    console.error('Error fetching matches', error);
  }
}

export async function addMatchToTournament(match) {
  try {
    await apiClient.post('/matches', match);
  } catch (error) {
    console.error('Error adding match', error);
  }
}

export async function fetchOngoingMatches() {
  try {
    const response = await apiClient.get("/matches/ongoing");
    return mapMatchesData(response.data);
  } catch (error) {
    console.error('Error fetching ongoing matches', error);
  }
}

function mapMatchesData(matches) {
  return matches.map(match => {
    return mapMatchData(match)
  })
}

function mapMatchData(match) {
  return {
    id: match.id,
    white: {
      id: match.valge_id,
      fullName: match.valge_perenimi + ", " + match.valge_eesnimi,
      club: match.valge_klubi
    },
    black: {
      id: match.musti_id,
      fullName: match.must_perenimi + ", " + match.must_eesnimi,
      club: match.must_klubi
    },
    startTime: formatTimestamp(match.algushetk),
    endTime: formatTimestamp(match.lopphetk),
    winner: match.voitja
  }
}
