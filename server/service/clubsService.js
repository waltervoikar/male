const { pool } = require("../database")

const getAllClubs = (req, res) => {
  console.log("IN - Get all clubs request")

  let query = `
    SELECT k.*, COUNT(i.id) as members, ROUND(AVG(i.ranking), 1) as average_rating
    FROM klubid k
    LEFT JOIN isikud i ON k.id = i.klubis
    GROUP BY k.id
  `
  pool.query(query, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: "Error while reading all clubs",
        error: err
      })
    }

    console.log("OUT - Get all clubs result: " + JSON.stringify(results.rows))
    res.status(200).send(results.rows)
  })
}

const getClubById = (req, res) => {
  const id = parseInt(req.params.id)
  console.log(`IN - Get club(id=${id}) request`)

  let query = `
    SELECT k.nimi, a.nimi AS asukoht, f_klubisuurus($1) AS members, ROUND(AVG(i.ranking), 1) AS average_rating
    FROM klubid k
    LEFT JOIN isikud i ON k.id = i.klubis
    LEFT JOIN asulad a ON k.asula = a.id
    WHERE k.id = $1
    GROUP BY k.nimi, a.nimi
  `
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: "Error while reading club with id: " + id,
        error: err
      })
    }

    console.log(`OUT - Get club(id=${id}) result: ${JSON.stringify(results.rows[0])}`)
    res.status(200).send(results.rows[0])
  })
}

module.exports = { getAllClubs, getClubById }
