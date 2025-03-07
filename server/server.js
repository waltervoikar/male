/* eslint-env node */
const express = require('express');
const cors = require('cors')
const {getAllPlayers, getPlayerById, getPlayersByClubId, getPlayerStatistics, addPlayer, getTopPlayers} = require("./service/playersService");
const {getAllClubs, getClubById, addClub, getTopClubs} = require("./service/clubsService");
const {getAllTournaments, getTournamentById, addTournament, getOngoingTournaments} = require("./service/tournamentsService");
const {getMatchByTournamentId, addMatchToTournament, getOngoingMatches} = require("./service/matchesService");
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
app.get("/api/matches/:id", getMatchByTournamentId)
app.post("/api/matches", addMatchToTournament)

app.get("/api/locations", getAllLocations)

if (!process.env.CLOUD_URL && false) {
  const fs = require('fs');
  const https = require('https');

  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEYFILE || '/etc/letsencrypt/live/hollak.duckdns.org/privkey.pem'),
    cert: fs.readFileSync(process.env.SSL_CERTFILE || '/etc/letsencrypt/live/hollak.duckdns.org/fullchain.pem'),
  };

  https.createServer(sslOptions, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
} else {
  app.listen(3000, () => {
  });
}
