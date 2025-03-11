/* eslint-env node */
const express = require('express');
const cors = require('cors')
const {getAllPlayers, getPlayerById, getPlayersByClubId, getPlayerStatistics, addPlayer, getTopPlayers} = require("./service/playersService");
const {getAllClubs, getClubById, addClub, getTopClubs} = require("./service/clubsService");
const {getAllTournaments, getTournamentById, addTournament, getOngoingTournaments} = require("./service/tournamentsService");
const {getMatchByTournamentId, addMatchToTournament, getOngoingMatches, getMatchById} = require("./service/matchesService");
const {getAllLocations} = require("./service/locationsService");


const app = express();

app.use(cors({
  origins: ['http://localhost:8080', process.env.CLOUD_URL]
}));


app.use(express.json());

app.get("/api/players", getAllPlayers)
app.get("/api/players/:id", getPlayerById)
app.get("/api/players/club/:id", getPlayersByClubId)
app.get("/api/players/statistics/:id", getPlayerStatistics)
app.get("/api/players/top/:limit", getTopPlayers)
app.post("/api/players", addPlayer)

app.get("/api/clubs", getAllClubs)
app.get("/api/clubs/:id", getClubById)
app.get("/api/clubs/top/:limit", getTopClubs)
app.post("/api/clubs", addClub)

app.get("/api/tournaments", getAllTournaments)
app.get("/api/tournaments/ongoing", getOngoingTournaments)
app.get("/api/tournaments/:id", getTournamentById)
app.post("/api/tournaments", addTournament)

app.get("/api/matches/ongoing", getOngoingMatches)
app.get("/api/matches/:id", getMatchById)
app.get("/api/matches/tournament/:id", getMatchByTournamentId)
app.post("/api/matches", addMatchToTournament)

app.get("/api/locations", getAllLocations)

app.listen(3000, () => {
});
