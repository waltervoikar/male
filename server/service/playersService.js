const { pool } = require("../database")

const getAllPlayers = (req, res) => {
  let query = `
  select i.id, i.eesnimi, i.perenimi, k.nimi as klubi, i.synniaeg, i.sugu, i.ranking from isikud i
    left join klubid k on i.klubi = k.id
  `
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: "Error querying clubs"
      })
    }
    res.status(200).send(results.rows)
  })
}

const getPlayerById = (req, res) => {
  console.log(req.params.id)
  const id = parseInt(req.params.id)
  let query = `
  select i.id, i.eesnimi, i.perenimi, k.nimi as klubi, i.synniaeg, i.sugu, i.ranking from isikud i
    left join klubid k on i.klubi = k.id
    where i.id = $1
  `
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        msg: "Error querying clubs"
      })
    }
    res.status(200).send(results.rows[0])
  })
}

const getPlayersByClubId = (req, res) => {
  const id = parseInt(req.params.id)
  let query = `
  select i.id, i.eesnimi, i.perenimi, k.nimi as klubi, i.synniaeg, i.sugu, i.ranking from isikud i
    left join klubid k on i.klubi = k.id
    where i.klubi = $1
  `
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: "Error querying clubs"
      })
    }
    res.status(200).send(results.rows)
  })
}

const getPlayerStatistics = (req, res) => {
  const id = parseInt(req.params.id)
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
        msg: "Error querying player statistics"
      })
    }
    res.status(200).send(results.rows[0])
  })
}

module.exports = { getAllPlayers, getPlayerById, getPlayersByClubId, getPlayerStatistics }
