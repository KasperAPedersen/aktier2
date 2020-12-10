let bcrypt = require('bcrypt');

let saltRounds = 10;

module.exports = {
    encrypt: (pass, callback) => {
        bcrypt.hash(pass, 10, (err, hash) => {
            if(err) {
                console.log(err);
            } else {
                callback(hash);
            }
        });
    },
    compare: (pass, hash, callback) => {
        bcrypt.compare(pass, hash, (err, res) => {
            if(err) {
                console.log(err);
            } else {
                callback(res);
            }
        });
    }
}