let mysql = require('mysql');
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aktier2'
})

module.exports = {
    query: (query, callback) => {
        pool.getConnection((err, con) => {
            if(err) {
                throw err;
            } else {
                con.query(query, (err, res) => {
                    con.release();
                    if(err) {
                        throw err;
                    } else {
                        callback(res);
                    }
                });
            }
        });
    }
};