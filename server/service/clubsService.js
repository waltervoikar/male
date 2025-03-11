const {pool} = require("../database")
const {SELECT_ALL_CLUBS, SELECT_CLUB_BY_ID, SELECT_TOP_CLUBS, INSERT_CLUB} = require("./queries");

const getAllClubs = (req, res) => {
    console.log("IN - Get all clubs request")

    pool.query(SELECT_ALL_CLUBS, (err, results) => {
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

    pool.query(SELECT_CLUB_BY_ID, [id], (err, results) => {
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

const getTopClubs = (req, res) => {
    const limit = parseInt(req.params.limit)
    console.log(`IN - Get top clubs (limit=${limit})`)

    pool.query(SELECT_TOP_CLUBS, [limit], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while reading top clubs:",
                error: err
            })
        }
        console.log("OUT - Get top clubs" + JSON.stringify(results.rows))
        res.status(200).send(results.rows)
    })
}

const addClub = (req, res) => {
    const {name, location} = req.body
    console.log(`IN: Add club request: club(name=${name}, location=${location})`)

    pool.query(INSERT_CLUB, [name, location], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).send({
                message: "Error while adding club",
                error: err
            })
        }

        console.log(`OUT - Add club result: ${JSON.stringify(results.rows[0])}`)
        res.status(200).send(results.rows[0])
    })
}

module.exports = { getAllClubs, getClubById, addClub, getTopClubs }
