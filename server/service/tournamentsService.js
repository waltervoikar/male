const { pool } = require("../database")
const {SELECT_ALL_TOURNAMENTS, SELECT_ONGOING_TOURNAMENTS, SELECT_TOURNAMENT_BY_ID, INSERT_TOURNAMENT,
  getAddOrUpdateTournamentQuery, DELETE_TOURNAMENT
} = require("./queries");

const getAllTournaments = (req, res) => {
  console.log("IN - Get all tournaments request")

  pool.query(SELECT_ALL_TOURNAMENTS, (err, results) => {
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

const getOngoingTournaments = (req, res) => {
  console.log("IN - Get ongoing tournaments request")

  pool.query(SELECT_ONGOING_TOURNAMENTS, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: "Error while reading ongoing tournaments",
        error: err
      })
    }
    console.log("OUT - Get ongoing tournaments result: " + JSON.stringify(results.rows))
    res.status(200).send(results.rows)
  })
}

const getTournamentById = (req, res) => {
  const id = parseInt(req.params.id)
  console.log(`IN - Get tournament(id=${id}) request`)

  pool.query(SELECT_TOURNAMENT_BY_ID, [id], (err, results) => {
    if (err) {
      console.error(err)
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
  const { name, location, startDate, endDate, isUpdate, tournamentId } = req.body
  const update = JSON.parse(isUpdate);
  console.log(`IN - Add tournament request tournament=(name=${name}, location=${location}, start=${startDate}, end=${endDate}, update=${update})`)

  const query = getAddOrUpdateTournamentQuery(update)
  let values = [name, location, startDate, endDate]
  if (update) {
    values.push(tournamentId)
  }
  pool.query(query, values, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: "Error while adding tournament",
        error: err
      })
    }
    console.log(`OUT - Add tournament result: OK`)
    res.status(201).send()
  })
}

const deleteTournament = (req, res) => {
  const id = parseInt(req.params.tournamentId)
  console.log(`IN - Delete tournament(id=${id}) request`)

  pool.query(DELETE_TOURNAMENT, [id], (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: `Error while deleting tournament(id=${id})`,
        error: err
      })
    }
    console.log(`OUT - Delete tournament(id=${id}) result: OK`)
    res.status(200).send()
  })
}

module.exports = { getAllTournaments, getTournamentById, addTournament, getOngoingTournaments, deleteTournament }
