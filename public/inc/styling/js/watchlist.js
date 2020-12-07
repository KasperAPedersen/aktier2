let url = "localhost:3000";
//
document.addEventListener('DOMContentLoaded', () => {
    
});

// name, currency, marked, price, marked status, day high, day low, currency symbol
let stocks = [];

document.getElementById('submitBtn').addEventListener('click', () => {
    let stockName = document.getElementById('stockName').value;
    if(stockName != undefined) {
        fetch(`./stock/add?name=${stockName}`)
        .then((res) => {
            if(res.status !== 200) {
                throw new Error("Failure 1");
            } else {
                return res.json();
            }
        })
        .then((json) => {
            if(json.status > 0) {
                stocks.push([stockName, "DKK", "Nasdaq", 0, "åben", 1.0, 0.1, "DKK"]);
                let elem = document.createElement('div');
                elem.classList = 'stockCard';
                elem.innerHTML = `<h3 id="stock${stocks.length-1}" class="cardStockName">Stock Navn</h3><p id="stock${stocks.length-1}Price" class="cardStockPrice">00.00</p><p id="stock${stocks.length-1}MarketStatus" class="cardStockMarketStatus">Åben</p><p id="stock${stocks.length-1}Market" class="cardStockMarket">Xetra</p><p id="stock${stocks.length-1}PriceHigh" class="cardStockPriceHigh">1.0</p><p id="stock${stocks.length-1}PriceLow" class="cardStockPriceLow">0.1</p><div class="floatFixer"></div>`;
                document.getElementById('stocks').appendChild(elem);
            }
        })
    }
});

document.getElementById('updateBtn').addEventListener('click', () => {
    // Update stocks with this button
    fetch(`./update/all`)
    .then((res) => {
        if(res.status !== 200) {
            throw new Error("Failure 1");
        } else {
            return res.json();
        }
        
    })
    .then((json) => {
        if(json.length > 0) {
            for(const [index, key] of json.entries()) {
                // name, currency, marked, price, marked status, day high, day low, currency symbol
                if(stocks[index] != undefined) {
                    stocks[index][1] = key[1];
                    stocks[index][2] = key[2];
                    stocks[index][3] = key[3];
                    stocks[index][4] = key[4];
                    stocks[index][5] = key[5];
                    stocks[index][6] = key[6];
                    stocks[index][7] = key[7];
                    
                    document.getElementById(`stock${index}`).innerHTML = stocks[index][0];
                    document.getElementById(`stock${index}Price`).innerHTML = `${stocks[index][3].toString()} ${stocks[index][1].toString()}`;
                    document.getElementById(`stock${index}MarketStatus`).innerHTML = `${(stocks[index][4] == "CLOSED" ? "Lukket" : "Åben")}`;
                    document.getElementById(`stock${index}Market`).innerHTML = stocks[index][2];
                    document.getElementById(`stock${index}PriceHigh`).innerHTML = `<i class="fas fa-arrow-circle-up"></i> ${stocks[index][5].toString()} ${stocks[index][7].toString()}`;
                    document.getElementById(`stock${index}PriceLow`).innerHTML = `<i class="fas fa-arrow-circle-down"></i> ${stocks[index][6].toString()} ${stocks[index][7].toString()}`;
                }
            }
        }
    })
});