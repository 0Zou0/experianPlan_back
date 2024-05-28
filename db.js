const { Pool } = require('pg')
const pool = new Pool({
    host: 'db',
    port: '5432',
    user:'eliot',
    password:'Eliot.2002',
    database:'db-back-end',
})

module.exports = pool;  