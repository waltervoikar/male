const { pool } = require("../database")

const getAllTournaments = (req, res) => {
  let query = `
  SELECT * FROM turniirid t
  ORDER BY loppkuupaev DESC
  `
  console.log("get all tournaments")

  pool.query(query, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).send({
        msg: "Error querying tournaments",
        error: err
      })
    }
    res.status(200).send(results.rows)
  })
}

const getTournamentById = (req, res) => {
  const id = parseInt(req.params.id)
  let query = `
  SELECT * FROM turniirid t
  WHERE t.id = $1
  `

  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: "Error querying tournaments",
        error: err
      })
    }
    res.status(200).send(results.rows[0])
  })
}

module.exports = { getAllTournaments, getTournamentById }
