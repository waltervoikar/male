const {pool} = require("../database")

const getAllPlayers = (req, res) => {
    console.log("IN - Get all players request")

    let query = `
      SELECT i.id, i.eesnimi, i.perenimi, k.nimi AS klubi, i.synniaeg, i.sugu, i.ranking FROM isikud i
        LEFT JOIN klubid k ON i.klubis = k.id
  `
    pool.query(query, (err, results) => {
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

    let query = `
      SELECT i.id, i.eesnimi, i.perenimi, k.nimi AS klubi, i.synniaeg, i.sugu, i.ranking FROM isikud i
        LEFT JOIN klubid k ON i.klubis = k.id
        WHERE i.id = $1
  `
    pool.query(query, [id], (err, results) => {
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

    let query = `
      SELECT i.id, i.eesnimi, i.perenimi, k.nimi AS klubi, i.synniaeg, i.sugu, i.ranking FROM isikud i
        LEFT JOIN KLUBID k ON i.klubis = k.id
        WHERE i.klubi = $1
  `
    pool.query(query, [id], (err, results) => {
        if (err) {
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

    let query = `
    SELECT
    COUNT(*) AS match_count,
    SUM(
      CASE
        WHEN (p.valge = $1 AND p.valge_tulemus = 2)
          OR (p.must = $1 AND p.must_tulemus = 2)
        THEN 1 ELSE 0
      END
    ) AS win_count,
    SUM(
      CASE
        WHEN p.valge = $1 THEN 1 ELSE 0
      END
    ) AS white_match_count,
    SUM(
      CASE
        WHEN p.valge = $1 AND p.valge_tulemus = 2
        THEN 1 ELSE 0
      END
    ) AS white_win_count,
    SUM(
      CASE
        WHEN p.must = $1 THEN 1 ELSE 0
      END
    ) AS black_match_count,
    SUM(
      CASE
        WHEN p.must = $1 AND p.must_tulemus = 2
        THEN 1 ELSE 0
      END
    ) AS black_win_count,
    (SELECT (p.lopphetk - p.algushetk) AS duration FROM partiid p
     WHERE p.valge = $1 or p.must = $1
     ORDER by duration DESC
     LIMIT 1 ) AS longest_match
    FROM partiid p
    WHERE p.valge = $1
       OR p.must = $1;
  `
    pool.query(query, [id], (err, results) => {
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

const addPlayer = (req, res) => {
    const {firstName, lastName, club, dateOfBirth, gender, ranking} = req.body
    console.log(`IN - Add player(${firstName} ${lastName}) request`)

    let query = `
        INSERT INTO isikud (eesnimi, perenimi, klubis, synniaeg, sugu, ranking)
        VALUES ($1, $2, $3, $4, $5, $6)
    `
    pool.query(query, [firstName, lastName, club, dateOfBirth, gender, ranking], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: `Error while adding player(${firstName} ${lastName})`,
                error: err
            })
        }

        console.log(`OUT - Add player(${firstName} ${lastName}) result: success`)
        res.status(201).send(`Player added with ID: ${results.insertId}`)
    })
}

module.exports = {getAllPlayers, getPlayerById, getPlayersByClubId, getPlayerStatistics, addPlayer}
