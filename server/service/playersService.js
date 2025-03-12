const {pool} = require("../database")
const {SELECT_ALL_PLAYERS, SELECT_PLAYER_BY_ID, SELECT_ALL_PLAYERS_IN_CLUB, SELECT_PLAYER_STATISTICS,
    SELECT_TOP_PLAYERS, INSERT_PLAYER, getAddOrUpdatePlayerQuery, DELETE_PLAYER
} = require("./queries");

const getAllPlayers = (req, res) => {
    console.log("IN - Get all players request")

    pool.query(SELECT_ALL_PLAYERS, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).send({
                message: "Error while reading all players",
                error: err
            })
        }

        console.log("OUT - Get all players result: " + JSON.stringify(results.rows))
        res.status(200).send(results.rows)
    })
}

const getPlayerById = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(`IN - Get player(id=${id}) request`)

    pool.query(SELECT_PLAYER_BY_ID, [id], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: `Error while reading player(id=${id})`,
                error: err
            })
        }

        console.log(`OUT - Get player(id=${id}) result: ${JSON.stringify(results.rows[0])}`)
        res.status(200).send(results.rows[0])
    })
}

const getPlayersByClubId = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(`IN - Get players for club(id=${id})`)

    pool.query(SELECT_ALL_PLAYERS_IN_CLUB, [id], (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).send({
                message: `Error while reading players for club(id=${id})`,
                error: err
            })
        }

        console.log(`OUT - Get players for club(id=${id}) result: ${JSON.stringify(results.rows)}`)
        res.status(200).send(results.rows)
    })
}

const getPlayerStatistics = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(`IN - Get player(id=${id}) statistics request`)

    pool.query(SELECT_PLAYER_STATISTICS, [id], (err, results) => {
        if (err) {
            return res.status(500).send({
                message: `Error while reading player statistics for player(id=${id})`,
                error: err
            })
        }

        console.log(`OUT - Get player(id=${id}) statistics result: ${JSON.stringify(results.rows[0])}`)
        res.status(200).send(results.rows[0])
    })
}

const getTopPlayers = (req, res) => {
    const limit = parseInt(req.params.limit)
    console.log(`IN - Get top players request (limit=${limit})`)

    pool.query(SELECT_TOP_PLAYERS, [limit], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: `Error while reading top players`,
                error: err
            })
        }

        console.log(`OUT - Get top players result (limit=${limit}): ${JSON.stringify(results.rows)}`)
        res.status(200).send(results.rows)
    })
}

const addPlayer = (req, res) => {
    const {firstName, lastName, club, dateOfBirth, gender, ranking, isUpdate, playerId} = req.body
    const update = JSON.parse(isUpdate)
    console.log(`IN - Add player(first=${firstName}, last=${lastName}, update=${update}) request`)

    const query = getAddOrUpdatePlayerQuery(isUpdate)
    let values = [firstName, lastName, club, dateOfBirth, gender, ranking]
    if (update) {
        values.push(playerId)
    }
    pool.query(query, values, (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: `Error while adding player(${firstName} ${lastName})`,
                error: err
            })
        }

        console.log(`OUT - Add player(${firstName} ${lastName}) result: success`)
        res.status(201).send(`Player added with ID: ${results.insertId}`)
    });
}

const deletePlayer = (req, res) => {
    const playerId = parseInt(req.params.playerId)
    console.log(`IN - Delete player(id=${playerId}) request`)

    pool.query(DELETE_PLAYER, [playerId], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: `Error while deleting player(id=${playerId})`,
                error: err
            })
        }

        console.log(`OUT - Delete player(id=${playerId}) result: success`)
        res.status(200).send(`Player deleted with ID: ${playerId}`)
    })
}

module.exports = {
    getAllPlayers,
    getPlayerById,
    getPlayersByClubId,
    getPlayerStatistics,
    addPlayer,
    getTopPlayers,
    deletePlayer,
}
