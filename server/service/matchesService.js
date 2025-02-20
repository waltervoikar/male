const {pool} = require("../database")


const getMatchByTournamentId = (req, res) => {
    const id = parseInt(req.params.id)
    console.log("IN - Get all matches request")

    let query = `
  SELECT
    p.turniir,
    p.algushetk,
    p.lopphetk,
    valge.id AS valge_id,
    valge.eesnimi AS valge_eesnimi,
    valge.perenimi AS valge_perenimi,
    valge.klubi AS valge_klubi,
    must.id AS must_id,
    must.eesnimi AS must_eesnimi,
    must.perenimi AS must_perenimi,
    must.klubi AS must_klubi
FROM
    partiid p
LEFT JOIN (
    SELECT
        i.id,
        i.eesnimi,
        i.perenimi,
        k.nimi AS klubi
    FROM
        isikud i
    LEFT JOIN
        klubid k ON i.klubis = k.id
) valge ON valge.id = p.valge
LEFT JOIN (
    SELECT
        i.id,
        i.eesnimi,
        i.perenimi,
        k.nimi AS klubi
    FROM
        isikud i
    LEFT JOIN
        klubid k ON i.klubis = k.id
) must ON must.id = p.must
WHERE
    p.turniir = $1;
  `
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while reading all matches",
                error: err
            })
        }

        console.log(`OUT - get all matches result: ${JSON.stringify(results.rows)}`)
        res.status(200).send(results.rows)
    })
}

const addMatchToTournament = (req, res) => {
    const {tournamentId, white, black, startTime, endTime} = req.body
    console.log(`IN - Add match to tournament(id=${tournamentId}) request: ${JSON.stringify(req.body)}`)

    let query = `
    INSERT INTO partiid (turniir, valge, must, algushetk, lopphetk)
    VALUES ($1, $2, $3, $4, $5)
    `
    pool.query(query, [tournamentId, white, black, startTime, endTime], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while adding match to tournament",
                error: err
            })
        }

        console.log(`IN - Add match to tournament(id=${tournamentId}) result: ${JSON.stringify(results.rows)}`)
        res.status(200).send({
            msg: "Match added successfully"
        })
    })
}

module.exports = {getMatchByTournamentId, addMatchToTournament}
