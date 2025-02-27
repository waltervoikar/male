/* eslint-env node */
const express = require('express');
const cors = require('cors')
const {getAllPlayers, getPlayerById, getPlayersByClubId, getPlayerStatistics} = require("./service/playersService");
const {getAllClubs, getClubById} = require("./service/clubsService");
const {getAllTournaments, getTournamentById} = require("./service/tournamentsService");
const {getMatchByTournamentId, addMatchToTournament} = require("./service/matchesService");


const app = express();
const USE_SSL = process.env.USE_SSL === 'true'


app.use(cors({
  origins: ['http://localhost:8080', process.env.CLOUD_URL]
}));


app.use(express.json());

app.get("/api/players", getAllPlayers)
app.get("/api/players/:id", getPlayerById)
app.get("/api/players/club/:id", getPlayersByClubId)
app.get("/api/players/statistics/:id", getPlayerStatistics)

app.get("/api/clubs", getAllClubs)
app.get("/api/clubs/:id", getClubById)

app.get("/api/tournaments", getAllTournaments)
app.get("/api/tournaments/:id", getTournamentById)

app.get("/api/matches/:id", getMatchByTournamentId)
app.post("/api/matches", addMatchToTournament)

if (!process.env.CLOUD_URL) {
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
