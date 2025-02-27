const { pool } = require("../database")

const getAllTournaments = (req, res) => {
  console.log("IN - Get all tournaments request")

  let query = `
  SELECT t.id, t.nimi, t.alguskuupaev, t.loppkuupaev, a.nimi AS toimumiskoht FROM turniirid t
  LEFT JOIN asulad a ON t.asula = a.id
  ORDER BY loppkuupaev DESC
  `

  pool.query(query, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).send({
        message: "Error while reading all tournaments",
        error: err
      })
    }
    console.log("OUT - Get all tournaments result: " + JSON.stringify(results.rows))
    res.status(200).send(results.rows)
  })
}

const getTournamentById = (req, res) => {
  const id = parseInt(req.params.id)
  console.log(`IN - Get tournament(id=${id}) request`)

  let query = `
  SELECT t.id, t.nimi, t.alguskuupaev, t.loppkuupaev, a.nimi AS toimumiskoht FROM turniirid t
  LEFT JOIN asulad a ON t.asula = a.id
  WHERE t.id = $1
  `

  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        message: `Error while reading tournament(id=${id})`,
        error: err
      })
    }
    console.log(`OUT - Get tournament(id=${id}) result: ${JSON.stringify(results.rows)}`)
    res.status(200).send(results.rows[0])
  })
}

const addTournament = (req, res) => {
  console.log("IN - Add tournament request")

  const { name, location, startDate, endDate } = req.body
  console.log(`Add tournament: ${name}, ${location}, ${startDate}, ${endDate}`)

  let query = `
  INSERT INTO turniirid (nimi, asula, alguskuupaev, loppkuupaev)
  VALUES ($1, $2, $3, $4)
  RETURNING id
  `

  pool.query(query, [name, location, startDate, endDate], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: "Error while adding tournament",
        error: err
      })
    }
    console.log(`OUT - Add tournament result: ${JSON.stringify(results.rows[0])}`)
    res.status(201).send(results.rows[0])
  })
}

module.exports = { getAllTournaments, getTournamentById, addTournament }
