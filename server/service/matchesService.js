const { pool } = require("../database")


const getMatchByTournamentId = (req, res) => {
  const id = parseInt(req.params.id)
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
        klubid k ON i.klubi = k.id
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
        klubid k ON i.klubi = k.id
) must ON must.id = p.must
WHERE
    p.turniir = $1;
  `
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: "Error querying matches"
      })
    }
    res.status(200).send(results.rows)
  })
}

module.exports = { getMatchByTournamentId }
