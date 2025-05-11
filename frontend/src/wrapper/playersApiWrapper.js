import {formatDate} from "@/utils/dateFormatter.js";
import apiClient from "@/wrapper/axiosClient.js";

export async function fetchAllPlayers() {
  try {
    const response = await apiClient.get("/players");
    return mapPlayersData(response.data);
  } catch (error) {
    console.error('Error fetching players', error);
  }
}

export async function fetchPlayerById(playerId) {
  try {
    const response = await apiClient.get(`/players/${playerId}`);
    return mapPlayerData(response.data);
  } catch (error) {
    console.error('Error fetching player', error);
  }
}

export async function fetchPlayersByClubId(clubId) {
  try {
    const response = await apiClient.get(`/players/club/${clubId}`);
    return mapPlayersData(response.data);
  } catch (error) {
    console.error('Error fetching players in club', error);
  }
}

export async function fetchPlayerStatistics(playerId) {
  try {
    const response = await apiClient.get(`/players/statistics/${playerId}`);
    return mapPlayerStatistics(response.data);
  } catch (error) {
    console.error('Error fetching player statistics', error);
  }
}

export async function fetchTopPlayers(limit) {
  try {
    const response = await apiClient.get( `/players/top/${limit}`);
    return mapPlayersData(response.data);
  } catch (error) {
    console.error('Error fetching top players', error);
  }
}

export async function fetchKlubiParimad(klubiNimi) {
  try {
    const response = await apiClient.get( `/players/klubiparimad/${klubiNimi}`);
    return mapKlubiParimadMangijad(response.data);
  } catch (error) {
    console.error('Viga klubi parimate mängijate andmete pärimisel', error);
  }
}

export async function addPlayer(player) {
  try {
    await apiClient.post('/players', player);
  } catch (error) {
    console.error('Error adding club', error);
  }
}

export async function removePlayer(playerId) {
  try {
    await apiClient.delete(`/players/${playerId}`);
  } catch (error) {
    console.error('Error deleting player', error);
  }
}

function mapPlayersData(players) {
  return players.map(player => {
    return mapPlayerData(player)
  })
}

function mapPlayerData(player) {
  return {
    id: player.id,
    name: player.eesnimi + ' ' + player.perenimi,
    club: player.klubi == null ? '-' : player.klubi,
    dateOfBirth: formatDate(player.synniaeg),
    gender: player.sugu.toUpperCase(),
    ranking: player.ranking,
    firstName: player.eesnimi,
    lastName: player.perenimi,
    idCode: player.isikukood,
  }
}

function mapPlayerStatistics(playerStatistics) {
  return {
    match_count: Number(playerStatistics.match_count),
    win_count: Number(playerStatistics.win_count),
    white_match_count: Number(playerStatistics.white_match_count),
    white_win_count: Number(playerStatistics.white_win_count),
    black_match_count: Number(playerStatistics.black_match_count),
    black_win_count: Number(playerStatistics.black_win_count),
    longest_match: formatTime(playerStatistics.longest_match),
  }
}

function mapKlubiParimadMangijad(players) {
  return players.map(player => {
    return mapKlubiParimad(player)
  })
}

function mapKlubiParimad(klubiParimad) {
  return {
    nimi: klubiParimad.isik,
    punktid: klubiParimad.punktisumma,
  }
}

function formatTime(timeObj) {
  if (timeObj === null) {
    return null
  }
  const minutes = timeObj.minutes;
  const seconds = String(timeObj.seconds).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
