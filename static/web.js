var counter = 15;
var previousPrices = {};

document.addEventListener('DOMContentLoaded', main);

function main() {
    document.getElementById("add-ticker-symbol").addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
        create();
    });

    // Start the countdown loop
    setInterval(refreshTime, 1000);
}

function create() {
    // Get the trimmed and uppercase value from the input text box
    const ticker_text = document.getElementById("new-ticker").value.trim().toUpperCase();

    // Check if the value is empty
    if (ticker_text === "") {
        // Exit the function if the value is empty
        return;
    }

    // Check if the ticker text is not already used
    if (!tickerAlreadyAdded(ticker_text)) {
        // Make AJAX call to fetch stock data
        fetchStockData(ticker_text);
    } else {
        showError('Ticker already added.');
    }

    // Clear the input box
    document.getElementById("new-ticker").value = "";
}

function tickerAlreadyAdded(ticker) {
    const tickerHeadings = document.querySelectorAll('.ticker-box h3');
    for (let i = 0; i < tickerHeadings.length; i++) {
        if (tickerHeadings[i].textContent.toUpperCase() === ticker) {
            return true;
        }
    }
    return false;
}

function fetchStockData(ticker) {
    fetch('/get_stock_data', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ticker: ticker
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ticker data not available');
            }
            return response.json();
        })
        .then(data => {
            if (data.currentPrice) {
                previousPrices[ticker] = data.currentPrice;
                createDivBox(ticker, data.currentPrice.toFixed(2));
            } else {
                showError('Please enter a valid ticker symbol.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Please enter a valid ticker symbol.');
        });
}

function createDivBox(ticker, price) {
    const div_box = document.createElement("div");

    // Add class for styling
    div_box.className = "ticker-box";

    // Set the text content to the uppercase value from the input text box
    const tickerHeading = document.createElement("h3");
    tickerHeading.textContent = ticker;
    div_box.appendChild(tickerHeading);

    const priceDiv = document.createElement("p");
    priceDiv.id = ticker + '-price';
    priceDiv.textContent = "Price: " + price;
    div_box.appendChild(priceDiv);

    const remove_button = document.createElement("button");
    remove_button.className = "remove";
    remove_button.innerHTML = "Remove";

    div_box.appendChild(remove_button);

    const ticker_grid = document.getElementById("tickers-grid");
    ticker_grid.appendChild(div_box);

    remove_button.addEventListener('click', () => remove(ticker));
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function refreshTime() {
    if (counter <= 0) {
        counter = 15;
        updateStockPrices();
    } else {
        counter--;
    }

    document.getElementById('counter').innerHTML = counter;
}

function remove(ticker) {
    // Remove the div box from the DOM
    const div_box = document.getElementById(ticker + '-price').parentNode;
    div_box.remove();
    delete previousPrices[ticker];
}

function updateStockPrices() {
    const tickerHeadings = document.querySelectorAll('.ticker-box h3');
    tickerHeadings.forEach(tickerHeading => {
        const ticker = tickerHeading.textContent;
        fetch('/get_stock_data', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ticker: ticker
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ticker data not available');
                }
                return response.json();
            })
            .then(data => {
                if (data.currentPrice) {
                    const priceDiv = document.getElementById(ticker + '-price');
                    const newPrice = data.currentPrice.toFixed(2);
                    const oldPrice = previousPrices[ticker];
                    previousPrices[ticker] = data.currentPrice;
                    priceDiv.textContent = "Price: " + newPrice;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error updating price for ' + ticker);
            });
    });
}
