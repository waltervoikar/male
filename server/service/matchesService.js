const {pool} = require("../database")
const {SELECT_MATCH_BY_ID, getAddOrUpdateQuery, SELECT_ONGOING_MATCHES, getAddOrUpdateMatchQuery} = require("./queries");

const getMatchByTournamentId = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(`IN - Get all matches for tournament(id=${id}) request`)

    let query = SELECT_MATCH_BY_ID + " WHERE p.turniir = $1"
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while reading all matches",
                error: err
            })
        }

        console.log(`OUT - Get all matches for tournament(id=${id}) result: ${JSON.stringify(results.rows)}`)
        res.status(200).send(results.rows)
    })
}

const getMatchById = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(`IN - Get match by id=${id}`)

    let query = SELECT_MATCH_BY_ID + " WHERE p.id = $1"
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while getting match by id",
                error: err
            })
        }
        console.log("OUT - Get match by id result: " + JSON.stringify(results.rows))
        res.status(200).send(results.rows[0])
    })
}

const getOngoingMatches = (req, res) => {
    console.log("IN - Get ongoing matches request")

    pool.query(SELECT_ONGOING_MATCHES, (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while getting ongoing matches",
                error: err
            })
        }
        console.log("OUT - Get ongoing matches result: " + JSON.stringify(results.rows))
        res.status(200).send(results.rows)
    })
}

const addMatchToTournament = (req, res) => {
    const {tournamentId, white, black, startTime, endTime, winner, isUpdate, matchId} = req.body
    const update = JSON.parse(isUpdate);
    const id = isUpdate ? matchId : tournamentId
    console.log(`IN - Add match to tournament(id=${tournamentId}, update=${update}) request: ${JSON.stringify(req.body)}`);

    if (update && !matchId) {
        res.status(400).send({
            msg: "Match id is required for update"
        })
        return
    }

    const white_result = winner === "Valge" ? 2 : winner === "Must" ? 0 : 1;
    const black_result = winner === "Must" ? 2 : winner === "Valge" ? 0 : 1;

    const query = getAddOrUpdateMatchQuery(update)
    console.log(white_result)
    console.log(black_result)
    console.log(query)
    pool.query(query, [id, white, black, startTime, endTime, white_result, black_result], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while adding match to tournament",
                error: err
            })
        }

        console.log(`IN - Add match to tournament(id=${tournamentId}, update=${update}) result: ${JSON.stringify(results.rows)}`)
        res.status(200).send({
            msg: "Match added successfully"
        })
    })
}

module.exports = { getMatchByTournamentId, getMatchById, addMatchToTournament, getOngoingMatches }
