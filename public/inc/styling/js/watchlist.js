// -- Config variables
let url = "localhost:3000";
let alertTime = 10000; // How long should the alert show (in ms)

// -- Operation variables
let currentAlert = 0;
document.addEventListener('DOMContentLoaded', () => {
    setInterval(checkUser(), 10000); checkUser();
});

function checkUser(){
    fetch(`http://localhost:3000/watchlist`)
    .then((res) => {
        if(res.status !== 200) {
            throw new Error("Something went wrong!");
        } else {
            return res.json();
        }
    })
    .then((json) => {
        if(json.loggedIn == 0) {
            window.location.href = `http://${url}/login.html`;
        }
    })
}

// name, currency, marked, price, marked status, day high, day low, currency symbol
let stocks = [];

document.getElementById('submitBtn').addEventListener('click', () => {
    let stockName = document.getElementById('stockName').value;
    if(stockName != undefined) {
        fetch(`/stocks/add?name=${stockName}`)
        .then((res) => {
            if(res.status !== 200) {
                throw new Error("Failure 1");
            } else {
                return res.json();
            }
        })
        .then((json) => {
            if(json.status == 1) {
                alert('success', 'Stock Added!');
                update();
            } else {
                alert('failure', 'Something went wrong!');
            }
        })
    }
});

function update(){
    fetch(`/stocks/update`)
        .then((res) => {
            if(res.status !== 200) {
                throw new Error("Failure 1");
            } else {
                return res.json();
            }
        })
        .then((json) => {
            for(stock of json) {
                let elem = document.createElement('div');
                elem.classList = 'stockCard';
                elem.innerHTML = `<h3 id="stock${stock[8]}" class="cardStockName">${stock[0]}</h3><p id="stock${stock[8]}Price" class="cardStockPrice">${stock[3]}</p><p id="stock${stock[8]}MarketStatus" class="cardStockMarketStatus">${stock[4]}</p><p id="stock${stock[8]}Market" class="cardStockMarket">${stock[2]}</p><p id="stock${stock[8]}PriceHigh" class="cardStockPriceHigh">${stock[5]}</p><p id="stock${stock[8]}PriceLow" class="cardStockPriceLow">${stock[6]}</p><div class="floatFixer"></div>`;
                document.getElementById('stocks').appendChild(elem);
            }
        })
}

document.getElementById('updateBtn').addEventListener('click', () => {
    // Update stocks with this button
    let cards = document.getElementsByClassName('stockCard');
    for(card of cards) {
        card.remove();
    }
    update();
});

function alert(type, msg) {
    if(msg != undefined && msg != "" && type != undefined && type != "") {
        let tmp = currentAlert;
        let elem = document.createElement('p');
        elem.classList = (type == "success" ? "alertMsg2" : "alertMsg1");
        elem.innerHTML = msg;
        elem.id = `alert${tmp}`;
        document.getElementById('alert').appendChild(elem);
        setTimeout(() => {
            document.getElementById(`alert${tmp}`).remove();
            currentAlert++;
        }, alertTime);
    }
}