const { pool } = require("../database")

const getAllLocations = (req, res) => {
    console.log("IN - Get all locations request")

    let query = `
        SELECT * FROM asulad a
    `
    pool.query(query, (err, results) => {
        if (err) {
        console.error(err)
        return res.status(500).send({
            message: "Error while reading all locations",
            error: err
        })
        }

        console.log("OUT - Get all locations result: " + JSON.stringify(results.rows))
        res.status(200).send(results.rows)
    })
}

module.exports = { getAllLocations }
