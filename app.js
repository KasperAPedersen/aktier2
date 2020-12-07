let usePort = 3000;
//
let stocks = []; // name, currency, marked, price, marked status, day high, day low, currency symbol
//
let unirest = require('unirest'); // Requiring unirest module -> used for api calls
let express = require('express'); // Requiring express module -> used as bridge between server/client
let app = new express(); // Creating an instance of the express module
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

app.listen(usePort, (err) => {
    if(!err) {
        app.use(express.static('public'));
        console.log(`Listening on port ${usePort}`);
    } else {
        console.log(`Unable to listen on port ${usePort}`);
    }
});