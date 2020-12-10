let usePort = 3000;
let url = "localhost";
//
let db = require('./db.js');
let encryption = require('./encryption.js'); // Requiring crypto module -> used to encrypt/decrypt user information
let unirest = require('unirest'); // Requiring unirest module -> used for api calls
let express = require('express'); // Requiring express module -> used as bridge between server/client
let session = require('express-session');
let bodyParser = require('body-parser');
let app = new express(); // Creating an instance of the express module

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

/*
app.get('/stock/add', (req, res) => {
    if(req.query["name"] != undefined) {
        stocks.push([req.query["name"], "DKK", "Nasdaq", 0, "åben", 1.0, 0.1, "DKK"]);
        res.send({"status": 1});
    } else {
        res.send({"status": 0});
    }
    res.end();
});

app.get('/update/all', (req, res) => {
    if(stocks.length > 0) {
        for(const [index, stock] of stocks.entries()) {
            console.log(`Checking: ${stock[0]}`);
            let stockRequest = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary");
            stockRequest.query({
                "symbol": stock[0]
            });
            stockRequest.headers({
                "x-rapidapi-key": "2e7437b3e3msh3e6132d3e8e542fp1d975bjsn39f7518cd532",
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                "useQueryString": true
            });
            stockRequest.end(function (stockReponse) {
                if (!stockReponse.error) {
                    stock[1] = stockReponse.body.price.currency;
                    stock[2] = stockReponse.body.price.exchangeName;
                    stock[3] = stockReponse.body.price.regularMarketPrice.fmt;
                    stock[4] = stockReponse.body.price.marketState;
                    stock[5] = stockReponse.body.price.regularMarketDayHigh.fmt;
                    stock[6] = stockReponse.body.price.regularMarketDayLow.fmt;
                    stock[7] = stockReponse.body.price.currencySymbol;
                }
            });
        }

        setTimeout(() => {
            res.send(stocks);
            res.end();
        }, 5000);
    }
});*/


app.get('/stocks/add', (req, res) => {
    let name = req.query["name"];
    if(req.session.loggedIn) {
        if(name != undefined) {
            db.query(`SELECT * FROM stocks WHERE userID = ${req.session.userID} AND name = '${name}'`, (lookupResult) => {
                if(lookupResult.length <= 0) {
                    db.query(`INSERT INTO stocks (userID, name) VALUES ('${req.session.userID}', '${name}')`, (result) => {
                        if(res != undefined) {
                            res.send({"status": 1});
                            res.end();
                        }
                    });
                } else {
                    res.send({"status": 0});
                    res.end();
                }
            })
        } else {
            res.send({"status": 0});
            res.end();
        }
    }
});

app.get('/stocks/update', (req, res) => {
    if(req.session.loggedIn) {
        db.query(`SELECT * FROM stocks WHERE userID = ${req.session.userID}`, async (result) => {
            if(result != undefined) {
                let stocks = [];
                console.log(result);
                for(stock of result) {
                    let stockRequest = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary");
                    stockRequest.query({
                        "symbol": stock.name
                    });
                    stockRequest.headers({
                        "x-rapidapi-key": "2e7437b3e3msh3e6132d3e8e542fp1d975bjsn39f7518cd532",
                        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                        "useQueryString": true
                    });
                    stockRequest.end(function (stockReponse) {
                        if (!stockReponse.error) {
                            // name, currency, marked, price, marked status, day high, day low, currency symbol, stock id
                            stocks.push([stock.name, stockReponse.body.price.currency, stockReponse.body.price.exchangeName, stockReponse.body.price.regularMarketPrice.fmt, stockReponse.body.price.marketState, stockReponse.body.price.regularMarketDayHigh.fmt, stockReponse.body.price.regularMarketDayLow.fmt, stockReponse.body.price.currencySymbol, stock.id]);
                        }
                    });
                }
                await sleep(2500);
                res.send(stocks);
                console.log(stocks);
                res.end();
            } else {
                res.send({"status": 0});
                res.end();
            }
        });
    }
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

app.get('/add', (req, res) => {
    encryption.encrypt("abc", (hash) => {
        db.query(`INSERT INTO users (username, password) VALUES ('adm', '${hash}')`, (result) => {
            res.end();
        });
    })
});

app.get('/login', (req, res) => {
    if(!req.session.loggedIn) {
        let uname = req.query["uname"];
        let pword = req.query["pword"];
        if((uname != undefined && uname != "" && uname != 0) && (pword != undefined && pword != "" && pword != 0)) {
            db.query(`SELECT * FROM users WHERE username = "${uname}" LIMIT 1`, (result) => {
                if(result[0] != undefined) {
                    // Decrypt password & test if equal
                    encryption.compare(pword, result[0].password, (result) => {
                        if(result) {
                            req.session.loggedIn = true;
                            req.session.userID = 1;
                            res.send({"success": 1, "url": url, "port": usePort});
                            res.end();
                        } else {
                            res.send({"success": 0});
                            res.end();
                        }
                    });

                    
                } else {
                    res.send({"success": 0});
                    res.end();
                }
            });
            
        } else {
            res.send({"success": 0});
            res.end();
        }
    }
});

app.get(['/logout.html', '/logout'], (req, res) => {
    req.session.loggedIn = false;
    req.session.userID = 0;
    res.writeHead(307, {"location": `http://${url}:${usePort}/login.html`});
    res.end();
});

app.get('/watchlist', (req, res) => {
    if(req.session.loggedIn == undefined || !req.session.loggedIn) {
        res.send({"loggedIn": 0});
    } else {
        res.send({"loggedIn": 1});
    }
    res.end();
});

app.get('/', (req, res) => {
    res.writeHead(307, {"location": `http://${url}:${usePort}/login.html`});
    res.end();
});

app.listen(usePort, (err) => {
    if(!err) {
        app.use(express.static('public'));
        console.log(`Listening on port ${usePort}`);
    } else {
        console.log(`Unable to listen on port ${usePort}`);
    }
});