const { pool } = require("../database")

const getAllClubs = (req, res) => {
  let query = `
    SELECT k.*, COUNT(i.id) as members, ROUND(AVG(i.ranking), 1) as average_rating
    FROM klubid k
    LEFT JOIN isikud i ON k.id = i.klubi
    GROUP BY k.id
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

const getClubById = (req, res) => {
  const id = parseInt(req.params.id)
  let query = `
    SELECT k.*, COUNT(i.id) as members, ROUND(AVG(i.ranking), 1) as average_rating
    FROM klubid k
    LEFT JOIN isikud i ON k.id = i.klubi
    WHERE k.id = $1
    GROUP BY k.id
  `
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: "Error querying clubs"
      })
    }
    res.status(200).send(results.rows[0])
  })
}

module.exports = { getAllClubs, getClubById }
