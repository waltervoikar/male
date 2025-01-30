/* eslint-env node */
const express = require('express');
const cors = require('cors')
const {getAllPlayers, getPlayerById, getPlayersByClubId, getPlayerStatistics} = require("./service/playersService");
const {getAllClubs, getClubById} = require("./service/clubsService");
const {getAllTournaments, getTournamentById} = require("./service/tournamentsService");
const {getMatchByTournamentId} = require("./service/matchesService");


const app = express();
const USE_SSL = process.env.USE_SSL === 'true'
const USE_CORS = process.env.USE_CORS === 'true'

if (USE_CORS) {
  app.use(cors({
    origins: ['http://localhost:8080', "http://frontend:8080"]
  }));
}

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

if (USE_SSL) {
  const fs = require('fs');
  const https = require('https');

  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEYFILE),
    cert: fs.readFileSync(process.env.SSL_CERTFILE),
  };

  https.createServer(sslOptions, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
} else {
  const port = parseInt(process.env.SERVER_PORT, 10) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log("Server is listening on port " + port)
  });
}
